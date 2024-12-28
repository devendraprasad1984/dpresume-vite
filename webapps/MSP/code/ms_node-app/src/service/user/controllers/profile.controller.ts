import {delay, inject, injectable} from "tsyringe";
import _ from "lodash";

import {ApiError, ApiResponse, IApiResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Hasher, ObjectMapper, UtcDate} from "fnpm/utils";

import {IMSPshipObjective, IProfile} from "ms-npm/profile-models";
import {IAudit, ITag, ITagList, TagCategory, TagType} from "ms-npm/base-models";
import {IUserIdentity} from "ms-npm/auth-models";

import {Profile, Tag} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {ProfileInclude} from "../db.includes";
import {ProfileService} from "../service/profile.service";
import {TagService} from "../service/tag.service";
import {Validator} from "../validator";
import {ProfileMapper} from "../mapper/profile-mapper";
import {ChatService} from "../service/chat.service";
import {UserResponse} from "stream-chat";

/**
 * Profile Controller declarations
 */
interface IProfileController {
    /**
     * Create new profile
     */
    createProfile(profileData: IProfile): Promise<IApiResponse<IProfile>>;

    /**
     * Get the all active profiles
     */
    getProfiles(): Promise<IApiResponse<IProfile[]>>;

    /**
     * Get the profile information for a specific profile id
     */
    getProfileById(profileId: number): Promise<IApiResponse<IProfile>>;

    /**
     * Get the profile information for a specific user id
     */
    getProfileByUserId(userId: number): Promise<IApiResponse<IProfile>>;

    /**
     * Update a specific profile
     */
    updateProfile(user: IUserIdentity, profileId: number, profileData: IProfile): Promise<IApiResponse<IProfile>>;

    /**
     * Delete a specific profile
     */
    deleteProfile(profileId: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * Profile Controller implementation
 */
@injectable()
export class ProfileController extends ProfileMapper implements IProfileController {
    /**
     * Profile Controller constructor
     *
     * @param {ProfileService} profileService profile database service dependency
     * @param {TagService} tagService tag database service dependency
     * @param {ChatService} chatService chat service dependency
     */
    constructor(
        @inject(delay(() => ProfileService)) private profileService: ProfileService,
        @inject(delay(() => TagService)) private tagService: TagService,
        @inject(delay(() => ChatService)) private chatService: ChatService
    ) {
        super();
    }

    /**
     * Create Profile method implementation
     *
     * @param {IProfile} profileData profile data
     * @returns {Promise<IApiResponse<IProfile>>} promise of type IApiResponse of type ProfileAPIResponse
     */
    async createProfile(profileData: IProfile): Promise<IApiResponse<IProfile>> {
        // validate
        if (Validator.isProfileDataValid(profileData)) {
            const createdBy = Hasher.guid();
            const createdOn = UtcDate.now();

            profileData.audit = {
                createdOn: createdOn,
                createdBy: createdBy,
                modifiedOn: undefined,
                modifiedBy: undefined
            };

            const tagList: Partial<ITag>[] = await this.manageTags(profileData.MSPshipObjectives, profileData.audit);

            const groupedTags = _.groupBy(tagList, "category");

            const capabilitiesTags = <ITagList>{tags: groupedTags[TagCategory.ICanProvide] ?? []};
            const experienceTags = <ITagList>{tags: groupedTags[TagCategory.IndustryExperience] ?? []};
            const interestTags = <ITagList>{tags: groupedTags[TagCategory.Interest] ?? []};
            const MSPshipGoalsTags = <ITagList>{tags: groupedTags[TagCategory.MSPshipGoals] ?? []};
            const skills = <ITagList>{tags: groupedTags[TagCategory.Skills] ?? []};

            profileData.MSPshipObjectives.capabilitiesProvided = capabilitiesTags;
            profileData.MSPshipObjectives.industryExperience = experienceTags;
            profileData.MSPshipObjectives.industryInterest = interestTags;
            profileData.MSPshipObjectives.MSPshipGoals = MSPshipGoalsTags;
            profileData.MSPshipObjectives.skills = skills;

            //map the data to create the new profile
            const newProfile = super.toDbProfileModel(profileData);
            //Set the new ref and audit
            newProfile.Ref = Hasher.guid();
            newProfile.CreatedOn = createdOn;
            newProfile.CreatedBy = createdBy;
            const r: Profile = await this.profileService.create(newProfile);

            if (r.Id) {
                profileData = super.fromDbProfileModel(r);
                return new ApiResponse(Status.OK, profileData);
            } else {
                // no profile, no id
                throw new ApiError(Status.Conflict, Message.Conflict);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     *
     * Return the list of active profiles
     *
     * @returns {Promise<IApiResponse<IProfile[]>>} List of active profiles
     */
    async getProfiles(): Promise<IApiResponse<IProfile[]>> {
        // filter all the active
        const filter: Partial<Profile> = {Status: RecordStatus.Active};

        const r: Profile[] = await this.profileService.filter(filter);
        const profileDataList: IProfile[] = [];
        //Convert the list
        r.forEach((profile: Profile) => {
            profileDataList.push(super.fromDbProfileModel(profile));
        });

        //return the list
        return new ApiResponse(Status.OK, profileDataList);
    }

    /**
     * Exist Profile method implementation
     *
     * @param {number} profileId profile id
     * @returns {Promise<IApiResponse<ProfileData>>} promise of type IApiResponse of type Profile data
     */
    async getProfileById(profileId: number): Promise<IApiResponse<IProfile>> {
        // validate
        if (profileId > 0) {
            const r: Profile = await this.profileService.single(profileId);

            const response = super.fromDbProfileModel(r);
            return new ApiResponse(Status.OK, response);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Returns a profile for a specific userId
     *
     * @param {number} userId user id
     * @returns {Promise<IApiResponse<IProfile>>} promise of type IApiResponse of type Profile data
     */
    async getProfileByUserId(userId: number): Promise<IApiResponse<IProfile>> {
        // validate
        if (userId > 0) {
            const filter: Partial<Profile> = {UserId: userId};
            const r: ProfileInclude[] = await this.profileService.filter(filter);

            const response = super.fromDbProfileModel(r[0]);
            return new ApiResponse(Status.OK, response);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Update a specific profile
     *
     * @param {IUserIdentity} user user object
     * @param {number} profileId Profile Id
     * @param {IProfile} profileData new Profile data
     * @returns {Promise<IApiResponse<IProfile>>} promise of type IApiResponse of type Profile data
     */
    async updateProfile(
        user: IUserIdentity,
        profileId: number,
        profileData: IProfile
    ): Promise<IApiResponse<IProfile>> {
        // validate
        if (profileId > 0 && Validator.isProfileDataValid(profileData, true)) {
            const userRef = user.ref;
            const currentDate = UtcDate.now();

            profileData.audit = {
                createdBy: userRef,
                createdOn: currentDate,
                modifiedBy: userRef,
                modifiedOn: currentDate
            };

            if (profileData.MSPshipObjectives) {
                const tagList: Partial<ITag>[] = await this.manageTags(
                    profileData.MSPshipObjectives,
                    profileData.audit,
                    true
                );

                const groupedTags = _.groupBy(tagList, "category");

                const capabilitiesTags =
                    profileData.MSPshipObjectives?.capabilitiesProvided !== undefined
                        ? <ITagList>{tags: groupedTags[TagCategory.ICanProvide] ?? []}
                        : undefined;
                const experienceTags =
                    profileData.MSPshipObjectives?.industryExperience !== undefined
                        ? <ITagList>{tags: groupedTags[TagCategory.IndustryExperience] ?? []}
                        : undefined;
                const interestTags =
                    profileData.MSPshipObjectives?.industryInterest !== undefined
                        ? <ITagList>{tags: groupedTags[TagCategory.Interest] ?? []}
                        : undefined;
                const MSPshipGoalsTags =
                    profileData.MSPshipObjectives?.MSPshipGoals !== undefined
                        ? <ITagList>{tags: groupedTags[TagCategory.MSPshipGoals] ?? []}
                        : undefined;
                const skills =
                    profileData.MSPshipObjectives?.skills !== undefined
                        ? <ITagList>{tags: groupedTags[TagCategory.Skills] ?? []}
                        : undefined;

                profileData.MSPshipObjectives.capabilitiesProvided = capabilitiesTags;
                profileData.MSPshipObjectives.industryExperience = experienceTags;
                profileData.MSPshipObjectives.industryInterest = interestTags;
                profileData.MSPshipObjectives.MSPshipGoals = MSPshipGoalsTags;
                profileData.MSPshipObjectives.skills = skills;
            }
            const updateProfile = super.toDbProfileModel(profileData);
            //Set the audit
            updateProfile.ModifiedOn = currentDate;
            updateProfile.ModifiedBy = userRef;

            const r: Profile = await this.profileService.update(profileId, updateProfile);

            const data = super.fromDbProfileModel(r);

            //check if we need to update in stream
            const updateStream = Validator.isUpdateStream(profileData.basicInfo);
            if (updateStream) {
                const userStream = {
                    id: userRef,
                    set: ObjectMapper.keyValueMapper<UserResponse>(profileData.basicInfo)
                };
                //we need to update stream
                this.chatService.updateUser(userStream);
            }

            return new ApiResponse(Status.OK, data);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete a specific profile
     *
     * @param {number} profileId Profile Id
     * @param {boolean} isHard Is Hard delete
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type Profile data
     */
    async deleteProfile(profileId: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        // validate
        if (profileId > 0) {
            const r: boolean = await this.profileService.delete(profileId, isHard);
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create a list will all the tag of the profile
     *
     * @param {IMSPshipObjective} MSPshipObjectives MSPship objetives section information
     * @returns {Partial<ITag>[]} return a List of all tags
     */
    private newTags(MSPshipObjectives: IMSPshipObjective): Partial<ITag>[] {
        let tags: Partial<ITag>[] = [];

        if (MSPshipObjectives) {
            tags = tags.concat(
                MSPshipObjectives.capabilitiesProvided ? MSPshipObjectives.capabilitiesProvided.tags : [],
                MSPshipObjectives.industryExperience ? MSPshipObjectives.industryExperience.tags : [],
                MSPshipObjectives.industryInterest ? MSPshipObjectives.industryInterest.tags : [],
                MSPshipObjectives.MSPshipGoals ? MSPshipObjectives.MSPshipGoals.tags : [],
                MSPshipObjectives.skills ? MSPshipObjectives.skills.tags : []
            );
        }
        return tags;
    }

    /**
     * Manage profile tags
     *
     * @param {IMSPshipObjective} MSPshipObjectives MSPship objetives section information
     * @param {IAudit} audit Audit record info
     * @param {boolean} isUpdate Audit record info
     * @returns {Partial<ITag>[]} return array of tags
     */
    private async manageTags(
        MSPshipObjectives: IMSPshipObjective,
        audit: IAudit,
        isUpdate: boolean = false
    ): Promise<Partial<ITag>[]> {
        let tags: Partial<ITag>[] = [];

        //retrieve all tags from profile
        const allTags: Partial<ITag>[] = this.newTags(MSPshipObjectives);

        //if there is no changes on tags, the same array will be returned
        tags = allTags;

        if (isUpdate) {
            const groupedTags = _.groupBy(allTags, "category");

            for (const key in groupedTags) {
                this.updateTagStatus(key, groupedTags[key], audit);
            }
        }

        //retrieve all the tags that do not have a DB id
        const tagsDB: Tag[] = allTags
            .filter((t: Partial<ITag>) => {
                return t.id == 0;
            })
            .map((t: ITag) => {
                t.ref = t.ref ?? Hasher.guid();
                t.type = TagType.User;
                const dbModel = super.toDbModel<Tag>(t);
                dbModel.CreatedBy = audit.createdBy;
                dbModel.CreatedOn = audit.createdOn as Date;
                return dbModel;
            });

        if (tagsDB.length > 0) {
            //save the new tags and and return the new tags that belong to the user
            const savedTags: Tag[] = (await this.tagService.createMany(tagsDB)).filter((t: Tag) => {
                return (t.Type = TagType.User);
            });

            //create a map with the current tags
            const mapAllTags = new Map(
                allTags.map((t: Partial<ITag>): [string, Partial<ITag>] => [`${t.text}-${t.category}-${t.id}`, t])
            );

            //create a map with the tags saved on the DB
            const mapSavedTags = new Map(
                savedTags.map((t: Tag): [string, Partial<ITag>] => [
                    `${t.Text}-${t.Category}-0`,
                    super.fromDbModel<ITag>(t)
                ])
            );

            //merge maps and update the values with the same keys
            tags = Array.from(new Map([...mapAllTags, ...mapSavedTags]).values());
        }

        return tags;
    }

    /**
     * Update stutus of removed tags
     *
     * @param {string} tagCategory  Field that will be updated on DB
     * @param {Partial<ITag>[]} tagValues Values of the tags send on the request
     * @param {IAudit} audit Audit information
     */
    private async updateTagStatus(tagCategory: string, tagValues: Partial<ITag>[], audit: IAudit) {
        //retrieve all the tags that are on the current UI request
        const currentUserTags: Tag[] = tagValues
            .filter((t: Partial<ITag>) => {
                t.type == TagType.User;
            })
            .map((t: ITag) => {
                return super.toDbModel<Tag>(t);
            });

        //get all the existent tags on DB
        const savedUserTagsDB = await this.tagService.filter({
            CreatedBy: audit.createdBy,
            Status: RecordStatus.Active,
            Type: TagType.User,
            Category: tagCategory
        });

        //search for the tags that are on DB but not in the profile
        const extraTags = savedUserTagsDB.filter((t: Tag) => {
            currentUserTags.find((tagSearch: Tag) => {
                tagSearch.Id == t.Id;
            }) == undefined;
        });

        //soft delete the extra tags
        extraTags.forEach(async (t: Tag) => {
            await this.tagService.update(t.Id, {
                Status: RecordStatus.Archived,
                ModifiedBy: audit.modifiedBy,
                ModifiedOn: audit.modifiedOn as Date
            });
        });
    }
}

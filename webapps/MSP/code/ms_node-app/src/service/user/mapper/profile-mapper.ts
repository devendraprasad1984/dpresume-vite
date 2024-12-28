import objectMapper from "object-mapper";

import {Checker} from "fnpm/validators";
import {StringFormatter} from "fnpm/utils";
import {IUserSearch} from "ms-npm/admin-models";
import {Role} from "ms-npm/auth-models";
import {ModelMapper} from "ms-npm/model-mapper";
import {IEducationHistory, IProfile, IWorkHistory} from "ms-npm/profile-models";
import {IUser} from "ms-npm/user-models";
import {ILocation, State} from "ms-npm/base-models";
import {IPeopleSearch, PeopleConnectedStatus} from "ms-npm/search-models";

import {EducationHistory, Profile, WorkHistory} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {UserInclude} from "../db.includes";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * To db model method declaration
     */
    toDbModel<T>(source: object): T;

    /**
     * From db model declaration
     */
    fromDbModel<T>(source: object): T;

    /**
     * From db to Company model method declaration
     */
    fromDbUserModel(user: UserInclude): IUserSearch;
}

/**
 * Model mapper class implementation
 */
export class ProfileMapper extends ModelMapper implements IModelMapper {
    /**
     * Profile mapper constructor
     */
    constructor() {
        super();
    }

    /**
     * Mapper method to convert object to Db model
     *
     * @param {IProfile} source source object to be mapped to db model
     * @returns {Profile} mapped db model
     */
    toDbProfileModel(source: IProfile): Profile {
        const map = {
            id: "Id",
            ref: "Ref",
            userId: "UserId",
            claimCode: "ClaimCode",
            status: "Status",
            text: "Text",
            "personalData.ethnicity": "Ethnicity",
            "MSPshipObjectives.lookingFor": "LookingFor",
            "MSPshipObjectives.yearsExperience": "YearsExperience",
            "basicInfo.firstName": "FirstName",
            "basicInfo.lastName": "LastName",
            "basicInfo.pronouns": "Pronouns",
            "basicInfo.headline": "Headline",
            "basicInfo.companyHeadline": "CompanyHeadline",
            "basicInfo.picture": "Picture",
            "basicInfo.city": "City",
            "basicInfo.state": "State",
            "publicContactInfo.website": "Website",
            "publicContactInfo.linkedin": "Linkedin",
            "publicContactInfo.facebook": "Facebook",
            "publicContactInfo.instagram": "Instagram",
            "publicContactInfo.twitter": "Twitter",
            bio: "Bio",
            "MSPshipObjectives.capabilitiesProvided": "CapabilitiesProvided",
            "MSPshipObjectives.MSPshipGoals": "MSPshipGoals",
            "MSPshipObjectives.industryExperience": "IndustryExperience",
            "MSPshipObjectives.skills": "Skills",
            "MSPshipObjectives.industryInterest": "IndustryInterest",
            "privateContactInfo.email": "Email",
            "privateContactInfo.phone": "PhoneNumber",
            "notifications.isAppMessagingAllowed": "IsAppMessagingAllowed",
            "notifications.isPushNotificationAllowed": "IsPushNotificationAllowed",
            "personalData.memberGroup": "GroupMember"
        };

        const profile = objectMapper.merge(source, map) as unknown as Profile;

        if (!Checker.isNullOrEmpty(profile.State)) {
            profile.State = Object.keys(State)[Object.values(State).indexOf(<State>source.basicInfo.state)].replace(
                /_/g,
                " "
            );
        }

        if (!Checker.isNullOrEmpty(profile.City)) {
            profile.City = StringFormatter.capitalizeSentence(profile.City);
        }

        return profile;
    }

    /**
     * Mapper method to convert db model to object
     *
     * @param {object} source db model to be converted
     * @returns {T} converted object
     */
    fromDbProfileModel(source: object): IProfile {
        const map = {
            Id: "id?",
            Ref: "ref?",
            UserId: "userId?",
            ClaimCode: "claimCode?",
            User: "user?",
            Status: "status?",
            Ethnicity: "personalData.ethnicity?",
            LookingFor: "MSPshipObjectives.lookingFor?",
            YearsExperience: "MSPshipObjectives.yearsExperience?",
            FirstName: "basicInfo.firstName?",
            LastName: "basicInfo.lastName?",
            Pronouns: "basicInfo.pronouns?",
            Headline: "basicInfo.headline?",
            CompanyHeadline: "basicInfo.companyHeadline",
            Picture: "basicInfo.picture?",
            City: "basicInfo.city?",
            State: "basicInfo.state?",
            Website: "publicContactInfo.website?",
            Linkedin: "publicContactInfo.linkedin?",
            Facebook: "publicContactInfo.facebook?",
            Instagram: "publicContactInfo.instagram?",
            Twitter: "publicContactInfo.twitter?",
            Bio: "bio?",
            CapabilitiesProvided: "MSPshipObjectives.capabilitiesProvided?",
            MSPshipGoals: "MSPshipObjectives.MSPshipGoals?",
            IndustryExperience: "MSPshipObjectives.industryExperience?",
            Skills: "MSPshipObjectives.skills?",
            IndustryInterest: "MSPshipObjectives.industryInterest?",
            Email: "privateContactInfo.email?",
            PhoneNumber: "privateContactInfo.phone?",
            IsAppMessagingAllowed: "notifications.isAppMessagingAllowed?",
            IsPushNotificationAllowed: "notifications.isPushNotificationAllowed?",
            GroupMember: "personalData.memberGroup?",
            EducationHistory: "educationHistory?",
            WorkHistory: "workHistory?",
            CreatedOn: "audit.createdOn?",
            CreatedBy: "audit.createdBy?",
            ModifiedOn: "audit.modifiedOn?",
            ModifiedBy: "audit.modifiedBy?"
        };

        const profile: IProfile = objectMapper.merge(source, map) as unknown as IProfile;
        if (profile) {
            profile.user = profile.user ? super.fromDbModel<IUser>(profile.user) : <IUser>{};
            if (profile.workHistory) {
                profile.workHistory = (profile.workHistory as unknown as WorkHistory[]).map((wh: WorkHistory) =>
                    super.fromDbModel<IWorkHistory>(wh)
                );
            }
            if (profile.educationHistory) {
                profile.educationHistory = (profile.educationHistory as unknown as EducationHistory[]).map(
                    (eh: EducationHistory) => super.fromDbModel<IEducationHistory>(eh)
                );
            }
            if (!Checker.isNullOrEmpty(profile.basicInfo?.state)) {
                profile.basicInfo.state = State[profile.basicInfo.state.replace(/\s/g, "_")];
            }
        }

        return profile ?? <IProfile>{};
    }

    /**
     * User delete implementation
     *
     * @param {UserInclude} user Data source object
     * @returns {IUserSearch} Return converted data to UI model.
     */
    fromDbUserModel(user: UserInclude): IUserSearch {
        let profile: Profile;

        if (user.Profile && user.Profile.length > 0) {
            profile = user.Profile[0];
        }

        const userSearch: IUserSearch = {
            id: user.Id,
            ref: user.Ref,
            status: <RecordStatus>user.Status,
            role: <Role>user.Role,
            sub: user.Sub,
            lastLogin: user.LastLogin,
            companyHeadline: profile.CompanyHeadline,
            email: profile?.Email ? profile.Email : "",
            firstName: profile.FirstName,
            lastName: profile.LastName,
            notesCount: user.Note ? user.Note.length : 0,
            headline: profile.Headline,
            pronouns: profile.Pronouns,
            picture: profile.Picture,
            isOnline: false,
            audit: {
                createdBy: user.CreatedBy,
                createdOn: user.CreatedOn,
                modifiedBy: user.ModifiedBy,
                modifiedOn: user.ModifiedOn
            }
        };

        return userSearch;
    }

    /**
     * Get user connections
     *
     * @param {any} connection Data source object
     * @returns {IPeopleSearch} Return converted data to UI model.
     */
    fromDbConnectionModel(connection: object): IPeopleSearch {
        const userSearch: IPeopleSearch = {
            userId: connection["f0"],
            profileId: connection["f1"],
            role: connection["f2"],
            ref: connection["f3"],
            firstName: connection["f4"],
            lastName: connection["f5"],
            pronouns: connection["f6"],
            headline: connection["f7"],
            companyHeadline: connection["f8"],
            picture: connection["f9"],
            lookingFor: connection["f10"],
            connectStatus: <PeopleConnectedStatus>connection["f11"],
            isOnline: null
        };

        return userSearch;
    }

    /**
     * Return UI location model
     *
     * @param {object} source Profile info
     * @returns {ILocation} Return converted data to UI model.
     */
    fromDbLocationModel(source: object): ILocation {
        const map = {
            City: "city?",
            State: "state?",
            CreatedOn: "audit.createdOn?",
            CreatedBy: "audit.createdBy?",
            ModifiedOn: "audit.modifiedOn?",
            ModifiedBy: "audit.modifiedBy?"
        };

        const location: ILocation = objectMapper.merge(source, map) as unknown as ILocation;

        return location ?? <ILocation>{};
    }
}

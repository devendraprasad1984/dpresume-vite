import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {Hasher} from "fnpm/utils";

import {ITag, ITagList, TagType} from "ms-npm/base-models";
import {ModelMapper} from "ms-npm/model-mapper";

import {Profile, Tag} from "/opt/nodejs/node14/db/client-mysql";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {TagService} from "../service/tag.service";
import {ProfileService} from "../service/profile.service";
import {UserService} from "../service/user.service";

/**
 * Tag Controller declarations
 */
interface ITagController {
    /**
     * filter method
     *
     * @returns {Promise<IApiResponse<ITag[]>>} promise of type IApiResponse of type string
     */
    filter(filter?: IWhereFilter<Tag>): Promise<IApiResponse<ITag[]>>;

    /**
     * delete method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class TagController extends ModelMapper implements ITagController {
    /**
     * Tag Controller constructor
     *
     * @param {TagService} tagService Tag database service dependency
     * @param {ProfileService} profileService Profile database service dependency
     * @param {UserService} userService User databse service dependency
     */
    constructor(
        @inject(delay(() => TagService)) private tagService: TagService,
        @inject(delay(() => ProfileService)) private profileService: ProfileService,
        @inject(delay(() => UserService)) private userService: UserService
    ) {
        super();
    }

    // methods
    /**
     * Returns specific tag by id
     *
     * @param {IWhereFilter<Tag>} filter Filter query
     * @returns {Promise<IApiResponse<ITag>>} promise of type IApiResponse of type Profile data
     */
    async filter(filter?: IWhereFilter<Tag>): Promise<IApiResponse<ITag[]>> {
        const r = await this.tagService.filter(filter);

        let tagUI: ITag[] = [];

        if (r) {
            tagUI = r.map((t: Tag) => super.fromDbModel<ITag>(t));
        }

        return new ApiResponse(Status.OK, tagUI);
    }

    /**
     * Tag delete implementation
     *
     * @param {number} id Tag id to delete
     * @param {boolean} isHard Specify if delete is hard or soft
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        if (id > 0) {
            //Validate if tag exist on DB
            const tagDB = await this.tagService.single({Id: id});

            if (tagDB) {
                //Validate if the tag is created by user
                if (tagDB.Type == TagType.User) {
                    const userDB = await this.userService.single({Ref: tagDB.CreatedBy});

                    if (userDB) {
                        //Get the tag owner profile
                        const profileDB = await this.profileService.filter({
                            UserId: userDB.Id,
                            Status: RecordStatus.Active
                        });

                        if (profileDB) {
                            const fieldTags: ITagList = <ITagList>{};

                            fieldTags.tags = this.tagService.removeTagFromList(profileDB[0], tagDB.Category, tagDB.Id);
                            const profileUpdate: Partial<Profile> = {[tagDB.Category]: fieldTags};

                            await this.profileService.update(profileDB[0].Id, profileUpdate);
                        }
                    }
                }

                //TODO remove Hasher and replace with token information
                const r: boolean = await this.tagService.delete(id, isHard, Hasher.guid());

                return new ApiResponse(Status.OK, r);
            }
        }

        throw new ApiError(Status.BadRequest, Message.InvalidData);
    }
}

import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";
import {Prisma, Tag} from "/opt/nodejs/node14/db/client-mysql";

import {ITag, ITagList, TagCategory} from "ms-npm/base-models";

import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {ProfileInclude} from "../db.includes";

/**
 * Tag service implementation
 */
@injectable()
export class TagService {
    /**
     * Tag Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    // methods
    /**
     * Tag retrieve implementation
     *
     * @param {Partial<Tag>} filter Unique identifies to filter the query
     * @returns {Tag} return a specific tag
     */
    async single(filter: Partial<Tag>): Promise<Tag> {
        try {
            return this.service.retrieveUnique<Tag>(Prisma.ModelName.Tag, filter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get tag array
     *
     * @param {IWhereFilter<Tag>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Tag[]>} Return promise with tag array
     */
    async filter(
        filter?: IWhereFilter<Tag>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Tag[]> {
        try {
            return await this.service.retrieve<Tag>(
                Prisma.ModelName.Tag,
                filter,
                undefined,
                orderBy,
                skip,
                take,
                select
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Tag create implementation
     *
     * @param {Tag} tag Tag information to save
     * @returns {Tag} Return new tag information
     */
    async create(tag: Tag): Promise<Tag> {
        try {
            return await this.service.create<Tag>(Prisma.ModelName.Tag, tag);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Tag create implementation
     *
     * @param {Tag} tag Tag information to save
     * @returns {Tag} Return new tag information
     */
    async createMany(tag: Tag[]): Promise<Tag[]> {
        try {
            const r = await this.service.createMany<Tag>(Prisma.ModelName.Tag, tag);

            if (r.count > 0) {
                return this.filter({
                    CreatedBy: tag[0].CreatedBy,
                    Status: RecordStatus.Active,
                    CreatedOn: tag[0].CreatedOn
                });
            }

            return [];
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Tag update implementation
     *
     * @param {number} id Tag id number
     * @param {Partial<Tag>} tag  Tag information to save
     * @returns {Tag} Return new tag information
     */
    async update(id: number, tag: Partial<Tag>): Promise<Tag> {
        try {
            const source: Tag = <Tag>{};
            source.Id = id;

            return await this.service.update<Tag>(Prisma.ModelName.Tag, id, tag);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Tag delete implementation
     *
     * @param {number} id Tag id to delete
     * @param {boolean} isHard is Hard delete
     * @param {string} userRef Reference user that is deleting the record
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean, userRef?: string): Promise<boolean> {
        try {
            const tag: Tag = <Tag>{};
            tag.Id = id;

            const r: Tag = await this.service.delete<Tag>(Prisma.ModelName.Tag, id, isHard, userRef);

            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Remove tag with the specified id and return new array
     *
     * @param {ProfileInclude} profileDB User profiles information
     * @param {string} category Tag category
     * @param {number} id Tag id to be removed
     * @returns {Partial<ITag>[]} Return new array without the indicated tag
     */
    removeTagFromList(profileDB: ProfileInclude, category: string, id: number): Partial<ITag>[] {
        let fieldTags: ITagList = <ITagList>{};

        switch (category) {
            case TagCategory.ICanProvide:
                fieldTags = profileDB.CapabilitiesProvided as unknown as ITagList;
                break;
            case TagCategory.IndustryExperience:
                fieldTags = profileDB.IndustryExperience as unknown as ITagList;
                break;
            case TagCategory.Interest:
                fieldTags = profileDB.IndustryInterest as unknown as ITagList;
                break;
            case TagCategory.MSPshipGoals:
                fieldTags = profileDB.MSPshipGoals as unknown as ITagList;
                break;
            case TagCategory.Skills:
                fieldTags = profileDB.Skills as unknown as ITagList;
                break;
        }

        const updatedTags: Partial<ITag>[] = fieldTags.tags.filter((tag: ITag) => {
            return tag.id != id;
        });

        return updatedTags;
    }
}

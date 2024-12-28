import {inject, injectable} from "tsyringe";

import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Status} from "fnpm/enums";

import {Profile, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

import {ProfileInclude} from "../db.includes";
import {Any} from "fnpm/types";

/**
 *  Profile Service declarations
 */
interface IProfileService {
    /**
     * Create profile method declaration
     *
     */
    create(profile: Profile): Promise<Profile>;

    /**
     * Retrieve profile method declaration
     *
     */
    single(profileId: number): Promise<Profile>;

    /**
     * Filter profile method declaration
     *
     */
    filter(
        filter?: IWhereFilter<Profile>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Profile[]>;

    /**
     * Update profile method declaration
     *
     */
    update(id: number, profile: Partial<Profile>): Promise<Profile>;

    /**
     * Update profile method declaration
     *
     */
    delete(id: number, isHard?: boolean): Promise<boolean>;
}

/**
 * Profile service implementation
 */
@injectable()
export class ProfileService implements IProfileService {
    /**
     * Profile Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    // methods
    /**
     * Profile retrieve implementation
     *
     * @param {number} profileId  Id of the requested profile
     * @returns {Profile} return a specific profile
     */
    async single(profileId: number): Promise<ProfileInclude> {
        try {
            const filter: Partial<Profile> = {Id: profileId};
            const includes = {
                [Prisma.ModelName.User]: true,
                [Prisma.ModelName.WorkHistory]: true,
                [Prisma.ModelName.EducationHistory]: true
            };

            return this.service.retrieveUnique<ProfileInclude>(Prisma.ModelName.Profile, filter, includes);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get profile array
     *
     * @param {IWhereFilter<Profile>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Profile[]>} Return promise with profile array
     */
    async filter(
        filter?: IWhereFilter<Profile>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<ProfileInclude[]> {
        try {
            const includes = {
                [Prisma.ModelName.User]: true,
                [Prisma.ModelName.WorkHistory]: true,
                [Prisma.ModelName.EducationHistory]: true
            };

            return this.service.retrieve<ProfileInclude>(
                Prisma.ModelName.Profile,
                filter,
                includes,
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
     * Get pagination data
     *
     * @param {IWhereFilter<Profile>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<UserInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async retrievePaginated(
        filter?: IWhereFilter<Profile>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<ProfileInclude[]>> {
        try {
            return this.service.retrievePaginated<ProfileInclude>(
                Prisma.ModelName.Profile,
                orderBy,
                pagination.perPage,
                pagination.page,
                filter,
                undefined,
                select,
                distinct
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Profile create implementation
     *
     * @param {Profile} profile Profile information to save
     * @returns {Profile} Return new profile information
     */
    async create(profile: Profile): Promise<Profile> {
        try {
            return this.service.create<Profile>(Prisma.ModelName.Profile, profile);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Profile update implementation
     *
     * @param {number} id Profile id number
     * @param {Partial<Profile>} profile  Profile information to save
     * @returns {Profile} Return new profile information
     */
    async update(id: number, profile: Partial<Profile>): Promise<Profile> {
        try {
            const source: Profile = <Profile>{};
            source.Id = id;

            return this.service.update<Profile>(Prisma.ModelName.Profile, id, profile);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Profile delete implementation
     *
     * @param {number} id Profile id to delete
     * @param {boolean} isHard is Hard delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const profile: Profile = <Profile>{};
            profile.Id = id;

            const r: Profile = await this.service.delete<Profile>(Prisma.ModelName.Profile, id, isHard);

            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

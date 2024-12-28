import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {Prisma, Info} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {Any} from "fnpm/types";

/**
 * Info Service declarations
 */
interface IInfoService {
    /**
     * Retrieve info
     *
     * @returns {Info} returns Info object
     */
    single(filter: Partial<Info>): Promise<Info>;

    /**
     * Retrieve info by filter
     *
     * @param {number} id info id
     * @returns {Info[]} return info object
     */
    filter(
        filter?: IWhereFilter<Info>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Info[]>;

    /**
     * Retrieve info paginated
     *
     * @param {IWhereFilter<Info>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<Info[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    retrievePaginated(
        filter?: IWhereFilter<Info>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<Info[]>>;

    /**
     * Create info implementation
     *
     * @param {IInfo} info info object from UI Model
     * @returns {Info} return new info information
     */
    create(info: Info): Promise<Info>;

    /**
     * Update info implementation
     *
     * @param {number} id info id
     * @param {IInfo} info info UI model
     */
    update(id: number, info: Info): Promise<Info>;

    /**
     * Delete info implementation
     *
     * @param {number} id info id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * Info service implementation
 */
@injectable()
export class InfoService implements IInfoService {
    /**
     * Info Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    // methods
    /**
     * Info retrieve implementation
     *
     * @param {Partial<Info>} filter  Query params of the wanted info
     * @returns {Info} return array of company info
     */
    async single(filter: Partial<Info>): Promise<Info> {
        try {
            return this.service.retrieveUnique<Info>(Prisma.ModelName.Info, filter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get info array
     *
     * @param {IWhereFilter<Info>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Info[]>} Return promise with info array
     */
    async filter(
        filter?: IWhereFilter<Info>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Info[]> {
        try {
            return this.service.retrieve<Info>(Prisma.ModelName.Info, filter, undefined, orderBy, skip, take, select);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get pagination data
     *
     * @param {IWhereFilter<Info>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<Info[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async retrievePaginated(
        filter?: IWhereFilter<Info>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<Info[]>> {
        try {
            return this.service.retrievePaginated<Info>(
                Prisma.ModelName.Info,
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
     * Info create implementation
     *
     * @param {Info} info Info information to save
     * @returns {Info} Return new info information
     */
    async create(info: Info): Promise<Info> {
        try {
            return this.service.create<Info>(Prisma.ModelName.Info, info);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Info update implementation
     *
     * @param {number} id Info id number
     * @param {Info} info  Info information to save
     * @returns {Info} Return new info information
     */
    async update(id: number, info: Partial<Info>): Promise<Info> {
        try {
            return this.service.update<Info>(Prisma.ModelName.Info, id, info);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Info delete implementation
     *
     * @param {number} id Info id to delete
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: Info = await this.service.delete<Info>(Prisma.ModelName.Info, id, isHard);
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

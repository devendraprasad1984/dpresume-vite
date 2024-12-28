import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";

import {Prisma, MemberRequest} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Connection Service declarations
 */
interface IConnectionService {
    /**
     * Retrieve info
     *
     * @returns {MemberRequest} returns Member request object
     */
    single(filter: Partial<MemberRequest>): Promise<MemberRequest>;

    /**
     * Retrieve Member request by filter
     *
     * @param {IWhereFilter<MemberRequest>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {MemberRequest[]} return info object
     */
    filter(
        filter?: IWhereFilter<MemberRequest>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<MemberRequest[]>;

    /**
     * Create info implementation
     *
     * @param {IMemberRequest} info info object from UI Model
     * @returns {MemberRequest} return new info information
     */
    create(info: MemberRequest): Promise<MemberRequest>;

    /**
     * Update info implementation
     *
     * @param {number} id info id
     * @param {IMemberRequest} info info UI model
     */
    update(id: number, info: MemberRequest): Promise<MemberRequest>;

    /**
     * Delete info implementation
     *
     * @param {number} id info id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * Connection service implementation
 */
@injectable()
export class ConnectionService implements IConnectionService {
    /**
     * Connection Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    // methods
    /**
     * Member request retrieve implementation
     *
     * @param {Partial<MemberRequest>} filter  Query params of the wanted info
     * @returns {MemberRequest} return array of company info
     */
    async single(filter: Partial<MemberRequest>): Promise<MemberRequest> {
        try {
            return this.service.retrieveUnique<MemberRequest>(Prisma.ModelName.MemberRequest, filter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get Member request array
     *
     * @param {IWhereFilter<MemberRequest>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<MemberRequest[]>} Return promise with info array
     */
    async filter(
        filter?: IWhereFilter<MemberRequest>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<MemberRequest[]> {
        try {
            return this.service.retrieve<MemberRequest>(
                Prisma.ModelName.MemberRequest,
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
     * Member request create implementation
     *
     * @param {MemberRequest} info MemberRequest information to save
     * @returns {MemberRequest} Return new info information
     */
    async create(info: MemberRequest): Promise<MemberRequest> {
        try {
            return this.service.create<MemberRequest>(Prisma.ModelName.MemberRequest, info);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Member request update implementation
     *
     * @param {number} id Member request id number
     * @param {MemberRequest} info  Member request information to save
     * @returns {MemberRequest} Return new info information
     */
    async update(id: number, info: Partial<MemberRequest>): Promise<MemberRequest> {
        try {
            return this.service.update<MemberRequest>(Prisma.ModelName.MemberRequest, id, info);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Member request delete implementation
     *
     * @param {number} id MemberRequest id to delete
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: MemberRequest = await this.service.delete<MemberRequest>(
                Prisma.ModelName.MemberRequest,
                id,
                isHard
            );
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

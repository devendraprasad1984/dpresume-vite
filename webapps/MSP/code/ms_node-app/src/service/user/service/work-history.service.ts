import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";

import {Prisma, WorkHistory} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 * WorkHistory Service declarations
 */
interface IWorkHistoryService {
    /**
     * Retrieve WorkHistory
     *
     * @returns {WorkHistory} returns array of WorkHistory
     */
    single(id: number): Promise<WorkHistory>;

    /**
     * Retrieve WorkHistory by filter
     *
     * @param {number} id WorkHistory id
     * @returns {WorkHistory[]} return WorkHistory object
     */
    filter(filter?: IWhereFilter<WorkHistory>, orderBy?: ISort, skip?: number, take?: number): Promise<WorkHistory[]>;

    /**
     * Create WorkHistory implementation
     *
     * @param {IWorkHistory} workHistory workHistory object from UI Model
     * @returns {WorkHistory} return new WorkHistory information
     */
    create(workHistory: WorkHistory): Promise<WorkHistory>;

    /**
     * Update WorkHistory implementation
     *
     * @param {number} id WorkHistory id
     * @param {IWorkHistory} workHistory WorkHistory UI model
     */
    update(id: number, workHistory: WorkHistory): Promise<WorkHistory>;

    /**
     * Delete WorkHistory implementation
     *
     * @param {number} id WorkHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * WorkHistory service implementation
 */
@injectable()
export class WorkHistoryService implements IWorkHistoryService {
    /**
     * WorkHistoryService constructor
     *
     * @param {DbRepo<MySqlClient>} dbService database service dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    //methods
    /**
     * Retrieve WorkHistory
     *
     * @param {number} id WorkHistory id
     * @returns {Promise<WorkHistory>} promise of type WorkHistory
     */
    async single(id: number): Promise<WorkHistory> {
        try {
            const filter = {Id: id};
            return this.dbService.retrieveUnique<WorkHistory>(Prisma.ModelName.WorkHistory, filter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Retrieve WorkHistory by filter
     *
     * @param {IWhereFilter<WorkHistory>} filter filter to get data
     * @param {ISort} orderBy order by use
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<WorkHistory[]>} promise of type WorkHistory[]
     */
    async filter(
        filter?: IWhereFilter<WorkHistory>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<WorkHistory[]> {
        try {
            return this.dbService.retrieve<WorkHistory>(
                Prisma.ModelName.WorkHistory,
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
     * Create WorkHistory implementation
     *
     * @param {IWorkHistory} workHistory WorkHistory UI model
     * @returns {Promise<WorkHistory>} promise of type WorkHistory
     */
    async create(workHistory: WorkHistory): Promise<WorkHistory> {
        try {
            return this.dbService.create<WorkHistory>(Prisma.ModelName.WorkHistory, workHistory);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update WorkHistory implementation
     *
     * @param {number} id WorkHistory id
     * @param {IWorkHistory} workHistory WorkHistory UI model
     * @returns {Promise<WorkHistory>} promise of type WorkHistory
     */
    async update(id: number, workHistory: Partial<WorkHistory>): Promise<WorkHistory> {
        try {
            return this.dbService.update<WorkHistory>(Prisma.ModelName.WorkHistory, id, workHistory);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Delete WorkHistory implementation
     *
     * @param {number} id WorkHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {Promise<boolean>} promise of type boolean
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: WorkHistory = await this.dbService.delete<WorkHistory>(Prisma.ModelName.WorkHistory, id, isHard);
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

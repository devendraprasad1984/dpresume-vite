import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";

import {Prisma, EducationHistory} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 * EducationHistory Service declarations
 */
interface IEducationHistoryService {
    /**
     * Retrieve EducationHistory
     *
     * @returns {EducationHistory} returns array of EducationHistory
     */
    single(id: number): Promise<EducationHistory>;

    /**
     * Retrieve EducationHistory by filter
     *
     * @returns {EducationHistory[]} return EducationHistory object
     */
    filter(
        filter?: IWhereFilter<EducationHistory>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<EducationHistory[]>;

    /**
     * Create EducationHistory implementation
     *
     * @param {IEducationHistory} educationHistory educationHistory object from UI Model
     * @returns {EducationHistory} return new EducationHistory information
     */
    create(educationHistory: EducationHistory): Promise<EducationHistory>;

    /**
     * Update EducationHistory implementation
     *
     * @param {number} id EducationHistory id
     * @param {IEducationHistory} educationHistory EducationHistory UI model
     */
    update(id: number, educationHistory: EducationHistory): Promise<EducationHistory>;

    /**
     * Delete EducationHistory implementation
     *
     * @param {number} id EducationHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * EducationHistory service implementation
 */
@injectable()
export class EducationHistoryService implements IEducationHistoryService {
    /**
     * EducationHistoryService constructor
     *
     * @param {DbRepo<MySqlClient>} dbService database service dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    //methods
    /**
     * Retrieve EducationHistory
     *
     * @param {number} id EducationHistory id
     * @returns {Promise<EducationHistory>} promise of type EducationHistory
     */
    async single(id: number): Promise<EducationHistory> {
        try {
            return this.dbService.retrieveUnique<EducationHistory>(Prisma.ModelName.EducationHistory, {Id: id});
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Retrieve EducationHistory by filter
     *
     * @param {IWhereFilter<EducationHistory>} filter filter to get data
     * @param {ISort} orderBy order by use
     * @param {number} skip skip use
     * @param {number} take take use
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<EducationHistory[]>} promise of type EducationHistory[]
     */
    async filter(
        filter?: IWhereFilter<EducationHistory>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<EducationHistory[]> {
        try {
            return this.dbService.retrieve<EducationHistory>(
                Prisma.ModelName.EducationHistory,
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
     * Create EducationHistory implementation
     *
     * @param {IEducationHistory} educationHistory EducationHistory UI model
     * @returns {Promise<EducationHistory>} promise of type EducationHistory
     */
    async create(educationHistory: EducationHistory): Promise<EducationHistory> {
        try {
            return this.dbService.create<EducationHistory>(Prisma.ModelName.EducationHistory, educationHistory);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update EducationHistory implementation
     *
     * @param {number} id EducationHistory id
     * @param {IEducationHistory} educationHistory EducationHistory UI model
     * @returns {Promise<EducationHistory>} promise of type EducationHistory
     */
    async update(id: number, educationHistory: Partial<EducationHistory>): Promise<EducationHistory> {
        try {
            return this.dbService.update<EducationHistory>(Prisma.ModelName.EducationHistory, id, educationHistory);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Delete EducationHistory implementation
     *
     * @param {number} id EducationHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {Promise<boolean>} promise of type boolean>
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: EducationHistory = await this.dbService.delete<EducationHistory>(
                Prisma.ModelName.EducationHistory,
                id,
                isHard
            );

            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

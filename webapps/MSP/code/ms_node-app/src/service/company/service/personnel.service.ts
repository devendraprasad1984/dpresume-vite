import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {Any} from "fnpm/types";
import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {Prisma, Personnel, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";

import {PersonnelInclude} from "../db.includes";

/**
 * Personnel Service declarations
 */
interface IPersonnelService {
    /**
     * Retrieve personnel by filter
     *
     * @param {number} id personnel id
     * @returns {PersonnelInclude[]} return personnel object
     */
    filter(
        filter?: IWhereFilter<Personnel>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<PersonnelInclude[]>;

    /**
     * Create Personnel implementation
     *
     * @param {Personnel[]} personnel personnel array object
     * @returns {Personnel} return new user information
     */
    create(personnel: Personnel[]): Promise<number>;

    /**
     * Update personnel implementation
     *
     * @param {number} id personnel id
     * @param {Partial<Personnel>} personnel new personnel Role
     */
    update(id: number, personnel: Partial<Personnel>): Promise<Personnel>;

    /**
     * Delete personnel implementation
     *
     * @param {number} id personnel id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * Personnel service implementation
 */
@injectable()
export class PersonnelService implements IPersonnelService {
    /**
     * Personnel Controller constructor
     *
     * @param {DbRepo<MySqlClient>} dbService database service dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    /**
     * Get personnel array
     *
     * @param {IWhereFilter<Personnel>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<PersonnelInclude[]>} Return promise with personnel array
     */
    async filter(
        filter?: IWhereFilter<Personnel>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<PersonnelInclude[]> {
        try {
            return this.dbService.retrieve<PersonnelInclude>(
                Prisma.ModelName.Personnel,
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
     * Get pagination data
     *
     * @param {IWhereFilter<Personnel>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async retrievePaginated(
        filter?: IWhereFilter<Personnel>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<PersonnelInclude[]>> {
        try {
            return this.dbService.retrievePaginated<PersonnelInclude>(
                Prisma.ModelName.Personnel,
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
     * Create Personnel implementation
     *
     * @param {Personnel} personnel personnel object from UI Model
     * @returns {Personnel} return new user information
     */
    async create(personnel: Personnel[]): Promise<number> {
        try {
            const r = await this.dbService.createMany<Personnel>(Prisma.ModelName.Personnel, personnel);
            return r.count;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update personnel
     *
     * @param {number} id personnel id
     * @param {Partial<Personnel>} personnel new personnel Role
     * @returns {Personnel} Return new personnel information
     */
    async update(id: number, personnel: Partial<Personnel>): Promise<Personnel> {
        try {
            return this.dbService.update<Personnel>(Prisma.ModelName.Personnel, id, personnel);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Personnel delete implementation
     *
     * @param {number} id Personnel id to delete
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: Personnel = await this.dbService.delete<Personnel>(Prisma.ModelName.Personnel, id, isHard);
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

import {inject, injectable} from "tsyringe";

import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Status} from "fnpm/enums";

import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {Prisma, Company} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

import {CompanyInclude} from "../db.includes";
import {Any} from "fnpm/types";

/**
 * Company Service Declarations
 */
interface ICompanyService {
    /**
     * Company retrieve declaration
     *
     * @param {Partial<Info>} filter  Query params of the wanted info
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Info} return array of company info
     */
    single(filter: Partial<Company>, select?: IModelSelect): Promise<CompanyInclude>;

    /**
     * Retrieve company
     *
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<CompanyInclude[]>} Return promise with company array
     */
    filter(
        filter?: IWhereFilter<Company>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<CompanyInclude[]>;

    /**
     * Company retrieved paginated declaration
     *
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    retrievePaginated(
        filter?: IWhereFilter<Company>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<CompanyInclude[]>>;
}

/**
 * Company Service Implementation
 */
@injectable()
export class CompanyService implements ICompanyService {
    /**
     * CompanyService constructor
     *
     * @param {DbRepo<MySqlClient>} dbService database service dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    /**
     * Company retrieve implementation
     *
     * @param {Partial<Info>} filter  Query params of the wanted info
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Info} return array of company info
     */
    async single(filter: Partial<Company>, select?: IModelSelect): Promise<CompanyInclude> {
        try {
            return this.dbService.retrieveUnique<CompanyInclude>(Prisma.ModelName.Company, filter, undefined, select);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get company array
     *
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<CompanyInclude[]>} Return promise with company array
     */
    async filter(
        filter?: IWhereFilter<Company>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<CompanyInclude[]> {
        try {
            return this.dbService.retrieve<CompanyInclude>(
                Prisma.ModelName.Company,
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
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async retrievePaginated(
        filter?: IWhereFilter<Company>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<CompanyInclude[]>> {
        try {
            return this.dbService.retrievePaginated<CompanyInclude>(
                Prisma.ModelName.Company,
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
}

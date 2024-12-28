import {inject, injectable} from "tsyringe";

import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Status} from "fnpm/enums";

import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {Prisma, Company, Personnel, Info, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";

import {CompanyInclude} from "../db.includes";

/**
 * Company Service Declarations
 */
interface ICompanyService {
    /**
     * Retrieve info
     *
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<CompanyInclude[]>
     */
    filter(
        filter?: IWhereFilter<Company>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest
    ): Promise<IPaginationResponse<CompanyInclude[]>>;

    /**
     * Create company
     *
     * @param {Company} company company object
     * @returns {Promise<Company>} company object
     */
    createCompany(company: Company): Promise<Company>;

    /**
     * Create Personnel
     *
     * @param {Personnel} personnel personnel object
     * @returns {Promise<Personnel>} personnel object
     */
    createPersonnel(personnel: Personnel): Promise<Personnel>;

    /**
     * Create Info
     *
     * @param {Info} info info object
     * @returns {Promise<Info>} info object
     */
    createInfo(info: Info): Promise<Info>;
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
     * Get info array
     *
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<CompanyInclude[]>
     */
    async filter(
        filter?: IWhereFilter<Company>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest
    ): Promise<IPaginationResponse<CompanyInclude[]>> {
        try {
            return this.dbService.retrievePaginated<CompanyInclude>(
                Prisma.ModelName.Company,

                orderBy,
                pagination.perPage,
                pagination.page,
                filter,
                undefined,
                select
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create company
     *
     * @param {Company} company company object
     * @returns {Promise<Company>} company object
     */
    async createCompany(company: Company): Promise<Company> {
        try {
            return this.dbService.create<Company>(Prisma.ModelName.Company, company);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create Personnel
     *
     * @param {Personnel} personnel personnel object
     * @returns {Promise<Personnel>} personnel object
     */
    async createPersonnel(personnel: Personnel): Promise<Personnel> {
        try {
            return this.dbService.create<Personnel>(Prisma.ModelName.Personnel, personnel);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create Info
     *
     * @param {Info} info info object
     * @returns {Promise<Info>} info object
     */
    async createInfo(info: Info): Promise<Info> {
        try {
            return this.dbService.create<Info>(Prisma.ModelName.Info, info);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

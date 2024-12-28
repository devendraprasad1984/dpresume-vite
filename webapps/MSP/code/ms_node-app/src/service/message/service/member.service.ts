import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {Any} from "fnpm/types";
import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {Member, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

import {MemberInclude} from "../db.includes";

/**
 * User Service declarations
 */
interface IMemberService {
    /**
     * Retrieve users by filter
     *
     * @param {IWhereFilter<Member>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Member[]} return user object
     */
    filter(
        filter?: IWhereFilter<Member>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Member[]>;

    /**
     * Update personnel implementation
     *
     * @param {number} id member id
     * @param {Partial<Member>} member new member data
     */
    update(id: number, member: Partial<Member>): Promise<Member>;

    /**
     * Get pagination data
     *
     * @param {IWhereFilter<Channel>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    retrievePaginatedChannelMembers(
        filter?: IWhereFilter<Member>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<Member[]>>;
}

/**
 * User service implementation
 */
@injectable()
export class MemberService implements IMemberService {
    /**
     * MemberRequest Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    /**
     * Get invites array
     *
     * @param {IWhereFilter<Member>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Member[]>} Return promise with user array
     */
    async filter(
        filter?: IWhereFilter<Member>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<MemberInclude[]> {
        try {
            return this.service.retrieve<MemberInclude>(
                Prisma.ModelName.Member,
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
     * Member update implementation
     *
     * @param {number} id Member id number
     * @param {Member} member  Member information to update
     * @returns {Member} Return new member information
     */
    async update(id: number, member: Partial<Member>): Promise<Member> {
        try {
            return this.service.update<Member>(Prisma.ModelName.MemberRequest, id, member);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get pagination data
     *
     * @param {IWhereFilter<Channel>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinc field info
     * @returns {Promise<IPaginationResponse<CompanyInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async retrievePaginatedChannelMembers(
        filter?: IWhereFilter<Member>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<MemberInclude[]>> {
        try {
            return this.service.retrievePaginated<MemberInclude>(
                Prisma.ModelName.Member,
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

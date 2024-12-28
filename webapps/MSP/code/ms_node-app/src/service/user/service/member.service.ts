import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";

import {Member, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

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
    ): Promise<Member[]> {
        try {
            return this.service.retrieve<Member>(
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
}

import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";

import {MemberRequest, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 * User Service declarations
 */
interface IMemberRequestService {
    /**
     * Member request create declaration
     *
     * @param {MemberRequest} info MemberRequest information to save
     * @returns {MemberRequest} Return new info information
     */
    create(info: MemberRequest): Promise<MemberRequest>;

    /**
     * Retrieve request by filter
     *
     * @param {IWhereFilter<MemberRequest>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {MemberRequest[]} return user object
     */
    filter(
        filter?: IWhereFilter<MemberRequest>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<MemberRequest[]>;
}

/**
 * User service implementation
 */
@injectable()
export class MemberRequestService implements IMemberRequestService {
    /**
     * MemberRequest Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    /**
     * Member request create implementation
     *
     * @param {MemberRequest} memberRequest Member request info
     * @returns {MemberRequest} Return new profile information
     */
    async create(memberRequest: MemberRequest): Promise<MemberRequest> {
        try {
            return this.service.create<MemberRequest>(Prisma.ModelName.MemberRequest, memberRequest);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get invites array
     *
     * @param {IWhereFilter<MemberRequest>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<MemberRequest[]>} Return promise with user array
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
}

import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";

import {Prisma, GroupMember} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Group Member Service declarations
 */
interface IGroupMemberService {
    /**
     * Retrieve group member
     *
     * @returns {GroupMember} returns Group Member object
     */
    single(filter: Partial<GroupMember>): Promise<GroupMember>;

    /**
     * Retrieve group member by filter
     *
     * @param {number} id group member id
     * @returns {GroupMember[]} return group member object
     */
    filter(
        filter?: IWhereFilter<GroupMember>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<GroupMember[]>;

    /**
     * Create group member implementation
     *
     * @param {GroupMember} groupMember group member object from UI Model
     * @returns {GroupMember} return new group member information
     */
    create(groupMember: GroupMember): Promise<GroupMember>;

    /**
     * Update group member implementation
     *
     * @param {number} id group member id
     * @param {GroupMember} groupMember group member UI model
     */
    update(id: number, groupMember: GroupMember): Promise<GroupMember>;

    /**
     * Delete group member implementation
     *
     * @param {number} id group member id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number, isHard?: boolean): Promise<boolean>;
}

/**
 * Group Member service implementation
 */
@injectable()
export class GroupMemberService implements IGroupMemberService {
    /**
     * Group Member Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    // methods
    /**
     * Group Member retrieve implementation
     *
     * @param {Partial<GroupMember>} filter  Query params of the wanted group member
     * @returns {GroupMember} return array of group member
     */
    async single(filter: Partial<GroupMember>): Promise<GroupMember> {
        try {
            return this.service.retrieveUnique<GroupMember>(Prisma.ModelName.GroupMember, filter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get group member array
     *
     * @param {IWhereFilter<GroupMember>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<GroupMember[]>} Return promise with group member array
     */
    async filter(
        filter?: IWhereFilter<GroupMember>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<GroupMember[]> {
        try {
            return this.service.retrieve<GroupMember>(
                Prisma.ModelName.GroupMember,
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
     * Group Member create implementation
     *
     * @param {GroupMember} groupMember Group Member information to save
     * @returns {GroupMember} Return new group member information
     */
    async create(groupMember: GroupMember): Promise<GroupMember> {
        try {
            return this.service.create<GroupMember>(Prisma.ModelName.GroupMember, groupMember);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Group Member update implementation
     *
     * @param {number} id Group Member id number
     * @param {GroupMember} groupMember  Group Member information to save
     * @returns {GroupMember} Return new group member information
     */
    async update(id: number, groupMember: Partial<GroupMember>): Promise<GroupMember> {
        try {
            return this.service.update<GroupMember>(Prisma.ModelName.GroupMember, id, groupMember);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Group Member delete implementation
     *
     * @param {number} id Group Member id to delete
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: GroupMember = await this.service.delete<GroupMember>(Prisma.ModelName.GroupMember, id, isHard);
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {Prisma, User, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";

import {UserInclude} from "../db.includes";

/**
 * User Service declarations
 */
interface IUserService {
    /**
     * Retrieve users
     *
     * @returns {User} returns array of User
     */
    single(filter?: Partial<User>): Promise<User>;

    /**
     * Retrieve users by filter
     *
     * @returns {IPaginationResponse<UserInclude[]>} return user object
     */
    filter(
        filter?: IWhereFilter<User>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest
    ): Promise<IPaginationResponse<UserInclude[]>>;

    /**
     * Create user implementation
     *
     * @param {IUser} user user object from UI Model
     * @returns {User} return new user information
     */
    create(user: User): Promise<User>;

    /**
     * Update user implementation
     *
     * @param {number} id user id
     * @param {IUser} user user UI model
     */
    update(id: number, user: User): Promise<User>;

    /**
     * Delete user implementation
     *
     * @param {number} id user id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;
}

/**
 * User service implementation
 */
@injectable()
export class UserService implements IUserService {
    /**
     * User Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    // methods
    /**
     * User retrieve implementation
     *
     * @param {Partial<User>} filter  Query params of the wanted user
     * @returns {User[]} return array of users
     */
    async single(filter?: Partial<User>): Promise<User> {
        try {
            const userModel = {[Prisma.ModelName.Profile]: true};

            return this.service.retrieveUnique<User>(Prisma.ModelName.User, filter, userModel);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get user array
     *
     * @param {IWhereFilter<User>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @returns {Promise<IPaginationResponse<UserInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async filter(
        filter?: IWhereFilter<User>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest
    ): Promise<IPaginationResponse<UserInclude[]>> {
        try {
            const userModel = {
                [Prisma.ModelName.Profile]: {include: {[Prisma.ModelName.WorkHistory]: true}},
                [Prisma.ModelName.Note]: true
            };

            return this.service.retrievePaginated<UserInclude>(
                Prisma.ModelName.User,
                orderBy,
                pagination.perPage,
                pagination.page,
                filter,
                userModel,
                select
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * User create implementation
     *
     * @param {User} user User information to save
     * @returns {User} Return new user information
     */
    async create(user: User): Promise<User> {
        try {
            return this.service.create<User>(Prisma.ModelName.User, user);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * User update implementation
     *
     * @param {number} id User id number
     * @param {User} user  User information to save
     * @returns {User} Return new user information
     */
    async update(id: number, user: Partial<User>): Promise<User> {
        try {
            return this.service.update<User>(Prisma.ModelName.User, id, user);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * User delete implementation
     *
     * @param {number} id User id to delete
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: User = await this.service.delete<User>(Prisma.ModelName.User, id, isHard);
            return r && r.Id > 0;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

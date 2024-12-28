import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";
import {IPeopleSearch, PeopleConnectedStatus} from "ms-npm/search-models";
import {IUserIdentity} from "ms-npm/auth-models";

import {Prisma, User, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";

import {UserInclude} from "../db.includes";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";

/**
 * User Service declarations
 */
interface IUserService {
    /**
     * Retrieve user
     *
     * @returns {User} returns User object
     */
    single(filter: Partial<User>): Promise<User>;

    /**
     * Retrieve users by filter
     *
     * @param {number} id user id
     * @returns {User[]} return user object
     */
    filter(
        filter?: IWhereFilter<User>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<User[]>;

    /**
     * Get user array
     *
     * @param {IUserIdentity} userInfo user info
     * @param {PeopleConnectedStatus} filter connection filter 1:connected with me, 2: not connected, null: all
     * @returns {Promise<IPeopleSearch[]>} Return promise with user array0
     */
    rawQuery(userInfo: IUserIdentity, filter?: PeopleConnectedStatus): Promise<IPeopleSearch[]>;

    /**
     * Get user array
     *
     * @param {IUserIdentity} userInfo user info
     * @param {string[]} params parameters or filter
     * @returns {Promise<IPeopleSearch[]>} Return promise with user array
     */
    rawQueryUserSearch(userInfo: IUserIdentity, params: string[]): Promise<IPeopleSearch[]>;

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
     * @returns {User} return array of users
     */
    async single(filter: Partial<User>): Promise<User> {
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
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<User[]>} Return promise with user array
     */
    async filter(
        filter?: IWhereFilter<User>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<UserInclude[]> {
        try {
            return this.service.retrieve<UserInclude>(
                Prisma.ModelName.User,
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
     * Get user array
     *
     * @param {IUserIdentity} userInfo user info
     * @param {PeopleConnectedStatus} filter connection filter 1:connected with me, 2: not connected, null: all
     * @returns {Promise<IPeopleSearch[]>} Return promise with user array
     */
    async rawQuery(userInfo: IUserIdentity, filter?: PeopleConnectedStatus): Promise<IPeopleSearch[]> {
        try {
            return await this.service.rawQuery<
                IPeopleSearch[]
            >`CALL sp_getUserConnections(${userInfo.id}, ${userInfo.ref}, ${filter})`;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get user array
     *
     * @param {IUserIdentity} userInfo user info
     * @param {string[]} params parameters or filter
     * @returns {Promise<IPeopleSearch[]>} Return promise with user array
     */
    async rawQueryUserSearch(userInfo: IUserIdentity, params: string[]): Promise<IPeopleSearch[]> {
        try {
            //[0]=City, [1]=State, [2]=YearsExperience, [3]=School
            //[4]=Company, [5]=Industry, [6]=Intent
            return await this.service.rawQuery<
                IPeopleSearch[]
            >`CALL sp_getUserSearch(${userInfo.id}, ${userInfo.ref}, ${params[0]}, ${params[1]}, ${params[2]}, ${params[3]}, ${params[4]}, ${params[5]}, ${params[6]}, ${params[7]})`;
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

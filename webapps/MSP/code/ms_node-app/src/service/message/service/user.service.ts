import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Chat} from "fnpm/chat";
import {StreamApi} from "fnpm/chat/stream";

import {IUserIdentity} from "ms-npm/auth-models";
import {IPeopleSearch, PeopleConnectedStatus} from "ms-npm/search-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {User as dbUser, Prisma, PrismaClient as MySqlClient, User} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {UserInclude} from "../db.includes";

/**
 *  User Chat Service declarations
 */
interface IUserService {
    // declarations

    /**
     * Get user token for stream
     */
    getToken(userId: number): Promise<string>;

    /**
     * Get user data for specific userRef
     */
    getUserByRef(ref: string): Promise<dbUser>;
}

/**
 * User service implementation
 */
@injectable()
export class UserService implements IUserService {
    /**
     * User controller constructor
     *
     * @param {Chat<StreamApi>} chat chat client dependency
     * @param {DbRepo<MySqlClient>} dbService db client dependency
     */
    constructor(@inject("Chat") private chat: Chat<StreamApi>, @inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    // methods

    /**
     * Return a stream token for a specific user
     *
     * @param {number} userId user id
     * @returns {Promise<string>} promise of type string
     */
    async getToken(userId: number): Promise<string> {
        try {
            //get the user data from database
            const filter = {Id: userId};

            const rDB = await this.dbService.retrieveUnique<dbUser>(Prisma.ModelName.User, filter);
            //check if the user exist and is active
            if (rDB && rDB?.Status === RecordStatus.Active) {
                //Send the request to stream and return the result
                return this.chat.client.getToken(rDB.Ref);
            } else {
                //The user could not be obtained
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Return the user information based on the UserRef
     *
     * @param {string} ref guid from db
     * @returns {UserInclude} user data
     */
    async getUserByRef(ref: string): Promise<UserInclude> {
        const userModel = {[Prisma.ModelName.Profile]: true};
        const filter = {Ref: ref};
        return await this.dbService.retrieveUnique<UserInclude>(Prisma.ModelName.User, filter, userModel);
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
            const userModel = {[Prisma.ModelName.Profile]: true};

            return this.dbService.retrieve<UserInclude>(
                Prisma.ModelName.User,
                filter,
                userModel,
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
            return await this.dbService.rawQuery<
                IPeopleSearch[]
            >`CALL sp_getUserConnections(${userInfo.id}, ${userInfo.ref}, ${filter})`;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

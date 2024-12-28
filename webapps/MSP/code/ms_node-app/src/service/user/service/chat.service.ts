import {inject, injectable} from "tsyringe";
import {PartialUserUpdate} from "stream-chat";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";
import {Chat} from "fnpm/chat";
import {StreamApi} from "fnpm/chat/stream";

import {Channel, Prisma, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";

/**
 * Chat Service declarations
 */
interface IChatService {
    /**
     * Retrieve users by filter
     *
     * @param {IWhereFilter<Channel>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Channel[]} return user object
     */
    filter(
        filter?: IWhereFilter<Channel>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Channel[]>;

    /**
     * update the user info in Stream
     *
     * @param {PartialUserUpdate} user stream user Info
     * @returns {Promise<boolean>} Return promise of the result type boolean
     */
    updateUser(user: PartialUserUpdate): Promise<boolean>;
}

/**
 * Chat service implementation
 */
@injectable()
export class ChatService implements IChatService {
    /**
     * Chat Controller constructor
     *
     * @param {DbRepo<MySqlClient>} db database service dependency
     * @param {Chat<StreamApi>} chat stream service dependency
     */
    constructor(@inject("Db") private db: DbRepo<MySqlClient>, @inject("Chat") private chat: Chat<StreamApi>) {
    }

    /**
     * Get channel array
     *
     * @param {IWhereFilter<Channel>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Channel[]>} Return promise with user array
     */
    async filter(
        filter?: IWhereFilter<Channel>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Channel[]> {
        try {
            return this.db.retrieve<Channel>(Prisma.ModelName.Channel, filter, undefined, orderBy, skip, take, select);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * update the user info in Stream
     *
     * @param {PartialUserUpdate} user stream user Info
     * @returns {Promise<boolean>} Return promise of the result type boolean
     */
    async updateUser(user: PartialUserUpdate): Promise<boolean> {
        try {
            return this.chat.client.streamUser.partialUpdateUsers([user]);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

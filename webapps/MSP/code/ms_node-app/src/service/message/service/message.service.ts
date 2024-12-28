import {inject, injectable} from "tsyringe";

import {IMessageResponse} from "fnpm/chat/stream/models";
import {StreamApi} from "fnpm/chat/stream";
import {Chat} from "fnpm/chat";
import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";

import {Channel as dbChannel, Prisma, PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";
import {SearchAPIResponse} from "stream-chat";

/**
 *  Message Chat Service declarations
 */
interface IMessageService {
    // declarations

    /**
     * Send a message through a specific channel
     */
    sendMessage(channelId: number, messageText: string): Promise<IMessageResponse>;

    /**
     * Delete a specific message
     */
    deleteMessage(messageId: string, isHard: boolean): Promise<boolean>;

    /**
     * Search messages on channels
     */
    search(userRef: string, keyword: string, limit?: number, offset?: number): Promise<SearchAPIResponse>;
}

/**
 * Conversation service implementation
 */
@injectable()
export class MessageService implements IMessageService {
    /**
     * Conversation controller constructor
     *
     @param {Chat<StreamApi>} chat chat client dependency
     @param {DbRepo<MySqlClient>} dbService db client dependency
     */
    constructor(@inject("Chat") private chat: Chat<StreamApi>, @inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    // methods

    /**
     * Send a message through a specific channel
     *
     * @param {number} channelId channel id
     * @param {string} messageText message text
     * @param {string} userRef user who send the message text
     * @returns {Promise<boolean>} promise of type boolean
     */
    async sendMessage(channelId: number, messageText: string, userRef?: string): Promise<IMessageResponse> {
        try {
            //get the channel from database.
            const filterChannel: Partial<dbChannel> = {Id: channelId};
            const rChannel: dbChannel = await this.dbService.retrieveUnique<dbChannel>(
                Prisma.ModelName.Channel,
                filterChannel
            );
            //Verify if the channel exist in the database
            if (rChannel !== null) {
                //return the result of send a message
                return await this.chat.client.streamMessage.send(rChannel.StreamRef, messageText, userRef);
            } else {
                //Channel cannot be retrieved from database.
                return undefined;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.Message);
        }
    }

    /**
     * Delete a specific message
     *
     * @param {string} messageId message id for stream
     * @param {boolean} isHard is hard delete
     * @returns {Promise<boolean>} promise of type boolean
     */
    async deleteMessage(messageId: string, isHard: boolean = false): Promise<boolean> {
        try {
            //return the result of delete a message
            return await this.chat.client.streamMessage.delete(messageId, isHard);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.Message);
        }
    }

    /**
     * Search messages by members
     *
     * @param {string} userRef user ref to filter channels
     * @param {string} keyword Text to be searched
     * @param {number} limit The number of messages to return
     * @param {number} offset The pagination offset.
     * @returns {Promise<SearchAPIResponse>} return search object
     */
    async search(userRef: string, keyword: string, limit?: number, offset?: number): Promise<SearchAPIResponse> {
        try {
            return (await this.chat.client.streamMessage.search(userRef, keyword, limit, offset)) as SearchAPIResponse;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.Message);
        }
    }
}

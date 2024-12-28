import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {IMessageResponse} from "fnpm/chat/stream/models";
import {Hasher} from "fnpm/utils";

import {MessageService} from "../service/message.service";
import {Validator} from "../validator";
import {ChannelService} from "../service/channel.service";
import {SearchAPIResponse} from "stream-chat";

/**
 * Message Chat Controller declarations
 */
interface IMessageController {
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;

    /**
     * Send a message through a specific channel
     */
    send(channelRef: string, messageText: string, userRef?: string): Promise<IApiResponse<IMessageResponse>>;

    /**
     * Delete a specific message
     */
    delete(messageId: string, isHard?: boolean): Promise<IApiResponse<boolean>>;

    /**
     * Search messages by user
     */
    filter(userRef: string, keyword: string, limit?: number, offset?: number): Promise<IApiResponse<SearchAPIResponse>>;
}

/**
 * Message Chat Controller implementation
 */
@injectable()
export class MessageController implements IMessageController {
    //methods

    /**
     * Conversation Controller constructor
     *
     * @param {MessageService} service conversation service dependency
     * @param {ChannelService} channelService channel service dependency
     */
    constructor(
        @inject(delay(() => MessageService)) private service: MessageService,
        @inject(delay(() => ChannelService)) private channelService: ChannelService
    ) {
    }

    /**
     * Ping method implementation
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        return new ApiResponse(Status.OK, "message - ping");
    }

    /**
     * Send a message through a specific channel
     *
     * @param {string} channelRef channel ref
     * @param {string} messageText message text
     * @param {string} userRef user who send the message text
     * @returns {Promise<IApiResponse<IMessageResponse>>} promise of type IApiResponse of type IMessageResponse
     */
    async send(channelRef: string, messageText: string, userRef?: string): Promise<IApiResponse<IMessageResponse>> {
        const channelId: number = (await this.channelService.refToChannel(channelRef)).Id;

        //Validate the data for the send message request
        if (Validator.isSendMessageValid(channelId, messageText, userRef)) {
            //Send the message
            const r: IMessageResponse = await this.service.sendMessage(channelId, messageText, userRef);
            //Check the result
            if (r.id !== null) {
                //Message send successfully
                return new ApiResponse(Status.OK, r);
            } else {
                //Conflict sending a message
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete a specific message
     *
     * @param {string} messageId message id from stream
     * @param {boolean} isHard is hard delete
     * @returns {Promise<boolean>} promise of type IApiResponse of type boolean
     */
    async delete(messageId: string, isHard?: boolean): Promise<IApiResponse<boolean>> {
        //Validate the data for the delete message request
        if (Hasher.isGuid(messageId)) {
            //Delete the message
            const r: boolean = await this.service.deleteMessage(messageId, isHard);
            //Check the result
            if (r) {
                //Message delete successfully
                return new ApiResponse(Status.OK, r);
            } else {
                //Conflict delete a message
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
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
    async filter(
        userRef: string,
        keyword: string,
        limit?: number,
        offset?: number
    ): Promise<IApiResponse<SearchAPIResponse>> {
        if (Hasher.isGuid(userRef)) {
            const r: SearchAPIResponse = await this.service.search(userRef, keyword, limit, offset);
            if (r) {
                //Search successfully
                return new ApiResponse(Status.OK, r);
            } else {
                //Conflict delete a message
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

import {inject, injectable} from "tsyringe";

import {StreamApi} from "fnpm/chat/stream";
import {Chat} from "fnpm/chat";
import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";

/**
 *  Message Notification Service declarations
 */
interface IMessageService {
    // declarations

    /**
     * Send a message through a specific channel
     */
    sendMessage(streamRef: string, messageText: string, userRef?: string, custom?: object): Promise<boolean>;
}

/**
 * Message service implementation
 */
@injectable()
export class MessageService implements IMessageService {
    /**
     * Message service constructor
     *
     @param {Chat<StreamApi>} chat chat client dependency
     */
    constructor(@inject("Chat") private chat: Chat<StreamApi>) {
    }

    // methods

    /**
     * Send a message through a specific channel
     *
     * @param {number} streamRef string id
     * @param {string} messageText message text
     * @param {string} userRef user who send the message text
     * @param {object} custom custom data for UI.
     * @returns {Promise<boolean>} promise of type boolean
     */
    async sendMessage(streamRef: string, messageText: string, userRef?: string, custom?: object): Promise<boolean> {
        try {
            //send a message
            const rStream = await this.chat.client.streamMessage.send(streamRef, messageText, userRef, custom);

            //return the result
            return rStream !== undefined ? true : false;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.Message);
        }
    }
}

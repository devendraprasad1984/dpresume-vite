import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";
import {Meet} from "fnpm/meet";
import {TwilioApi} from "fnpm/meet/twilio";
import {IRoomData} from "fnpm/meet/twilio/models";

/**
 * Meet  Service declarations
 */
interface IMeetService {
    // declarations

    /**
     * Create new room method declaration
     */
    createRoom(channelRef: string): Promise<IRoomData>;
}

/**
 *  Meet service implementation
 */
@injectable()
export class MeetService implements IMeetService {
    /**
     * Meet controller constructor
     *
     * @param {Meet<TwilioApi>} meet meet client dependency
     */
    constructor(@inject("Meet") private meet: Meet<TwilioApi>) {
    }

    // methods

    /**
     * Create new Room
     *
     * @param {Ref} channelRef local channel to send stream message
     * @returns {Promise<string>} promise of type string
     */
    async createRoom(channelRef: string): Promise<IRoomData> {
        try {
            //Send the request to create the room
            return this.meet.client.twilioRoom.findOrCreateRoom(channelRef);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

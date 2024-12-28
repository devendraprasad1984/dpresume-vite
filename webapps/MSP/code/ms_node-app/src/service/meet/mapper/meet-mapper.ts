import {Hasher, UtcDate} from "fnpm/utils";
import {IRoom} from "ms-npm/meet-models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {MeetInclude} from "../db.includes";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * To db Member Request model method declaration
     */
    toDbNewMeetModel<T>(channelId: number, twilioRef: string, createdBy: string, status: RecordStatus): T;

    /**
     * From db to IRoom model method declaration
     */
    fromDBToRoom(source: MeetInclude): IRoom;
}

/**
 * Model mapper class implementation
 */
export class MeetMapper implements IModelMapper {
    /**
     * Mapper method to convert object to Db model
     *
     * @param {number} channelId channel id
     * @param {string} twilioRef twilio ref
     * @param {string} createdBy created by
     * @param {RecordStatus} status status
     * @returns {T} mapped db model
     */
    toDbNewMeetModel<T>(channelId: number, twilioRef: string, createdBy: string, status: RecordStatus): T {
        const r = {
            Id: 0,
            Ref: Hasher.guid(),
            ChannelId: channelId,
            TwilioRef: twilioRef,
            Status: status,
            CreatedBy: createdBy,
            CreatedOn: UtcDate.now(),
            ModifiedBy: undefined,
            ModifiedOn: undefined
        };

        return r as unknown as T;
    }

    /**
     * Mapper method to convert db model to object
     *
     * @param {object} source db model to be converted
     * @returns {T} converted object
     */
    fromDBToRoom(source: MeetInclude): IRoom {
        const map: IRoom = {
            id: source.Id,
            ref: source.Ref,
            channelRef: source.Channel.Ref,
            status: "",
            audit: {
                createdBy: source.CreatedBy,
                createdOn: source.CreatedOn,
                modifiedBy: source.ModifiedBy,
                modifiedOn: source.ModifiedOn
            }
        };
        return map;
    }
}

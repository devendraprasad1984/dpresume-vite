import {UtcDate} from "fnpm/utils";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * To db Member Request model method declaration
     */
    toDbMemberRequestModel<T>(source: object): T;

    /**
     * Mapper method to convert data to Db Member model
     */
    toDbNewMember<T>(userId: number, channelId: number, createdById: string): T;
}

/**
 * Model mapper class implementation
 */
export class MessageMapper implements IModelMapper {
    /**
     * Mapper method to convert object to Db model
     *
     * @param {object} source source object to be mapped to db model
     * @returns {T} mapped db model
     */
    toDbMemberRequestModel<T>(source: object): T {
        const r: object[] = [];
        const members = source["members"] as string[];
        members.forEach((memberRef: string) => {
            r.push({
                Id: 0,
                UserRef: memberRef,
                ChannelRef: source["channelRef"],
                Status: RecordStatus.Pending,
                Type: "Channel",
                Message: source["inviteMessage"],
                CreatedOn: UtcDate.now(),
                CreatedBy: source["createdById"],
                ModifiedOn: undefined,
                ModifiedBy: undefined,
                ApprovedByRef: undefined,
                TopicRef: undefined,
                SessionRef: undefined
            });
        });
        return r as unknown as T;
    }

    /**
     * Mapper method to convert data to Db Member model
     *
     * @param {number} userId user id
     * @param {number} channelId channel id
     * @param {string} createdById create by id
     * @returns {T} mapped db model
     */
    toDbNewMember<T>(userId: number, channelId: number, createdById: string): T {
        const newMember = {
            Id: undefined,
            UserId: userId,
            ChannelId: channelId,
            Status: RecordStatus.Active,
            CreatedBy: createdById,
            CreatedOn: UtcDate.now(),
            ModifiedBy: undefined,
            ModifiedOn: undefined
        };
        return newMember as unknown as T;
    }
}

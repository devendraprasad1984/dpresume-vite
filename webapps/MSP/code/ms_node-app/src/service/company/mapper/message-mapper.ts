import {Hasher, UtcDate} from "fnpm/utils";
import {MemberRequestType} from "ms-npm/user-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * To db Member Request model method declaration
     */
    toDbMemberRequestModel<T>(source: object): T;
}

/**
 * Model mapper class implementation
 */
export class MessageMapper implements IModelMapper {
    /**
     * Mapper method to convert object to Db model
     *
     * @param {object} source source object to be mapped to db model
     * @returns {IProfile} mapped db model
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
                Type: MemberRequestType.Channel,
                Message: source["inviteMessage"],
                CreatedOn: UtcDate.now(),
                CreatedBy: Hasher.guid(),
                ModifiedOn: undefined,
                ModifiedBy: undefined,
                ApprovedByRef: undefined,
                TopicRef: undefined,
                SessionRef: undefined
            });
        });
        return r as unknown as T;
    }
}

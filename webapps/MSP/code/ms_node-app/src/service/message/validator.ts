import {User} from "stream-chat";

import {IChannelData} from "fnpm/chat/stream/models";
import {Checker} from "fnpm/validators";
import {UserRole} from "fnpm/chat/stream/enum";
import {Hasher} from "fnpm/utils";

import {IChannelInvite} from "ms-npm/message-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {ITopic, TopicAccess} from "ms-npm/topic-models";
import {IMemberRequest, MemberRequestType} from "ms-npm/user-models";

/**
 * Class with validation methods
 */
export abstract class Validator {
    /**
     * Validate channel create data
     *
     * @param {IChannelMember[]} members channel members
     * @param {string?} name channel name
     * @returns {boolean} is data valid
     */
    static isCreateChannelDataValid(members: string[], name?: string): boolean {
        const membersValid = this.allMembersValid(members, 1);
        const nameValid = name === undefined ? true : !Checker.isNullOrEmpty(name);
        return nameValid && membersValid;
    }

    /**
     * Validate channel get by members data
     *
     * @param {string[]} members channel members
     * @returns {boolean} is data valid
     */
    static isGetChannelByMembersDataValid(members: string[]): boolean {
        return this.allMembersValid(members, 1);
    }

    /**
     * Validate invite members request
     *
     * @param {string[]} members list of members that need to be invited.
     * @returns {boolean} is data valid
     */
    static isInviteMembersValid(members: string[]): boolean {
        return this.allMembersValid(members, 0);
    }

    /**
     * Validate send message request
     *
     * @param {number} channelId channel id from database
     * @param {string} messageText message text
     * @param {string} userRef user who send the message text
     * @returns {boolean} is data valid
     */
    static isSendMessageValid(channelId: number, messageText: string, userRef?: string): boolean {
        const channelIdValid: boolean = channelId > 0;
        const messageTextValid: boolean = !Checker.isNullOrEmpty(messageText);
        const userRefValid: boolean = userRef === undefined ? true : Hasher.isGuid(userRef);
        return channelIdValid && messageTextValid && userRefValid;
    }

    /**
     * Validate remove members request
     *
     * @param {string} channelRef channel ref from database
     * @param {string[]} members list of members that need to be invited.
     * @returns {boolean} is data valid
     */
    static isRemoveMembersValid(channelRef: string, members: string[]): boolean {
        const channelIdValid = Hasher.isGuid(channelRef);
        const membersValid = this.allMembersValid(members, 0);
        return channelIdValid && membersValid;
    }

    /**
     * Validate add members request
     *
     * @param {string} channelRef channel ref from database
     * @param {string[]} members list of members that need to be invited.
     * @returns {boolean} is data valid
     */
    static isAddMembersValid(channelRef: string, members: string[]): boolean {
        const channelIdValid = Hasher.isGuid(channelRef);
        const membersValid = this.allMembersValid(members, 0);
        return channelIdValid && membersValid;
    }

    /**
     * Validate update invite request
     *
     * @param {IChannelInvite} invite Invite channel info
     * @returns {boolean} is data valid
     */
    static isValidInviteUpdate(invite: IChannelInvite): boolean {
        const channelRefValid = Hasher.isGuid(invite.channelRef);
        const memberValid = Hasher.isGuid(invite.userRef);
        const statusValid = Object.values(RecordStatus).includes(<RecordStatus>invite.status);
        return channelRefValid && memberValid && statusValid;
    }

    /**
     * Validate the Sync Users Request
     *
     * @param {User[]} users users list
     * @returns {boolean} is data valid
     */
    static isValidSyncUsers(users: User[]) {
        if (users === undefined) return false;
        let allUsersValid: boolean = true;
        if (users.length > 0) {
            users.forEach((u: User) => {
                allUsersValid = allUsersValid && this.isUserStreamValid(u);
                //break the validation
                if (!allUsersValid) return allUsersValid;
            });
        } else {
            allUsersValid = false;
        }
        return allUsersValid;
    }

    /**
     * Validate channel sync data
     *
     * @param {IChannelData} data channel data
     * @returns {boolean} is data valid
     */
    static isSyncChannelDataValid(data: IChannelData): boolean {
        //we need to have a least one update value
        if (data.name === undefined && data.image === undefined && data.createdById === undefined) {
            return false;
        }
        const channelIdValid = Hasher.isGuid(data.channelId);
        const textValid = !Checker.isNullOrEmpty(data.text);
        //Optional
        const isNameValid: boolean = data.name === undefined ? true : !Checker.isNullOrEmpty(data.name);
        //Optional
        const isImageValid: boolean = data.image === undefined ? true : !Checker.isNullOrEmpty(data.image);
        //Optional
        const isCreateByValid: boolean = data.createdById === undefined ? true : Hasher.isGuid(data.createdById);
        //Return the result
        return channelIdValid && textValid && isNameValid && isImageValid && isCreateByValid;
    }

    /**
     * Validate topic data
     *
     * @param {IChannelData} data channel data
     * @param {boolean} isUpdate update flag
     * @returns {boolean} isUpdate data valid
     */
    static isTopicValid(data: Partial<ITopic>, isUpdate: boolean = false): boolean {
        const isRefValid = isUpdate && data.ref === undefined ? true : Hasher.isGuid(data.ref);
        const isChannelRefValid = data.channelRef === undefined ? true : Hasher.isGuid(data.channelRef);
        const isCompanyRefValid = data.companyRef === undefined ? true : Hasher.isGuid(data.companyRef);
        const isTitleValid =
            isUpdate && data.title === undefined ? true : Checker.isStringValid(1, 45, data.title, true);
        const isDescriptionValid =
            isUpdate && data.description === undefined ? true : Checker.isStringValid(0, 250, data.description, true);
        const isModeratorValid =
            isUpdate && data.description === undefined ? true : data.moderators.every((s: string) => Hasher.isGuid(s));
        const isStatusValid =
            isUpdate && data.status === undefined
                ? true
                : Object.values(RecordStatus).includes(<RecordStatus>data.status);
        const isAccessValid =
            isUpdate && data.access === undefined
                ? true
                : Object.values(TopicAccess).includes(<TopicAccess>data.access);
        const isPictureValid = Checker.isStringValid(0, 200, data.picture, false);
        const isValidEndedOn = data.endedOn === undefined ? true : !Checker.isNullOrEmpty(data.endedOn.toString());
        return (
            isRefValid &&
            isChannelRefValid &&
            isCompanyRefValid &&
            isTitleValid &&
            isDescriptionValid &&
            isModeratorValid &&
            isStatusValid &&
            isAccessValid &&
            isPictureValid &&
            isValidEndedOn
        );
    }

    /**
     * Validate the data to create request
     *
     * @param {IMemberRequest} data data for the new member request
     * @param {boolean} isUpdate is a update request
     * @returns {boolean} true / false
     */
    static isMemberRequestValid(data: Partial<IMemberRequest>, isUpdate?: boolean): boolean {
        const isUserRefValid = isUpdate && data.userRef === undefined ? true : Hasher.isGuid(data.userRef);
        const isStatusValid =
            isUpdate && data.status === undefined
                ? true
                : Object.values(RecordStatus).includes(<RecordStatus>data.status);
        const isTypeValid =
            isUpdate && data.type === undefined
                ? true
                : Object.values(MemberRequestType).includes(<MemberRequestType>data.type);
        const isApprovedByValid = Checker.isStringValid(3, 80, data.approvedByRef, false);
        const isTopicRefValid = Checker.isNullOrEmpty(data.topicRef) || Hasher.isGuid(data.topicRef);
        const isSessionRefValid = Checker.isNullOrEmpty(data.sessionRef) || Hasher.isGuid(data.sessionRef);
        const isChannelRefValid = Checker.isNullOrEmpty(data.channelRef) || Hasher.isGuid(data.channelRef);
        const isCompanyRefValid = Checker.isNullOrEmpty(data.companyRef) || Hasher.isGuid(data.companyRef);
        const isRefValueValid =
            isUpdate || this.isRefValueValid(data.topicRef, data.channelRef, data.sessionRef, data.companyRef);
        return (
            isUserRefValid &&
            isStatusValid &&
            isTypeValid &&
            isApprovedByValid &&
            isTopicRefValid &&
            isSessionRefValid &&
            isChannelRefValid &&
            isCompanyRefValid &&
            isRefValueValid
        );
    }

    /**
     * Validate only 1 ref value is filled
     *
     * @param {...string[]} refs user id
     * @returns {boolean} true / false
     */
    static isRefValueValid(...refs: string[]): boolean {
        return refs.filter((ref: string) => !Checker.isNullOrEmpty(ref)).length == 1;
    }

    /**
     * Validate status of note and type
     *
     * @param {string} status status
     * @returns {boolean} true / false
     */
    private static isStatusValid(status: RecordStatus) {
        //validate the property
        return Object.values(RecordStatus).includes(status);
    }

    /**
     * Check if all the members are valid
     *
     * @param {string[]} members channel members
     * @param {number} greatThan minimum of channel members
     * @returns {boolean} is data valid
     */
    private static allMembersValid(members: string[], greatThan: number): boolean {
        if (members === undefined) return false;
        let allMembersValid: boolean = true;
        if (members.length > greatThan) {
            members.forEach((m: string) => {
                allMembersValid = allMembersValid && Hasher.isGuid(m) && !Checker.isNullOrEmpty(m);
                //break the validation
                if (!allMembersValid) return allMembersValid;
            });
        } else {
            allMembersValid = false;
        }
        return allMembersValid;
    }

    /**
     * Validate stream user id
     *
     * @param {string} value member id
     * @returns {boolean} true / false
     */
    private static isUserStreamValid(value: User): boolean {
        //we need to have a least one update value
        if (
            value.name === undefined &&
            value.role === undefined &&
            value.teams === undefined &&
            value.username === undefined &&
            value.anon === undefined
        ) {
            return false;
        }
        //Required
        const isUserIdValid: boolean = !Checker.isNullOrEmpty(value.id);
        //Optional
        const isNameValid: boolean = value.name === undefined ? true : !Checker.isNullOrEmpty(value.name);
        //Optional
        const isRoleValid: boolean =
            value.role === undefined ? true : Object.values(UserRole).includes(value.role as UserRole);
        //Optional
        const isTeamsValid: boolean = value.teams === undefined ? true : value.teams.length > 0;
        //Optional
        const isUserNameValid: boolean = value.username === undefined ? true : !Checker.isNullOrEmpty(value.username);
        //Optional
        const isAnonValid: boolean = value.anon === undefined ? true : value.anon === false || value.anon === true;

        //User Id is required
        return isUserIdValid && isNameValid && isRoleValid && isTeamsValid && isUserNameValid && isAnonValid;
    }
}

import {delay, inject, injectable} from "tsyringe";
import {ChannelData} from "stream-chat";

import {Message, Status} from "fnpm/enums";
import {ApiResponse, ApiError, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {IChannelAPIResponse, IChannelData} from "fnpm/chat/stream/models";
import {Hasher} from "fnpm/utils";
import {CustomChannelType, IChannelInvite} from "ms-npm/message-models";
import {IUserIdentity} from "ms-npm/auth-models";
import {PeopleConnectedStatus} from "ms-npm/search-models";
import {MembersFilter} from "ms-npm/routes/message";
import {IMember} from "ms-npm/topic-models";

import {ChannelService} from "../service/channel.service";
import {Validator} from "../validator";
import {MemberInclude} from "../db.includes";
import {MemberService} from "../service/member.service";
import {UserService} from "../service/user.service";
import {ChannelMapper} from "../mapper/channel-mapper";
import {MemberRequestService} from "../service/member-request.service";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {Channel} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Channel Controller declarations
 */
interface IChannelController {
    /**
     * create channel declaration
     */
    create(channelData: IChannelData, members: string[]): Promise<IApiResponse<IChannelAPIResponse>>;

    /**
     * Invite members to specific channel.
     */
    invite(channelRef: string, channelData: IChannelData): Promise<IApiResponse<boolean>>;

    /**
     * Remove members to specific channel.
     */
    leave(user: IUserIdentity, channelRef: string, members: string[]): Promise<IApiResponse<boolean>>;

    /**
     * Accept or reject invite for a channel
     */
    updateInvite(invite: IChannelInvite): Promise<IApiResponse<boolean>>;

    /**
     * Check if exist a channel with specific members
     */
    getByMembers(channelData: IChannelData): Promise<IApiResponse<ChannelData>>;

    /**
     * Delete a specific channel
     */
    delete(channelRef: string, isHard?: boolean): Promise<IApiResponse<boolean>>;

    /**
     * Just rename channel name
     */
    updateChannel(channelRef: string, channelData: IChannelData): Promise<IApiResponse<boolean>>;
}

/**
 * Channel Controller implementation
 */
@injectable()
export class ChannelController extends ChannelMapper implements IChannelController {
    //methods

    /**
     * Channel Controller constructor
     *
     * @param {ChannelService} channelService channel service dependency
     * @param {MemberService} memberService member service dependency
     * @param {UserService} userService user service dependency
     * @param {MemberRequestService} memberRequestService member request service dependency
     */
    constructor(
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => MemberService)) private memberService: MemberService,
        @inject(delay(() => UserService)) private userService: UserService,
        @inject(delay(() => MemberRequestService)) private memberRequestService: MemberRequestService
    ) {
        super();
    }

    /**
     * Create Channel method implementation
     *
     * @param {IChannelData} channelData Stream channel information
     * @param {string[]} members Ref Members list of Channel
     * @returns {Promise<IApiResponse<IChannelAPIResponse>>} promise of type IApiResponse of type IChannelAPIResponse
     */
    async create(channelData: IChannelData, members: string[]): Promise<IApiResponse<IChannelAPIResponse>> {
        // validate the data
        if (Validator.isCreateChannelDataValid(members, channelData.name)) {
            const verify: boolean = await this.verifyChannel(channelData, members);
            if (!verify) {
                //Generate channelId for Stream
                channelData.channelId = Hasher.guid();
                //get the channel members
                const channelMembers = await this.channelService.getChannelMembersByRefs(members);
                //check if the users exist in the database
                if (channelMembers.length != members.length) {
                    throw new ApiError(Status.BadRequest, Message.InvalidData);
                }
                //Create the channel.
                const channelType: CustomChannelType =
                    members.length === 2 ? CustomChannelType.OneToOne : CustomChannelType.Group;
                const rChannel = await this.channelService.createChannel(channelType, channelData, channelMembers);
                //Check if the channel was created successfully
                if (rChannel?.channelId !== undefined) {
                    try {
                        //Set the channel data
                        channelData.channelId = rChannel.channel.id;
                        channelData.channelRef = rChannel.channelRef;
                        channelData.members = members;
                        channelData.inviteMessage = "You've been invited to this channel!!!";
                        //Add the channel members
                        const rMembers = await this.channelService.inviteMembers(rChannel.channelId, channelData, true);
                        //Check if the members were added successfully
                        if (rMembers) {
                            //Send the response to UI
                            return new ApiResponse(Status.OK, rChannel);
                        } else {
                            /* istanbul ignore next */
                            //Delete the channel in stream and database
                            this.delete(rChannel.channelRef, true);

                            /* istanbul ignore next */
                            //Throw the exception
                            throw new ApiError(Status.Conflict, Message.Failure);
                        }
                    } catch (ex) {
                        //Delete the channel in stream and database
                        this.delete(rChannel.channelRef, true);
                        //Throw the exception
                        throw new ApiError(Status.Conflict, ex.message);
                    }
                }
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Invite members to a specific channel.
     *
     * @param {string} channelRef Channel DB ref
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async invite(channelRef: string, channelData: IChannelData): Promise<IApiResponse<boolean>> {
        //get the channel id
        const dbChannel = await this.channelService.refToChannel(channelRef);
        //validate
        if (Validator.isInviteMembersValid(channelData.members)) {
            //Set the missing channel data
            channelData.channelId = channelRef;
            channelData.channelRef = channelRef;
            channelData.createdById = dbChannel.CreatedBy;
            channelData.inviteMessage = "You've been invited to this channel!!!";
            const invited: boolean = await this.channelService.inviteMembers(dbChannel.Id, channelData);
            //return the response received by stream
            return new ApiResponse(Status.OK, invited);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Leave members to a specific channel.
     *
     * @param {IUserIdentity} user user info that request to leave.
     * @param {string} channelRef channel ref from database
     * @param {string[]} members list of members that will be removed.
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async leave(user: IUserIdentity, channelRef: string, members: string[]): Promise<IApiResponse<boolean>> {
        //validate
        if (Validator.isRemoveMembersValid(channelRef, members)) {
            const channel: Channel = await this.channelService.refToChannel(channelRef);
            const r: boolean = await this.channelService.leaveChannel(user, channel, channelRef, members);

            //check the response
            if (r) {
                return new ApiResponse(Status.OK, r);
            } else {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        }
    }

    /**
     * Just rename channel name
     *
     * @param {string} channelRef channel ref
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<IApiResponse<boolean>>} promise boolean response
     */
    async updateChannel(channelRef: string, channelData: IChannelData): Promise<IApiResponse<boolean>> {
        const channelId = (await this.channelService.refToChannel(channelRef)).Id;
        channelData.channelId = channelRef;

        //If title is updated, stream info will be updated
        if (channelData.name !== undefined) {
            const rStream = await this.channelService.updateChannel(channelData);
            if (!rStream) {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        }
        const r = await this.channelService.renameGroupName(channelId, undefined, channelData.name);
        return new ApiResponse(Status.OK, r);
    }

    /**
     * Accept or reject invite for a channel
     *
     * @param {IChannelInvite} invite Invite information
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async updateInvite(invite: IChannelInvite): Promise<IApiResponse<boolean>> {
        if (invite.memberRequestId > 0 && Validator.isValidInviteUpdate(invite)) {
            //check if the member request is valid
            const filter = {Id: invite.memberRequestId, Status: RecordStatus.Pending, ChannelRef: invite.channelRef};
            const rMemberRequest = await this.memberRequestService.filter(filter);
            //Member request doesn't exist or isn't pending
            if (rMemberRequest.length === 0) {
                throw new ApiError(Status.BadRequest, Message.InvalidData);
            }
            //get the db channel info
            const channel = await this.channelService.refToChannel(invite.channelRef);
            //update the invite
            const r: boolean = await this.channelService.updateInvite(channel, invite);
            if (r) {
                return new ApiResponse(Status.OK, r);
            } else {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Get Channel by members method implementation
     *
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<IApiResponse<ChannelData>>} promise of type IApiResponse of type Channel data
     */
    async getByMembers(channelData: IChannelData): Promise<IApiResponse<ChannelData>> {
        // validate
        if (Validator.isGetChannelByMembersDataValid(channelData.members)) {
            const r: ChannelData = await this.channelService.getChannelByMembers(channelData.type, channelData.members);
            if (r) {
                return new ApiResponse(Status.OK, r);
            } else {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Returns connections info
     *
     * @param {IUserIdentity} user User request information
     * @param {MembersFilter} filter Filter type
     * @param {string} channelRef Channel reference
     * @param {IPaginationRequest} pagination Pagination info
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Member Request data
     */
    async filterTopicMembers(
        user: IUserIdentity,
        filter: MembersFilter,
        channelRef: string,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<IMember[]>>> {
        switch (filter) {
            case MembersFilter.getByChannel:
                if (!Hasher.isGuid(channelRef)) {
                    throw new ApiError(Status.BadRequest, Message.InvalidData);
                }
                break;
            default:
                throw new ApiError(Status.NotImplemented, Message.InvalidData);
        }

        const channelId = (await this.channelService.refToChannel(channelRef)).Id;
        const r: IPaginationResponse<MemberInclude[]> = await this.memberService.retrievePaginatedChannelMembers(
            {ChannelId: channelId},
            undefined,
            {User: {select: {Id: true, Ref: true, Status: true, Profile: true}}},
            pagination
        );
        let rUI: IMember[] = [];

        if (r?.data && r.data.length > 0) {
            const myConnections = (await this.userService.rawQuery(user, PeopleConnectedStatus.Connected)).map(
                (p: object) => super.fromDbConnectionModel(p)
            );

            rUI = r.data.map((i: MemberInclude) => super.fromDBMemberModel(i, myConnections));
        }

        const paginationResult: IPaginationResponse<IMember[]> = {
            currentPage: r.currentPage,
            lastPage: r.lastPage,
            totalCount: r.totalCount,
            data: rUI
        };

        return new ApiResponse(Status.OK, paginationResult);
    }

    /**
     * Delete a specific channel
     *
     * @param {number} channelRef Channel ref from database
     * @param {boolean} isHard is Hard delete
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async delete(channelRef: string, isHard?: boolean): Promise<IApiResponse<boolean>> {
        const channelId: number = (await this.channelService.refToChannel(channelRef)).Id;
        // validate
        if (channelId > 0) {
            const r: boolean = await this.channelService.deleteChannel(channelId, isHard);
            if (r) {
                return new ApiResponse(Status.OK, r);
            } else {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Check if there is an existing channel with members, if so, activate the existing channel.
     *
     * @param {IChannelData} channelData Stream channel information
     * @param {string[]} members Ref Members list of Channel
     * @returns {Promise<boolean>} returns a boolean promise
     */
    private async verifyChannel(channelData: IChannelData, members: string[]): Promise<boolean> {
        if (Validator.isGetChannelByMembersDataValid(channelData.members)) {
            const r: ChannelData = await this.channelService.getChannelByMembers(channelData.type, members);
            if (r) {
                try {
                    const uC = await this.channelService.recoverExistingChannel(channelData);
                    if (uC) {
                        return true;
                    } else {
                        return false;
                    }
                } catch (ex) {
                    //Throw the exception
                    throw new ApiError(Status.Conflict, ex.message);
                }
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

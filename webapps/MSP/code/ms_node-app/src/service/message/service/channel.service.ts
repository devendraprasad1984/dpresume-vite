import {delay, inject, injectable} from "tsyringe";
import {Channel, ChannelData, ChannelFilters} from "stream-chat";

import {UtcDate} from "fnpm/utils";
import {Checker} from "fnpm/validators";
import {ApiError} from "fnpm/core";
import {Interval, Message, Status} from "fnpm/enums";
import {ChannelType} from "fnpm/chat/stream/enum";
import {IChannelAPIResponse, IChannelData} from "fnpm/chat/stream/models";
import {StreamApi} from "fnpm/chat/stream";
import {Chat} from "fnpm/chat";
import {CustomChannelType, IChannelInvite, IChannelMember} from "ms-npm/message-models";
import {IUserIdentity} from "ms-npm/auth-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {DbRepo} from "/opt/nodejs/node14/db";
import {
    PrismaClient as MySqlClient,
    MemberRequest,
    Channel as dbChannel,
    Message as dbMessage,
    Prisma,
    Member
} from "/opt/nodejs/node14/db/client-mysql";

import {MessageMapper} from "../mapper/message-mapper";
import {UserInclude} from "../db.includes";
import {UserService} from "./user.service";

/**
 *  Message Chat Service declarations
 */
interface IChannelService {
    // declarations

    /**
     * Ref to id declaration
     */
    refToChannel(ref: string): Promise<dbChannel>;

    /**
     * get channel members by refs
     */
    getChannelMembersByRefs(members: string[]): Promise<IChannelMember[]>;

    /**
     * Get channel by filter
     */
    getChannels(channelId: string[], numberOfDays: number): Promise<string[]>;

    /**
     * Create channel method declaration
     *
     */
    createChannel(
        dbChannelType: CustomChannelType,
        channelData: IChannelData,
        members: IChannelMember[]
    ): Promise<IChannelAPIResponse>;

    /**
     * Add channel members method declaration
     */
    addMembers(channelId: number, channelData: IChannelData): Promise<boolean>;

    /**
     * Remove channel members method declaration
     */
    leaveChannel(user: IUserIdentity, channelData: dbChannel, channelRef: string, members: string[]): Promise<boolean>;

    /**
     * Invite channel members method declaration
     */
    inviteMembers(channelId: number, channelData: IChannelData, isNew: boolean): Promise<boolean>;

    /**
     * Accept or reject invite for channel
     */
    updateInvite(channelInfo: dbChannel, invite: IChannelInvite): Promise<boolean>;

    /**
     * Check if exist a channel with specific members
     */
    getChannelByMembers(type: ChannelType, members: string[]): Promise<ChannelData>;

    /**
     * Recover existing channel on stream and database
     */
    recoverExistingChannel(channelData: IChannelData): Promise<boolean>;

    /**
     * Rename group name with members or directly
     */
    renameGroupName(channelId: number, members: Member[], newGroupName?: string): Promise<boolean>;

    /**
     * Delete a specific channel
     */
    deleteChannel(id: number, isHard: boolean): Promise<boolean>;
}

/**
 * Channel service implementation
 */
@injectable()
export class ChannelService extends MessageMapper implements IChannelService {
    /**
     * Channel controller constructor
     *
     @param {Chat<StreamApi>} chat chat client dependency
     @param {DbRepo<MySqlClient>} dbService db client dependency
     @param {UserService} userService user service dependency
     */
    constructor(
        @inject("Chat") private chat: Chat<StreamApi>,
        @inject("Db") private dbService: DbRepo<MySqlClient>,
        @inject(delay(() => UserService)) private userService: UserService
    ) {
        super();
    }

    // methods

    /**
     * Replace ref for id
     *
     * @param {string} ref guid from db
     * @returns {number} pk / id from db
     */
    async refToChannel(ref: string): Promise<dbChannel> {
        const filter = {Ref: ref};
        return await this.dbService.retrieveUnique<dbChannel>(Prisma.ModelName.Channel, filter);
    }

    /**
     * Replace ref for id
     *
     * @param {string[]} members list of guid members
     * @returns {number} pk / id from db
     */
    async getChannelMembersByRefs(members: string[]): Promise<IChannelMember[]> {
        const channelMembers: IChannelMember[] = [];

        for (const m of members) {
            const user = await this.userService.getUserByRef(m);
            if (user) {
                const member: IChannelMember = {
                    ref: m,
                    id: user.Id,
                    name: `${user.Profile[0].FirstName} ${user.Profile[0].LastName}`
                };
                channelMembers.push(member);
            }
        }

        return channelMembers;
    }

    /**
     * Create channel method implementation
     *
     * @param {CustomChannelType} dbChannelType type of the channel
     * @param {IChannelData} channelData Stream channel information
     * @param {IChannelMember} members Channel members
     * @returns {Promise<IChannelAPIResponse>} promise of type ChannelAPIResponse
     */
    async createChannel(
        dbChannelType: CustomChannelType,
        channelData: IChannelData,
        members: IChannelMember[]
    ): Promise<IChannelAPIResponse> {
        try {
            //Send the request to stream
            const rStream: IChannelAPIResponse = await this.chat.client.streamChannel.create(channelData);

            //Verify if the channel was created successfully in stream
            if (rStream.channel !== null) {
                try {
                    //create the database request
                    const newDbChannel: dbChannel = {
                        Id: 0,
                        Ref: channelData.channelId,
                        ModeratorRef: [channelData.createdById],
                        StreamRef: rStream.channel.id,
                        Status: RecordStatus.Active,
                        IsMSChannel: false,
                        Type: dbChannelType,
                        GroupName: this.isChannelNameEmpty(members, channelData.name),
                        CreatedBy: channelData.createdById,
                        CreatedOn: UtcDate.now(),
                        ModifiedBy: undefined,
                        ModifiedOn: undefined,
                        CompanyRef: undefined
                    };

                    //Send the database request to create a new channel.
                    const rDB = await this.dbService.create<dbChannel>(Prisma.ModelName.Channel, newDbChannel);

                    //Check if the channel was created successfully in the database.
                    if (rDB && rDB.Id > 0) {
                        //Set the new Id from database
                        rStream.channelId = rDB.Id;
                        rStream.channelRef = newDbChannel.Ref;
                        return rStream;
                    }
                } catch (ex) {
                    await this.chat.client.streamChannel.deleteChannel(channelData.channelId, true);
                    throw new ApiError(Status.Conflict, ex.message);
                }
            } else {
                return undefined;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Add channel members method implementation
     *
     * @param {number} channelId channel id from database
     * @param {IChannelData} channelData Stream channel information
     * @param {boolean} isNew to check if this is a new channel
     * @returns {Promise<boolean>} promise of type boolean
     */
    async inviteMembers(channelId: number, channelData: IChannelData, isNew: boolean = false): Promise<boolean> {
        try {
            //instance the creator variable
            let creator: Member = null;
            //Add moderator/creator as current member if not undefined
            if (channelData.createdById !== undefined && isNew) {
                //get the userData from database
                const rCreator = await this.userService.getUserByRef(channelData.createdById);
                //check if the user exist
                if (!rCreator) {
                    //The user could not be obtained
                    throw new ApiError(Status.Conflict, Message.InvalidData);
                }

                //Remove the moderator/creator for invite members data
                channelData.members = channelData.members.filter((f: string) => f !== channelData.createdById);
                //add the moderator in stream
                const newModData: IChannelData = {
                    channelId: channelData.channelId,
                    members: [channelData.createdById]
                };
                //add the creator in stream
                const rCreatorStream = await this.chat.client.streamMember.addMembers(newModData);
                //check the result of add the creator
                if (rCreatorStream) {
                    //Create the member request
                    creator = super.toDbNewMember<Member>(rCreator.Id, channelId, channelData.createdById);
                    //Send the database request to create a new Member
                    const rMemberDB = await this.dbService.create<Member>(Prisma.ModelName.Member, creator);
                    //check if the member was created successfully
                    if (!rMemberDB) {
                        //The member could not be added
                        throw new ApiError(Status.Conflict, Message.InvalidData);
                    }
                }
                //Remove the moderator/creator for invite members data
                channelData.members = channelData.members.filter((f: string) => f !== channelData.createdById);
            }
            //Send the request to stream for invite members
            const rStream = await this.chat.client.streamMember.inviteMembers(channelData);
            //Verify if the members were added successfully in stream channel
            if (rStream) {
                //Add the members request in the database
                const newMembers: MemberRequest[] = super.toDbMemberRequestModel<MemberRequest[]>(channelData);
                //Send the database request to create the member requests.
                const rDB = await this.dbService.createMany<MemberRequest>(Prisma.ModelName.MemberRequest, newMembers);
                //Check if the members were added successfully in the database.
                return rDB.count > 0 ? true : false;
            } else {
                return false;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Add channel members method implementation
     *
     * @param {number} channelId channel id from database
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<boolean>} promise of type boolean
     */
    async addMembers(channelId: number, channelData: IChannelData): Promise<boolean> {
        try {
            //Send the request to stream for invite members
            const rStream = await this.chat.client.streamMember.addMembers(channelData);

            //Verify if the members were added successfully in stream channel
            if (rStream) {
                const usersInfo = await this.getChannelMembersByRefs(channelData.members);

                const membersDB = usersInfo.map((m: IChannelMember) =>
                    super.toDbNewMember<Member>(m.id, channelId, channelData.createdById)
                );

                //Send the database request to create a new Member
                const rMemberDB = await this.dbService.createMany<Member>(Prisma.ModelName.Member, membersDB);
                //check if the member was created successfully
                return rMemberDB.count > 0;
            } else {
                return false;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Leave channel members method implementation
     *
     * @param {IUserIdentity} user user info that request to leave.
     * @param {dbChannel} channelData channel info
     * @param {string} channelRef channel ref for the database and string
     * @param {string[]} members array of member ids
     * @returns {Promise<boolean>} promise of type IServiceResponse of type boolean
     */
    async leaveChannel(
        user: IUserIdentity,
        channelData: dbChannel,
        channelRef: string,
        members: string[]
    ): Promise<boolean> {
        try {
            //Check if the members exists in the channel
            const fCurrentMembers = {ChannelId: channelData.Id, Status: RecordStatus.Active};
            let rDBCurrentMembers = await this.dbService.retrieve<Member>(Prisma.ModelName.Member, fCurrentMembers);
            //check if the channel has active members
            if (rDBCurrentMembers === null || rDBCurrentMembers.length === 1) {
                //the channel doesn't have active members
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            //Check if the leave members are active in the channel
            for (const m of members) {
                //get the userId from database
                const rUser = await this.userService.getUserByRef(m);

                //Check if the member is a active member
                if (rDBCurrentMembers.filter((cMember: Member) => cMember.UserId == rUser.Id).length == 0) {
                    //Leave member is not active in the channel
                    throw new ApiError(Status.Conflict, Message.InvalidData);
                }
            }
            //Set the channel data
            const data: IChannelData = {
                channelId: channelRef,
                members: members
            };

            //Send the request to stream
            const rStream = await this.chat.client.streamMember.removeMembers(data);
            //Verify if the members were removed successfully in stream channel
            if (rStream) {
                //we need to delete the members only
                for (const m of members) {
                    //Check if the channel is a group and we need to archive the channel
                    if (
                        channelData.Type === CustomChannelType.Group &&
                        rDBCurrentMembers.length - members.length === 2
                    ) {
                        //Set the new Channel
                        const newChannel: dbChannel = {
                            Id: undefined,
                            Ref: undefined,
                            ModeratorRef: undefined,
                            CompanyRef: undefined,
                            StreamRef: undefined,
                            Status: RecordStatus.Archived,
                            IsMSChannel: undefined,
                            Type: undefined,
                            GroupName: undefined,
                            CreatedOn: undefined,
                            CreatedBy: undefined,
                            ModifiedBy: user.ref,
                            ModifiedOn: UtcDate.now()
                        };
                        //Archive the channel
                        await this.dbService.update<dbChannel>(Prisma.ModelName.Channel, channelData.Id, newChannel);
                    } else {
                        //check if we need to delete the channel
                        if (rDBCurrentMembers.length - members.length === 1) {
                            //SOFT delete of the channel
                            return this.deleteChannel(channelData.Id);
                        }
                    }
                    //get the user info from database
                    const rUser = await this.userService.getUserByRef(m);
                    //get the member id
                    const mId = rDBCurrentMembers.filter((cMember: Member) => cMember.UserId == rUser.Id);
                    //Delete the channel member from the database
                    const rRemoveMember = await this.dbService.delete<Member>(Prisma.ModelName.Member, mId[0].Id, true);

                    //Update the channel moderators if is a group
                    if (channelData.Type === CustomChannelType.Group) {
                        let moderators: string[] = channelData.ModeratorRef as string[];
                        moderators = moderators.filter((cm: string) => cm != m);
                        const newChannelData = {
                            Id: undefined,
                            Ref: undefined,
                            ModeratorRef: moderators,
                            CompanyRef: undefined,
                            StreamRef: undefined,
                            Status: undefined,
                            IsMSChannel: undefined,
                            Type: undefined,
                            GroupName: undefined,
                            CreatedOn: undefined,
                            CreatedBy: undefined,
                            ModifiedOn: UtcDate.now(),
                            ModifiedBy: user.ref
                        };
                        //update the channel with the new moderator
                        const rDBChannel = await this.dbService.update(
                            Prisma.ModelName.Channel,
                            channelData.Id,
                            newChannelData
                        );
                        if (!rDBChannel) throw new ApiError(Status.Conflict, Message.Failure);
                    }

                    if (rRemoveMember.Id === null) {
                        return false;
                    }

                    //Remove member from the cache list
                    rDBCurrentMembers = rDBCurrentMembers.filter((cMember: Member) => cMember.UserId != rUser.Id);
                }
                let result: boolean = false;

                if (rDBCurrentMembers.length > 0) {
                    result = await this.renameGroupName(channelData.Id, rDBCurrentMembers);
                } else {
                    result = await this.deleteChannel(channelData.Id, true);
                }

                return result;
            } else {
                return false;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Accept or reject invite for channel
     *
     * @param {dbChannel} channelInfo Channel DB info
     * @param {IChannelInvite} invite Invite information
     * @returns {Promise<boolean>} promise of type boolean
     */
    async updateInvite(channelInfo: dbChannel, invite: IChannelInvite): Promise<boolean> {
        try {
            //get the user info
            const uDB = await this.userService.getUserByRef(invite.userRef);

            //check if the user exist
            if (!uDB) {
                //the user could not be obtained
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            //Check the status
            switch (invite.status) {
                case RecordStatus.Active:
                    const rStreamAccept = await this.chat.client.streamChannel.acceptInvite(
                        invite.channelRef,
                        invite.userRef
                    );
                    if (rStreamAccept) {
                        if (channelInfo.Type === CustomChannelType.Group) {
                            //add the moderator in stream
                            const newModData: IChannelData = {
                                channelId: invite.channelRef,
                                members: [invite.userRef]
                            };
                            const rModStream = await this.chat.client.streamMember.addModerators(newModData);
                            //check the result of add the moderator
                            if (rModStream) {
                                const moderators: string[] = channelInfo.ModeratorRef as string[];
                                moderators.push(invite.userRef);
                                const newChannelData = {
                                    Id: undefined,
                                    Ref: undefined,
                                    ModeratorRef: moderators,
                                    CompanyRef: undefined,
                                    StreamRef: undefined,
                                    Status: undefined,
                                    IsMSChannel: undefined,
                                    Type: undefined,
                                    GroupName: undefined,
                                    CreatedOn: undefined,
                                    CreatedBy: undefined,
                                    ModifiedOn: UtcDate.now(),
                                    ModifiedBy: invite.userRef
                                };
                                //update the channel with the new moderator
                                const rDBChannel = await this.dbService.update(
                                    Prisma.ModelName.Channel,
                                    channelInfo.Id,
                                    newChannelData
                                );
                                if (!rDBChannel) throw new ApiError(Status.Conflict, Message.Failure);
                            }
                        }

                        const mBD: Member = await this.dbService.create<Member>(Prisma.ModelName.Member, {
                            Id: 0,
                            UserId: uDB.Id,
                            ChannelId: channelInfo.Id,
                            Status: RecordStatus.Active,
                            GroupMemberRef: undefined,
                            CreatedOn: UtcDate.now(),
                            CreatedBy: invite.userRef,
                            ModifiedOn: null,
                            ModifiedBy: null
                        });
                        if (!mBD) throw new ApiError(Status.Conflict, Message.Failure);
                    } else {
                        throw new ApiError(Status.InternalServerError, Message.InternalServerError);
                    }
                    break;
                case RecordStatus.Archived:
                    const rStreamReject = await this.chat.client.streamChannel.rejectInvite(
                        invite.channelRef,
                        invite.userRef
                    );
                    if (!rStreamReject) throw new ApiError(Status.InternalServerError, Message.InternalServerError);
                    break;
            }

            const mrData: Partial<MemberRequest> = {
                Status: invite.status,
                ModifiedBy: invite.userRef,
                ModifiedOn: UtcDate.now()
            };

            const filterMemberRequestWhere: Partial<MemberRequest> = {
                Id: invite.memberRequestId,
                UserRef: invite.userRef
            };
            const mrDB = await this.dbService.updateMany<MemberRequest>(
                Prisma.ModelName.MemberRequest,
                filterMemberRequestWhere,
                mrData
            );

            if (mrDB) return true;
            else return false;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Check if exist a channel with specific members
     *
     * @param {ChannelType} type type of the channel
     * @param {string[]} members members of the channel
     * @returns {Promise<ChannelData>} promise of type ChannelData
     */
    async getChannelByMembers(type: ChannelType, members: string[]): Promise<ChannelData> {
        try {
            //Set the channel data
            const data: IChannelData = {
                type: type,
                members: members
            };
            //Send the request to stream
            const r = await this.chat.client.streamChannel.getByMembers(data);
            //validate the response
            if (r.length > 0) {
                //Check if the channel exist in the database
                const filter = {StreamRef: r[0].data.id};
                const rDB = await this.dbService.retrieveUnique<dbChannel>(Prisma.ModelName.Channel, filter);
                //check if the channel exist and the status is active
                if (rDB && rDB.Status === RecordStatus.Active) {
                    //return the channel data
                    return r[0].data as ChannelData;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } catch (ex) {
            throw new ApiError(Status.InternalServerError, ex.message);
        }
    }

    /**
     * Get channel by filter
     *
     * @param {string[]} channelId array of channels
     * @param {number} numberOfDays days of last active
     */
    async getChannels(channelId: string[], numberOfDays: number): Promise<string[]> {
        try {
            const filter: ChannelFilters = {
                last_message_at: {$gte: UtcDate.dateAdd(UtcDate.now(), Interval.Day, numberOfDays).toISOString()},
                id: {$in: channelId}
            };
            const r = await this.chat.client.streamChannel.getChannel(filter);
            const arr: string[] = [];
            if (r && r.length > 0) {
                /* eslint-disable @typescript-eslint/typedef */
                r.forEach((element) => {
                    const channel: Channel = element as unknown as Channel;
                    arr.push(channel.id);
                });
            }
            return arr;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update channel members method implementation
     *
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<boolean>} promise of type boolean
     */
    async updateChannel(channelData: IChannelData): Promise<boolean> {
        try {
            //Send the request to stream for invite members
            const rStream = await this.chat.client.streamChannel.updateChannel(channelData);

            return rStream !== undefined;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Recover existing channel on stream and database
     *
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<boolean>} promise of type boolean
     */
    async recoverExistingChannel(channelData: IChannelData): Promise<boolean> {
        try {
            const rStream = await this.chat.client.streamChannel.updateChannel({
                channelId: channelData.channelId,
                frozen: false
            });

            if (rStream) {
                const channel: dbChannel = await this.refToChannel(channelData.channelRef);

                const newChannel: dbChannel = {
                    Id: undefined,
                    Ref: undefined,
                    ModeratorRef: undefined,
                    CompanyRef: undefined,
                    StreamRef: undefined,
                    Status: RecordStatus.Active,
                    IsMSChannel: undefined,
                    Type: undefined,
                    GroupName: undefined,
                    CreatedOn: undefined,
                    CreatedBy: undefined,
                    ModifiedBy: channelData.createdById,
                    ModifiedOn: UtcDate.now()
                };

                //Channel activate
                await this.dbService.update<dbChannel>(Prisma.ModelName.Channel, channel.Id, newChannel);

                const filterMessage: Partial<dbMessage> = {ChannelId: channel.Id};
                const messageData: Partial<dbMessage> = {
                    Status: RecordStatus.Active,
                    ModifiedBy: channelData.createdById,
                    ModifiedOn: UtcDate.now()
                };
                await this.dbService.updateMany<dbMessage>(Prisma.ModelName.Message, filterMessage, messageData);

                //Members activate
                const mData: Partial<Member> = {
                    Status: RecordStatus.Active,
                    ModifiedBy: channelData.createdById,
                    ModifiedOn: UtcDate.now()
                };
                const filterM: Partial<Member> = {ChannelId: channel.Id};
                await this.dbService.updateMany<Member>(Prisma.ModelName.Member, filterM, mData);

                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Delete a channel method implementation
     *
     * @param {number} id channel database id
     * @param {boolean} isHard is Hard delete
     * @returns {Promise<boolean>} promise of type IServiceResponse of type boolean
     */
    async deleteChannel(id: number, isHard: boolean = false): Promise<boolean> {
        try {
            const filterChannel: Partial<dbChannel> = {Id: id};
            //Get the channel by id

            const rChannel: dbChannel = await this.dbService.retrieveUnique<dbChannel>(
                Prisma.ModelName.Channel,
                filterChannel
            );
            //Verify if the channel exist in the database
            if (rChannel && rChannel.Id > 0) {
                //Send the request to stream
                const rStream = await this.chat.client.streamChannel.deleteChannel(rChannel.StreamRef, isHard);
                //check the stream Response
                if (rStream) {
                    //Create filter to delete messages
                    const filterMessage: Partial<dbMessage> = {ChannelId: id};
                    //Delete the messages  from the database
                    const rDeleteMessage = await this.dbService.deleteMany<dbMessage>(
                        Prisma.ModelName.Message,
                        filterMessage,
                        isHard
                    );
                    //Create filter to delete members request
                    const filterMemberRequest: Partial<MemberRequest> = {ChannelRef: rChannel.Ref};
                    //Delete the member request from the database
                    const rMembersRequest = await this.dbService.deleteMany<MemberRequest>(
                        Prisma.ModelName.MemberRequest,
                        filterMemberRequest,
                        isHard
                    );
                    //Create filter to delete current members
                    const filterMember: Partial<Member> = {ChannelId: rChannel.Id};
                    //Delete the member from the database
                    const rDeleteMembers = await this.dbService.deleteMany<Member>(
                        Prisma.ModelName.Member,
                        filterMember,
                        isHard
                    );
                    //Delete the channel from the database
                    const rDeleteChannel: dbChannel = await this.dbService.delete<dbChannel>(
                        Prisma.ModelName.Channel,
                        rChannel.Id,
                        isHard
                    );

                    return (
                        rDeleteMessage.count >= 0 &&
                        rMembersRequest.count >= 0 &&
                        rDeleteMembers.count >= 0 &&
                        rDeleteChannel &&
                        rDeleteChannel.Id > 0
                    );
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Rename group name with members or directly
     *
     * @param {number} channelId channel id from database
     * @param {Member[]} members array of member ids
     * @param {string} newGroupName just rename group name regardless members
     * @returns {Promise<boolean>} rename channel successful or not
     */
    async renameGroupName(channelId: number, members: Member[], newGroupName?: string): Promise<boolean> {
        const channelMembers: IChannelMember[] = [];
        let name: string;
        if (!newGroupName) {
            members.forEach(async (m: Member) => {
                const filterUser = {Id: m.UserId};
                const modelInclude = {Profile: true};
                const rUser = await this.dbService.retrieveUnique<UserInclude>(
                    Prisma.ModelName.User,
                    filterUser,
                    modelInclude
                );
                const member: IChannelMember = {
                    id: rUser.Id,
                    ref: rUser.Ref,
                    name: rUser.Profile[0]?.FirstName + " " + rUser.Profile[0]?.LastName
                };
                channelMembers.push(member);
            });

            name = channelMembers.length == 1 ? channelMembers[0].name : this.isChannelNameEmpty(channelMembers);
        } else {
            name = newGroupName;
        }

        //Send the database request to update a new channel.
        const rDB = await this.dbService.update<dbChannel>(Prisma.ModelName.Channel, channelId, {GroupName: name});

        if (rDB) return true;
        else return false;
    }

    /**
     * Check if the name of the channel is empty, then generate it with the name of the members
     *
     * @param {IChannelMember[]} members channel members
     * @param {string} name channel Name
     * @returns {string} channel name
     */
    isChannelNameEmpty(members: IChannelMember[], name?: string): string {
        if (!Checker.isNullOrEmpty(name)) return name;

        //check the quantity of members
        if (members.length > 2) {
            //Return the name based on the first two members and the rest represented in a number.
            const newName = `${members[0].name}-${members[1].name}-${members.length - 2}`;
            if (newName.length <= 100) {
                return newName;
            } else {
                return newName.substring(0, 97) + "...";
            }
        } else {
            //Return the name based in the members
            return `${members[0].name}-${members[1].name}`;
        }
    }
}

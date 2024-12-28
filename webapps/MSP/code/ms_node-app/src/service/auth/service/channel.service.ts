import {inject, injectable} from "tsyringe";

import {UtcDate} from "fnpm/utils";
import {ApiError} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {ChannelType} from "fnpm/chat/stream/enum";
import {IChannelAPIResponse, IChannelData, IUserResponse} from "fnpm/chat/stream/models";
import {StreamApi} from "fnpm/chat/stream";
import {Chat} from "fnpm/chat";

import {CustomChannelType, IChannelMember} from "ms-npm/message-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {
    MemberRequest,
    Channel as dbChannel,
    Message as dbMessage,
    Prisma,
    Member,
    PrismaClient as MySqlClient
} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";
import {User} from "stream-chat";

/**
 *  Message Chat Service declarations
 */
interface IChannelService {
    // declarations
    /**
     * Create channel method declaration
     *
     */
    createChannel(
        type: ChannelType,
        name: string,
        createdById: string,
        dbChannelType: CustomChannelType,
        channelId?: string
    ): Promise<IChannelAPIResponse>;

    /**
     * Add channel members method declaration
     */
    addMembers(
        channelId: number,
        members: { ref: string; id: number }[],
        channelRef?: string,
        streamRef?: string,
        inviteMessage?: string
    ): Promise<boolean>;

    /**
     * Delete a specific channel
     */
    deleteChannel(id: number, isHard: boolean): Promise<boolean>;
}

/**
 * Channel service implementation
 */
@injectable()
export class ChannelService implements IChannelService {
    /**
     * Channel controller constructor
     *
     @param {Chat<StreamApi>} chat chat client dependency
     @param {DbRepo<MySqlClient>} dbService db client dependency
     */
    constructor(@inject("Chat") private chat: Chat<StreamApi>, @inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    // methods

    /**
     * Create channel method implementation
     *
     * @param {ChannelType} type Channel Stream Api Type
     * @param {string} name Name of Channel
     * @param {string} createdById User who creates the channel
     * @param {CustomChannelType} dbChannelType type of the channel
     * @param {string?} channelId Name of Channel
     * @returns {Promise<IChannelAPIResponse>} promise of type ChannelAPIResponse
     */
    async createChannel(
        type: ChannelType,
        name: string,
        createdById: string,
        dbChannelType: CustomChannelType,
        channelId?: string
    ): Promise<IChannelAPIResponse> {
        try {
            //Set the channel data
            const data: IChannelData = {
                type: type,
                name: name,
                createdById: createdById,
                channelId: channelId
            };

            //Send the request to stream
            const rStream: IChannelAPIResponse = await this.chat.client.streamChannel.create(data);

            //Verify if the channel was created successfully in stream
            if (rStream.channel !== null) {
                //create the database request
                const newDbChannel: dbChannel = {
                    Id: 0,
                    Ref: data.channelId,
                    ModeratorRef: createdById,
                    StreamRef: rStream.channel.id,
                    Status: RecordStatus.Active,
                    IsMSChannel: true,
                    Type: dbChannelType,
                    GroupName: name,
                    CreatedBy: createdById,
                    CreatedOn: UtcDate.now(),
                    ModifiedBy: null,
                    ModifiedOn: null,
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
     * @param {IChannelMember[]} members array of members
     * @param {string} channelRef channel database ref
     * @param {string} streamRef channel stream ref
     * @param {string} inviteMessage message text to invite
     * @returns {Promise<boolean>} promise of type boolean
     */
    async addMembers(
        channelId: number,
        members: IChannelMember[],
        channelRef?: string,
        streamRef?: string,
        inviteMessage?: string
    ): Promise<boolean> {
        try {
            //TODO Add generic invite message in case the channel is new
            //check if we need to retrieve the references from database
            if (channelRef === undefined && streamRef === undefined) {
                //get the data from database
                const filter = {Id: channelId};
                const rDB = await this.dbService.retrieveUnique<dbChannel>(Prisma.ModelName.Channel, filter);
                //check if the channel exist
                if (!rDB) {
                    //The channel could not be obtained
                    throw new ApiError(Status.Conflict, Message.InvalidData);
                }
                //Assign the data
                channelRef = rDB.Ref;
                streamRef = rDB.StreamRef;
            }

            //Set the channel data
            const data: IChannelData = {
                channelId: streamRef,
                members: members.map((v: IChannelMember) => v.ref),
                inviteMessage: inviteMessage,
                channelRef: channelRef
            };

            //Send the request to stream
            const rStream = await this.chat.client.streamMember.inviteMembers(data);

            //Verify if the members were added successfully in stream channel
            if (rStream) {
                //If the user id is 0, it's a GroupMember record
                const groupMember = members.find((v: { ref: string; id: number }) => v.id == 0);

                //Add the members in the database
                members.forEach(async (m: { ref: string; id: number }) => {
                    const rStreamAccept = await this.chat.client.streamChannel.acceptInvite(streamRef, m.ref);

                    if (rStreamAccept) {
                        if (m.ref != groupMember.ref) {
                            const mBD: Member = await this.dbService.create<Member>(Prisma.ModelName.Member, {
                                Id: 0,
                                UserId: m.id,
                                ChannelId: channelId,
                                Status: RecordStatus.Active,
                                GroupMemberRef: groupMember.ref,
                                CreatedOn: UtcDate.now(),
                                CreatedBy: m.ref,
                                ModifiedOn: null,
                                ModifiedBy: null
                            });
                            if (!mBD) throw new ApiError(Status.Conflict, Message.Failure);
                        }
                    } else {
                        throw new ApiError(Status.InternalServerError, Message.InternalServerError);
                    }
                });

                //Check if the members were added successfully in the database.
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
            if (rChannel !== null) {
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
     * Query Stream User information
     *
     * @param {string[]} usersRef Users ref info
     * @returns {Promise<IUserResponse[]>} Return stream user info
     */
    async queryUsers(usersRef: string[]): Promise<IUserResponse[]> {
        try {
            const r = await this.chat.client.streamUser.queryUsers({id: {$in: usersRef}});
            return r;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update Stream User information
     *
     * @param {User[]} users User info to be updated
     * @returns {boolean} Return flag to indicate if users were updated
     */
    async updateStreamUsers(users: User[]): Promise<boolean> {
        try {
            const r = await this.chat.client.streamUser.syncUser(users);
            return r;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Register Stream User information
     *
     * @param {User[]} users User info to be registered
     * @returns {boolean} Return flag to indicate if users were registered
     */
    async registerStreamUser(users: User[]): Promise<boolean> {
        try {
            const rStream = await this.queryUsers(users.map((u: User) => u.id));
            const newUsers = users.filter((u: User) => !rStream.some((ur: IUserResponse) => ur.id == u.id));

            if (newUsers.length > 0) {
                const rUser = await this.updateStreamUsers(newUsers);
                return rUser;
            } else {
                //If length is equal 0, it means all users are already registered.
                return true;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

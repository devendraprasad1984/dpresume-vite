import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiError, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Any} from "fnpm/types";
import {StreamApi} from "fnpm/chat/stream";
import {Chat} from "fnpm/chat";
import {IChannelData} from "fnpm/chat/stream/models";
import {IChannelMember} from "ms-npm/message-models";

import {Prisma, Topic, PrismaClient as MySqlClient, Member} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";
import {IModelInclude, IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {ChannelService} from "./channel.service";
import {UserService} from "./user.service";
import {ChannelMapper} from "../mapper/channel-mapper";

import {MemberInclude, TopicInclude} from "../db.includes";

/**
 * Topic Service declarations
 */
interface ITopicService {
    /**
     * Retrieve topic
     *
     * @returns {Topic} returns Topic object
     */
    single(filter: Partial<TopicInclude>, select?: IModelSelect, modelInclude?: IModelInclude): Promise<TopicInclude>;

    /**
     * Retrieve topics by filter
     *
     * @param {number} id topic id
     * @returns {Topic[]} return topic object
     */
    filter(
        filter?: IWhereFilter<Topic>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Topic[]>;

    /**
     * Topic retrieved paginated declaration
     *
     * @param {IWhereFilter<Topic>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinct field info
     * @returns {Promise<IPaginationResponse<TopicInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    retrievePaginated(
        filter?: IWhereFilter<Topic>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<TopicInclude[]>>;

    /**
     * Create topic implementation
     *
     * @param {Topic} topic topic object from UI Model
     * @returns {Topic} return new topic information
     */
    create(topic: Topic): Promise<Topic>;

    /**
     * Update topic implementation
     *
     * @param {number} id topic id
     * @param {ITopic} topic topic UI model
     */
    update(id: number, topic: Topic): Promise<Topic>;

    /**
     * Delete topic implementation
     *
     * @param {number} id topic id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     */
    delete(id: number): Promise<boolean>;

    /**
     * Add moderator implementation
     *
     * @param {number} channelId channel id
     * @param {IChannelData} channelData channel data
     * @returns {Promise<boolean>}
     */
    addModerators(channelId: number, channelData: IChannelData): Promise<boolean>;

    /**
     * Demote moderator implementation
     *
     * @param {number} channelId channel id
     * @param {IChannelData} channelData channel data
     * @returns {Promise<boolean>}
     */
    demoteModerators(channelId: number, channelData: IChannelData): Promise<boolean>;

    /**
     * Leave channel implementation
     *
     * @param {number} channelId channel id
     * @param {string} channelRef channel ref
     * @param {string[]} members channel members
     * @returns {Promise<boolean>}
     */
    leaveChannel(channelId: number, channelRef: string, members: string[]): Promise<boolean>;
}

/**
 * Topic service implementation
 */
@injectable()
export class TopicService extends ChannelMapper implements ITopicService {
    /**
     * Topic Controller constructor
     *
     * @param {Chat<StreamApi>} chat Stream service dependency
     * @param {DbRepo<MySqlClient>} dbService database service dependency
     * @param {ChannelService} channelService channel service dependency
     * @param {UserService} userService user service dependency
     */
    constructor(
        @inject("Chat") private chat: Chat<StreamApi>,
        @inject("Db") private dbService: DbRepo<MySqlClient>,
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => UserService)) private userService: UserService
    ) {
        super();
    }

    // methods
    /**
     * Replace ref for id
     *
     * @param {string} topicRef guid from db
     * @returns {number} topic and channel info
     */
    async topicDetails(topicRef: string): Promise<TopicInclude> {
        const select: IModelSelect = {
            Id: true,
            Ref: true,
            Moderator: true,
            Channel: {
                select: {
                    Id: true,
                    Ref: true
                }
            }
        };
        return this.dbService.retrieveUnique<TopicInclude>(
            Prisma.ModelName.Topic,
            {Ref: topicRef},
            undefined,
            select
        );
    }

    /**
     * Topic retrieve implementation
     *
     * @param {Partial<Topic>} filter  Query params of the wanted topic
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IModelInclude} modelInclude Model returned on query
     * @returns {Topic} return array of topics
     */
    async single(
        filter: Partial<TopicInclude>,
        select?: IModelSelect,
        modelInclude?: IModelInclude
    ): Promise<TopicInclude> {
        try {
            return this.dbService.retrieveUnique<TopicInclude>(Prisma.ModelName.Topic, filter, modelInclude, select);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get topic array
     *
     * @param {IWhereFilter<Topic>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Topic[]>} Return promise with topic array
     */
    async filter(
        filter?: IWhereFilter<Topic>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<TopicInclude[]> {
        try {
            return this.dbService.retrieve<TopicInclude>(
                Prisma.ModelName.Topic,
                filter,
                undefined,
                orderBy,
                skip,
                take,
                select
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get pagination data
     *
     * @param {IWhereFilter<Company>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {IModelSelect} select Retrieved fields on query
     * @param {IPaginationRequest} pagination pagination information
     * @param {Any | Any[]} distinct distinct field info
     * @returns {Promise<IPaginationResponse<TopicInclude[]>>} promise of IPaginationResponse<UserInclude[]>
     */
    async retrievePaginated(
        filter?: IWhereFilter<Topic>,
        orderBy?: ISort,
        select?: IModelSelect,
        pagination?: IPaginationRequest,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<TopicInclude[]>> {
        try {
            return this.dbService.retrievePaginated<TopicInclude>(
                Prisma.ModelName.Topic,
                orderBy,
                pagination.perPage,
                pagination.page,
                filter,
                undefined,
                select,
                distinct
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Topic create implementation
     *
     * @param {Topic} topic Topic information to save
     * @returns {Topic} Return new topic information
     */
    async create(topic: Topic): Promise<Topic> {
        try {
            return this.dbService.create<Topic>(Prisma.ModelName.Topic, topic);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Topic update implementation
     *
     * @param {number} id Topic id number
     * @param {Topic} topic  Topic information to save
     * @returns {Topic} Return new topic information
     */
    async update(id: number, topic: Partial<Topic>): Promise<Topic> {
        try {
            return this.dbService.update<Topic>(Prisma.ModelName.Topic, id, topic);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Topic delete implementation
     *
     * @param {number} id Topic id to delete
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {boolean} Return flag to indicate delete state.
     */
    async delete(id: number, isHard?: boolean): Promise<boolean> {
        try {
            const r: Topic = await this.dbService.delete<Topic>(Prisma.ModelName.Topic, id, isHard);
            return r && r.Id > 0;
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
    async addModerators(channelId: number, channelData: IChannelData): Promise<boolean> {
        try {
            //Send the request to stream for invite members
            const rStream = await this.chat.client.streamMember.addModerators(channelData);

            //Verify if the members were added successfully in stream channel
            if (rStream) {
                const filter: IWhereFilter<Prisma.TopicWhereInput> = {
                    ChannelRef: channelData.channelId,
                    Channel: {Member: {every: {Status: RecordStatus.Active}}}
                };

                const select: IModelSelect = {
                    Id: true,
                    Moderator: true,
                    Channel: {
                        select: {
                            Member: {
                                select: {
                                    User: {
                                        select: {
                                            Id: true,
                                            Ref: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                const channelUsers: TopicInclude[] = await this.filter(filter, undefined, undefined, undefined, select);
                let members: IChannelMember[] = [];

                if (channelUsers[0]?.Channel?.Member !== undefined) {
                    channelData.members = channelData.members.filter(
                        (m: string) => !channelUsers[0]?.Channel?.Member.some((u: MemberInclude) => m === u.User.Ref)
                    );
                }

                if (channelData.members.length == 0) {
                    return true;
                }

                members = await this.channelService.getChannelMembersByRefs(channelData.members);

                const membersDB = members.map((m: IChannelMember) =>
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
     * Add channel members method implementation
     *
     * @param {number} channelId channel id from database
     * @param {IChannelData} channelData Stream channel information
     * @returns {Promise<boolean>} promise of type boolean
     */
    async demoteModerators(channelId: number, channelData: IChannelData): Promise<boolean> {
        try {
            //Send the request to stream for invite members
            const rStream = await this.chat.client.streamMember.demoteModerators(channelData);

            //Verify if the members were added successfully in stream channel
            return rStream;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Leave channel members method implementation
     *
     * @param {number} channelId channel id from database
     * @param {string} channelRef channel ref for the database and string
     * @param {string[]} members array of member ids
     * @returns {Promise<boolean>} promise of type IServiceResponse of type boolean
     */
    async leaveChannel(channelId: number, channelRef: string, members: string[]): Promise<boolean> {
        try {
            //Check if the members exists in the channel
            const fCurrentMembers = {ChannelId: channelId, Status: RecordStatus.Active};
            const rDBCurrentMembers = await this.dbService.retrieve<Member>(Prisma.ModelName.Member, fCurrentMembers);
            const usersId: number[] = [];

            //check if the channel has active members
            if (rDBCurrentMembers === null) {
                //the channel doesn't have active members
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            //Check if the leave members are active in the channel
            for (const m in members) {
                //get the userId from database
                const rUser = await this.userService.getUserByRef(m);
                usersId.push(rUser.Id);

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
                const rRemoveMember = await this.dbService.deleteMany<Member>(
                    Prisma.ModelName.Member,
                    {ChannelId: channelId, UserId: {in: usersId}},
                    true
                );

                return rRemoveMember.count == usersId.length;
            } else {
                return false;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

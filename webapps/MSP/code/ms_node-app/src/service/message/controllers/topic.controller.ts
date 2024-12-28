import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiResponse, ApiError, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {ChannelType} from "fnpm/chat/stream/enum";
import {IChannelAPIResponse, IChannelData} from "fnpm/chat/stream/models";
import {Hasher, UtcDate} from "fnpm/utils";
import {Checker} from "fnpm/validators";

import {IMember, ITopic, ITopicCreate, ITopicMemberRequest, ITopicView} from "ms-npm/topic-models";
import {IAudit} from "ms-npm/base-models";
import {IUserIdentity} from "ms-npm/auth-models";
import {MemberRequestFilter} from "ms-npm/routes/user";
import {IMemberRequest} from "ms-npm/user-models";
import {MembersFilter} from "ms-npm/routes/message";

import {ITopicQuery, ITopicSearch, LastActiveStatus, PeopleConnectedStatus} from "ms-npm/search-models";
import {TopicFilter} from "ms-npm/routes/message";
import {CustomChannelType} from "ms-npm/message-models";

import {MemberRequest, Prisma, Topic} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {IModelInclude, IModelSelect, IWhereFilter} from "/opt/nodejs/node14/db/models";

import {Validator} from "../validator";

import {ChannelMapper} from "../mapper/channel-mapper";
import {MemberInclude, TopicInclude, UserInclude} from "../db.includes";
import {TopicService} from "../service/topic.service";
import {MemberRequestService} from "../service/member-request.service";
import {UserService} from "../service/user.service";
import {ChannelService} from "../service/channel.service";
import {MemberService} from "../service/member.service";

/**
 * Topic Controller declarations
 */
interface ITopicController {
    /**
     * Create topic declaration
     */
    createTopic(user: IUserIdentity, topic: ITopicCreate): Promise<IApiResponse<ITopic>>;

    /**
     * Get topic by id declaration
     */
    single(user: IUserIdentity, topicRef: string): Promise<IApiResponse<ITopicView>>;

    /**
     * Get topic array
     */
    filter(
        user: IUserIdentity,
        topicFilter: TopicFilter,
        query: ITopicQuery,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<ITopicSearch[]>>>;

    /**
     * Update topic method
     *
     * @returns {Promise<IApiResponse<ITopic>>} promise of type IApiResponse of type ITopic
     */
    updateTopic(user: IUserIdentity, topicRef: string, topic: Partial<ITopic>): Promise<IApiResponse<ITopic>>;

    /**
     * Delete topic method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    deleteTopic(topicRef: string, isHard?: boolean): Promise<IApiResponse<boolean>>;

    /**
     * Delete topic method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    removeMembers(user: IUserIdentity, topicRef: string, members: string[]): Promise<IApiResponse<boolean>>;

    /**
     * Add members to topic method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    addMembers(topicRef: string, members: string[]): Promise<IApiResponse<boolean>>;

    /**
     * Demote topic moderator method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    demoteModerators(user: IUserIdentity, topicRef: string, members: string[]): Promise<IApiResponse<boolean>>;

    /**
     * Add topic moderator method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    addModerators(user: IUserIdentity, topicRef: string, members: string[]): Promise<IApiResponse<boolean>>;

    /**
     * Get member request list method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    filterMemberRequest(
        type: MemberRequestFilter,
        filter?: IWhereFilter<MemberRequest>
    ): Promise<IApiResponse<IMemberRequest[]>>;

    /**
     * Update member request method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    updateMemberRequest(
        requestUser: IUserIdentity,
        requestId: number,
        memberRequestData: Partial<IMemberRequest>
    ): Promise<IApiResponse<IMemberRequest>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class TopicController extends ChannelMapper implements ITopicController {
    /**
     * Topic Controller constructor
     *
     * @param {TopicService} topicService database service dependency
     * @param {ChannelService} channelService channel service dependency
     * @param {MemberRequestService} memberRequestService member request dependency
     * @param {UserService} userService user dependency
     * @param {MemberService} memberService member dependency
     */
    constructor(
        @inject(delay(() => TopicService)) private topicService: TopicService,
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => MemberRequestService)) private memberRequestService: MemberRequestService,
        @inject(delay(() => UserService)) private userService: UserService,
        @inject(delay(() => MemberService)) private memberService: MemberService
    ) {
        super();
    }

    // methods
    /**
     * Create topic implementation
     *
     * @param {IUserIdentity} user user info
     * @param {ITopicCreate} data topic UI model
     * @returns {ITopic} topic UI model
     */
    async createTopic(user: IUserIdentity, data: ITopicCreate): Promise<IApiResponse<ITopic>> {
        data.topic.ref = Hasher.guid();
        if (Validator.isTopicValid(data.topic)) {
            data.topic.audit = <IAudit>{};
            data.topic.audit.createdBy = user.ref;
            data.topic.audit.createdOn = UtcDate.now();
            data.topic.channelRef = Hasher.guid();
            if (!data.topic.moderators.some((m: string) => m === user.ref)) {
                data.topic.moderators.push(user.ref);
            }

            const topicDB: Topic = super.toDbTopicModel(data.topic);

            const channel: IChannelData = {
                name: data.topic.title,
                channelId: data.topic.channelRef,
                createdById: user.ref,
                inviteMessage: data.message,
                type: ChannelType.Team
            };
            const rChannel = await this.createChannel(channel, data.members, [data.topic.audit.createdBy]);

            if (rChannel) {
                try {
                    const r: Topic = await this.topicService.create(topicDB);

                    const topicUI: ITopic = super.fromDbTopicModel(r);
                    return new ApiResponse(Status.OK, topicUI);
                } catch (ex) {
                    //Delete the channel in stream and database
                    await this.channelService.deleteChannel(rChannel.channelId, true);
                    //Throw the exception
                    throw new ApiError(Status.Conflict, ex.message);
                }
            } else {
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * REturn Topic view data
     *
     * @param {IUserIdentity} user Request user
     * @param {string} topicRef Topic ref
     * @returns {Promise<IApiResponse<ITopicView>>} Topic view
     */
    async single(user: IUserIdentity, topicRef: string): Promise<IApiResponse<ITopicView>> {
        if (Hasher.isGuid(topicRef)) {
            const include: IModelInclude = {
                Channel: {
                    select: {
                        Member: {
                            select: {
                                Status: true,
                                User: {
                                    select: {
                                        Id: true,
                                        Ref: true,
                                        Profile: {
                                            select: {
                                                FirstName: true,
                                                LastName: true,
                                                Headline: true,
                                                CompanyHeadline: true,
                                                Pronouns: true,
                                                Picture: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                Company: {
                    select: {
                        Id: true,
                        Ref: true,
                        Info: {select: {Name: true}}
                    }
                },
                MemberRequest: {
                    select: {
                        Id: true,
                        Status: true,
                        User: {
                            select: {
                                Id: true,
                                Ref: true,
                                Profile: {
                                    select: {
                                        FirstName: true,
                                        LastName: true,
                                        Headline: true,
                                        CompanyHeadline: true,
                                        Pronouns: true,
                                        Picture: true
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const filter = {Ref: topicRef};

            const r = await this.topicService.single(filter, undefined, include);

            if (r) {
                const rTopicView = super.fromDbTopicViewModel(r);

                rTopicView.moderators = rTopicView.members.filter((m: IMember) =>
                    (<string[]>r.Moderator).some((mod: string) => mod === m.ref)
                );

                rTopicView.connectStatus = rTopicView.members.some((m: IMember) => m.ref == user.ref)
                    ? PeopleConnectedStatus.Connected
                    : rTopicView.memberRequests.some((mr: ITopicMemberRequest) => mr.user.ref == user.ref)
                        ? PeopleConnectedStatus.Pending
                        : PeopleConnectedStatus.NotConnected;

                rTopicView.members = rTopicView.members.filter((m: IMember) => m.status == RecordStatus.Active);
                rTopicView.totalMembers = rTopicView.members.length;
                rTopicView.members = rTopicView.members.slice(0, 15);

                rTopicView.memberRequests = rTopicView.memberRequests.filter(
                    (m: ITopicMemberRequest) => m.status == RecordStatus.Pending
                );
                rTopicView.totalMemberRequest = rTopicView.memberRequests.length;
                rTopicView.memberRequests = rTopicView.memberRequests.slice(0, 15);

                return new ApiResponse(Status.OK, rTopicView);
            } else {
                return new ApiResponse(Status.OK, <ITopicView>{});
            }
        } else {
            throw new ApiError(Status.Conflict, Message.InvalidData);
        }
    }

    /**
     * Filter topics search
     *
     * @param {IUserIdentity} user Request user
     * @param {TopicFilter} topicFilter topic filter
     * @param {ITopicQuery} query query filter of topics
     * @param {IPaginationRequest} pagination Pagination request info
     * @returns {Promise<IApiResponse<IPaginationResponse<ITopicSearch[]>>>} promise of type IApiResponse of Topics
     */
    async filter(
        user: IUserIdentity,
        topicFilter: TopicFilter,
        query: ITopicQuery,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<ITopicSearch[]>>> {
        const filter: IWhereFilter<Prisma.TopicWhereInput> = {};
        const searchFilter: Prisma.TopicWhereInput[] = [];

        searchFilter.push({Status: RecordStatus.Active});

        const select: IModelSelect = {
            Id: true,
            Ref: true,
            Access: true,
            Title: true,
            EndedOn: true,
            Picture: true,
            Company: {
                select: {
                    Id: true,
                    Ref: true,
                    Info: {select: {Name: true, Category: true}}
                }
            },
            Channel: {
                select: {
                    Ref: true,
                    Member: {
                        select: {
                            Status: true,
                            User: {
                                select: {
                                    Id: true,
                                    Ref: true
                                }
                            }
                        }
                    }
                }
            },
            MemberRequest: {
                select: {
                    Status: true,
                    User: {
                        select: {
                            Id: true,
                            Ref: true
                        }
                    }
                }
            }
        };

        if (!Checker.isNullOrEmpty(query.keyword)) {
            filter.OR = [{Title: {contains: query.keyword}}, {Description: {contains: query.keyword}}];
        }
        if (query.company && query.company.length > 0) {
            searchFilter.push({Company: {Info: {some: {Name: {in: query.company}}}}});
        }
        if (query.industry && query.industry.length > 0) {
            searchFilter.push({Company: {Info: {some: {Category: {in: query.industry}}}}});
        }

        switch (topicFilter) {
            case TopicFilter.explore:
                searchFilter.push({IsHidden: false});
                break;
            case TopicFilter.myConnections:
                //Not filter hidden, or other values in future
                break;
        }

        filter.AND = searchFilter;

        const r: IPaginationResponse<TopicInclude[]> = await this.topicService.retrievePaginated(
            filter,
            undefined,
            select,
            pagination
        );

        if (r) {
            let rUI: ITopicSearch[] = [];

            if (query.lastActive) {
                const arrChannels: string[] = r.data.map((i: TopicInclude) => i.Channel.Ref);
                let refChannels: string[] = [];
                switch (query.lastActive) {
                    case LastActiveStatus.Less24hrs:
                        refChannels = await this.channelService.getChannels(arrChannels, -1);
                        break;
                    case LastActiveStatus.Less1Week:
                        refChannels = await this.channelService.getChannels(arrChannels, -7);
                        break;
                    case LastActiveStatus.Less1Month:
                        refChannels = await this.channelService.getChannels(arrChannels, -30);
                        break;
                }
                r.data = r.data.filter((t: TopicInclude) => refChannels.some((i: string) => i == t.Channel.Ref));
            }

            rUI = r.data.map((i: TopicInclude) => super.fromDbTopicSearch(i, user.ref));
            const paginationResult: IPaginationResponse<ITopicSearch[]> = {
                currentPage: r.currentPage,
                lastPage: r.lastPage,
                totalCount: r.totalCount,
                data: rUI
            };
            return new ApiResponse(Status.OK, paginationResult);
        }

        throw new ApiError(Status.BadRequest, Message.InvalidData);
    }

    /**
     * Topic update implementation
     *
     * @param {IUserIdentity} user User info
     * @param {string} topicRef Topic ref to delete
     * @param {Partial<ITopic>} topic Topic data to be updated
     * @returns {boolean} Return flag to indicate delete state.
     */
    async updateTopic(user: IUserIdentity, topicRef: string, topic: Partial<ITopic>): Promise<IApiResponse<ITopic>> {
        const topicInfo = await this.topicService.topicDetails(topicRef);
        if (topicInfo.Id > 0 && Validator.isTopicValid(topic, true)) {
            const rTopic = await this.topicService.single({Id: topicInfo.Id});
            const channelData: IChannelData = {
                name: topic.title,
                channelId: rTopic.ChannelRef
            };

            //If title is updated, stream info will be updated
            if (topic.title !== undefined) {
                const rChannnel = await this.channelService.updateChannel(channelData);

                if (!rChannnel) {
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            }
            const topicDB: Partial<Topic> = super.toDbTopicModel(topic);

            (topicDB.ModifiedBy = user.ref), (topicDB.ModifiedOn = UtcDate.now());

            const r: Topic = await this.topicService.update(topicInfo.Id, topicDB);
            return new ApiResponse(Status.OK, super.fromDbTopicModel(r));
        } else {
            throw new ApiError(Status.Conflict, Message.InvalidData);
        }
    }

    /**
     * Delete topic implementation
     *
     * @param {string} topicRef Channel ref from database
     * @param {boolean} isHard is Hard delete
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async deleteTopic(topicRef: string, isHard?: boolean): Promise<IApiResponse<boolean>> {
        const topic: TopicInclude = await this.topicService.topicDetails(topicRef);
        // validate
        if (topic.Id > 0) {
            const rTopic: boolean = await this.topicService.delete(topic.Id, isHard);
            if (rTopic) {
                const r: boolean = await this.channelService.deleteChannel(topic.Channel.Id, isHard);

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
     * @param {string} topicRef Topic reference
     * @param {IPaginationRequest} pagination Pagination info
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Member Request data
     */
    async filterTopicMembers(
        user: IUserIdentity,
        filter: MembersFilter,
        topicRef: string,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<IMember[]>>> {
        switch (filter) {
            case MembersFilter.getByTopic:
                if (!Hasher.isGuid(topicRef)) {
                    throw new ApiError(Status.BadRequest, Message.InvalidData);
                }
                break;
            default:
                throw new ApiError(Status.NotImplemented, Message.InvalidData);
        }

        const rTopic = await this.topicService.topicDetails(topicRef);
        const r: IPaginationResponse<MemberInclude[]> = await this.memberService.retrievePaginatedChannelMembers(
            {ChannelId: rTopic.Channel.Id},
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
     * Leave members to a specific channel.
     *
     * @param {IUserIdentity} user request user info
     * @param {string} topicRef channel ref from database
     * @param {string[]} members list of members that will be removed.
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async removeMembers(user: IUserIdentity, topicRef: string, members: string[]): Promise<IApiResponse<boolean>> {
        //validate
        if (Validator.isRemoveMembersValid(topicRef, members)) {
            const rTopic = await this.topicService.topicDetails(topicRef);

            if (rTopic) {
                const removedModerators = (<string[]>rTopic.Moderator).filter((m: string) =>
                    members.some((u: string) => u == m)
                );

                //There should always more than one moderator
                if ((<string[]>rTopic.Moderator).length - removedModerators.length < 1) {
                    throw new ApiError(Status.Conflict, Message.InvalidData);
                }

                const r: boolean = await this.topicService.leaveChannel(rTopic.Channel.Id, rTopic.Channel.Ref, members);

                //check the response
                if (r) {
                    if (removedModerators.length > 0) {
                        rTopic.Moderator = (<string[]>rTopic.Moderator).filter(
                            (s: string) => !removedModerators.some((m: string) => m == s)
                        );
                        await this.updateTopic(user, topicRef, {moderators: <string[]>rTopic.Moderator});
                    }
                    return new ApiResponse(Status.OK, r);
                } else {
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            }
        }
    }

    /**
     * Leave members to a specific channel.
     *
     * @param {string} topicRef channel ref from database
     * @param {string[]} members list of members that will be removed.
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async addMembers(topicRef: string, members: string[]): Promise<IApiResponse<boolean>> {
        //validate
        if (Validator.isAddMembersValid(topicRef, members)) {
            const rTopic = await this.topicService.topicDetails(topicRef);

            if (rTopic) {
                const channel: IChannelData = {
                    channelId: rTopic.Channel.Ref,
                    members: members
                };

                const r: boolean = await this.channelService.addMembers(rTopic.Channel.Id, channel);

                //check the response
                if (r) {
                    return new ApiResponse(Status.OK, r);
                } else {
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            }
        }
    }

    /**
     * Leave members to a specific channel.
     *
     * @param {IUserIdentity} user request user info
     * @param {string} topicRef channel ref from database
     * @param {string[]} members list of members that will be removed.
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async demoteModerators(user: IUserIdentity, topicRef: string, members: string[]): Promise<IApiResponse<boolean>> {
        //validate
        if (Validator.isRemoveMembersValid(topicRef, members)) {
            const rTopic = await this.topicService.topicDetails(topicRef);

            if (rTopic) {
                const removedModerators = (<string[]>rTopic.Moderator).filter((m: string) =>
                    members.some((u: string) => u == m)
                );

                //At least one moderator in the Topic
                if ((<string[]>rTopic.Moderator).length - removedModerators.length < 1) {
                    throw new ApiError(Status.Conflict, Message.InvalidData);
                }

                const channel: IChannelData = {
                    channelId: rTopic.Channel.Ref,
                    members: members
                };

                const r: boolean = await this.topicService.demoteModerators(rTopic.Channel.Id, channel);

                //check the response
                if (r) {
                    rTopic.Moderator = (<string[]>rTopic.Moderator).filter(
                        (s: string) => !members.some((m: string) => m == s)
                    );
                    await this.updateTopic(user, topicRef, {moderators: <string[]>rTopic.Moderator});
                    return new ApiResponse(Status.OK, r);
                } else {
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            }
        }
    }

    /**
     * Leave members to a specific channel.
     *
     * @param {IUserIdentity} user User info
     * @param {string} topicRef channel ref from database
     * @param {string[]} members list of members that will be removed.
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async addModerators(user: IUserIdentity, topicRef: string, members: string[]): Promise<IApiResponse<boolean>> {
        //validate
        if (Validator.isAddMembersValid(topicRef, members)) {
            const rTopic = await this.topicService.topicDetails(topicRef);

            if (rTopic) {
                const channel: IChannelData = {
                    channelId: rTopic.Channel.Ref,
                    members: members,
                    createdById: user.ref
                };

                const r: boolean = await this.topicService.addModerators(rTopic.Channel.Id, channel);

                //check the response
                if (r) {
                    rTopic.Moderator = [...(<string[]>rTopic.Moderator), ...members];
                    await this.updateTopic(user, topicRef, {moderators: <string[]>rTopic.Moderator});
                    return new ApiResponse(Status.OK, r);
                } else {
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            }
        }
    }

    /**
     * Returns connections info
     *
     * @param {MemberRequestFilter} type Filter used for query
     * @param {IWhereFilter<MemberRequest>} filter Filter query
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Member Request data
     */
    async filterMemberRequest(
        type: MemberRequestFilter,
        filter?: IWhereFilter<MemberRequest>
    ): Promise<IApiResponse<IMemberRequest[]>> {
        switch (type) {
            case MemberRequestFilter.getRequestByTopic:
                if (!Hasher.isGuid(<string>filter.TopicRef)) {
                    throw new ApiError(Status.BadRequest, Message.InvalidData);
                }
                break;
            default:
        }
        const r = await this.memberRequestService.filter(filter);

        let memberRequestUI: IMemberRequest[] = [];

        if (r && r.length > 0) {
            //create map of user information
            const users: Map<string, Partial<UserInclude>> = new Map(
                (await this.userService.filter({Ref: {in: r.map((mr: MemberRequest) => mr.UserRef)}})).map(
                    (u: Partial<UserInclude>): [string, Partial<UserInclude>] => [u.Ref, u]
                )
            );

            memberRequestUI = r.map((mr: MemberRequest) => {
                const newMemberRequest = super.fromDbModel<IMemberRequest>(mr);
                if (users.has(mr.CreatedBy)) {
                    newMemberRequest.invitedBy =
                        users.get(mr.CreatedBy).Profile[0].FirstName +
                        " " +
                        users.get(mr.CreatedBy).Profile[0].LastName;
                }
                return newMemberRequest;
            });
        }

        return new ApiResponse(Status.OK, memberRequestUI);
    }

    /**
     * Update connection
     *
     * @param {IUserIdentity} requestUser Request user info
     * @param {number} requestId Info Id
     * @param {Partial<IMemberRequest>} memberRequestData new Info data
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Info data
     */
    async updateMemberRequest(
        requestUser: IUserIdentity,
        requestId: number,
        memberRequestData: Partial<IMemberRequest>
    ): Promise<IApiResponse<IMemberRequest>> {
        // validate
        if (requestId > 0 && Validator.isMemberRequestValid(memberRequestData, true)) {
            const currentRequest: MemberRequest = await this.memberRequestService.single({Id: requestId});

            if (currentRequest) {
                if (memberRequestData.status && memberRequestData.status !== currentRequest.Status) {
                    switch (memberRequestData.status) {
                        case RecordStatus.Active:
                            const topic = await this.topicService.topicDetails(currentRequest.TopicRef);

                            const channel: IChannelData = {
                                channelId: topic.Channel.Ref,
                                members: [currentRequest.UserRef],
                                createdById: requestUser.ref
                            };

                            const rMembers = await this.channelService.addMembers(topic.Channel.Id, channel);

                            if (!rMembers) {
                                throw new ApiError(Status.Conflict, Message.Failure);
                            }

                            memberRequestData.approvedByRef = requestUser.ref;
                            break;
                        case RecordStatus.Archived:
                            break;
                    }
                }

                const updateInfo = super.toDbModel<MemberRequest>(memberRequestData);

                //Set the audit
                updateInfo.ModifiedOn = UtcDate.now();
                updateInfo.ModifiedBy = Hasher.guid();
                const r: MemberRequest = await this.memberRequestService.update(requestId, updateInfo);

                const data = super.fromDbModel<IMemberRequest>(r);
                return new ApiResponse(Status.OK, data);
            }

            throw new ApiError(Status.BadRequest, Message.InvalidData);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create Channel method implementation
     *
     * @param {IChannelData} channelData Stream channel information
     * @param {string[]} members Ref Members list of Channel
     * @param {string[]} moderators Ref Moderators list of Channel
     * @returns {Promise<IApiResponse<IChannelAPIResponse>>} promise of type IApiResponse of type IChannelAPIResponse
     */
    private async createChannel(
        channelData: IChannelData,
        members: string[],
        moderators: string[]
    ): Promise<IChannelAPIResponse> {
        //get the channel members
        const channelMembers = members.length > 0 ? await this.channelService.getChannelMembersByRefs(members) : [];
        //check if the users exist in the database
        if (channelMembers.length != members.length) {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }

        //Create the channel.
        const rChannel = await this.channelService.createChannel(CustomChannelType.Topic, channelData, channelMembers);
        //Check if the channel was created successfully
        if (rChannel?.channelId !== undefined) {
            try {
                //Set the channel data
                channelData.channelId = rChannel.channel.id;
                channelData.channelRef = rChannel.channelRef;
                channelData.members = moderators;

                await this.topicService.addModerators(rChannel.channelId, channelData);

                channelData.members = members;

                if (members.length == 0) {
                    return rChannel;
                }

                //Add the channel members
                const rMembers = await this.channelService.addMembers(rChannel.channelId, channelData);
                //Check if the members were added successfully
                if (rMembers) {
                    //Send the response to UI
                    return rChannel;
                } else {
                    /* istanbul ignore next */
                    //Delete the channel in stream and database
                    await this.channelService.deleteChannel(rChannel.channelId, true);

                    /* istanbul ignore next */
                    //Throw the exception
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            } catch (ex) {
                //Delete the channel in stream and database
                await this.channelService.deleteChannel(rChannel.channelId, true);
                //Throw the exception
                throw new ApiError(Status.Conflict, ex.message);
            }
        }
    }
}

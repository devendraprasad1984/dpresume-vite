import {delay, inject, injectable} from "tsyringe";

import {Hasher, UtcDate} from "fnpm/utils";
import {Message, Status} from "fnpm/enums";
import {ChannelType} from "fnpm/chat/stream/enum";
import {IChannelAPIResponse} from "fnpm/chat/stream/models";
import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";

import {ModelMapper} from "ms-npm/model-mapper";
import {IMemberRequest} from "ms-npm/user-models";
import {CustomChannelType, IChannelMember} from "ms-npm/message-models";
import {MemberRequestFilter} from "ms-npm/routes/user";
import {IUserIdentity, Role} from "ms-npm/auth-models";

import {GroupMember, MemberRequest, Personnel, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {CompanyInclude, UserInclude} from "../db.includes";
import {Validator} from "../validator";
import {UserService} from "../service/user.service";
import {ConnectionService} from "../service/connection.service";
import {ChannelService} from "../service/channel.service";
import {GroupMemberService} from "../service/group-member.service";
import {PersonnelService} from "../service/personnel.service";
import {CompanyService} from "../service/company.service";

/**
 * Chat Controller declarations
 */
interface IConnectionController {
    /**
     * Get user invites by id declaration
     */
    filter(type: MemberRequestFilter, filter?: IWhereFilter<MemberRequest>): Promise<IApiResponse<IMemberRequest[]>>;

    /**
     * Update Member request declaration
     *
     * @param {number} requestId Info Id
     * @param {Partial<IMemberRequest>} memberRequestData new Info data
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Info data
     */
    update(
        user: IUserIdentity,
        requestId: number,
        memberRequestData: Partial<IMemberRequest>
    ): Promise<IApiResponse<IMemberRequest>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class ConnectionController extends ModelMapper implements IConnectionController {
    /**
     * User Controller constructor
     *
     * @param {UserService} userService database service dependency
     * @param {ConnectionService} connectionService database service dependency
     * @param {ChannelService} channelService database service dependency
     * @param {GroupMemberService} groupMemberService database service dependency
     * @param {PersonnelService} personnelService database service dependency
     * @param {CompanyService} companyService database service dependency
     */
    constructor(
        @inject(delay(() => UserService)) private userService: UserService,
        @inject(delay(() => ConnectionService)) private connectionService: ConnectionService,
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => GroupMemberService)) private groupMemberService: GroupMemberService,
        @inject(delay(() => PersonnelService)) private personnelService: PersonnelService,
        @inject(delay(() => CompanyService)) private companyService: CompanyService
    ) {
        super();
    }

    // methods
    /**
     * Returns connections info
     *
     * @param {MemberRequestFilter} type Filter used for query
     * @param {IWhereFilter<MemberRequest>} filter Filter query
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Member Request data
     */
    async filter(
        type: MemberRequestFilter,
        filter?: IWhereFilter<MemberRequest>
    ): Promise<IApiResponse<IMemberRequest[]>> {
        switch (type) {
            case MemberRequestFilter.getRequestByCompany:
                if (!Hasher.isGuid(<string>filter.CompanyRef)) {
                    throw new ApiError(Status.BadRequest, Message.InvalidData);
                }
                break;
            default:
        }
        const r = await this.connectionService.filter(filter);

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
    async update(
        requestUser: IUserIdentity,
        requestId: number,
        memberRequestData: Partial<IMemberRequest>
    ): Promise<IApiResponse<IMemberRequest>> {
        // validate
        if (requestId > 0 && Validator.isMemberRequestValid(memberRequestData, true)) {
            const currentRequest: MemberRequest = await this.connectionService.single({Id: requestId});

            if (currentRequest) {
                if (memberRequestData.status && memberRequestData.status !== currentRequest.Status) {
                    switch (memberRequestData.status) {
                        case RecordStatus.Active:
                            const userToken = requestUser.ref;
                            const user: UserInclude = await this.userService.single(
                                {Ref: currentRequest.UserRef},
                                {
                                    Id: true,
                                    Ref: true,
                                    [Prisma.ModelName.Profile]: {
                                        select: {
                                            FirstName: true,
                                            LastName: true
                                        }
                                    }
                                }
                            );

                            const groupMember: GroupMember[] = await this.groupMemberService.filter({
                                CompanyRef: currentRequest.CompanyRef,
                                IsDefault: true
                            });

                            const groupName = `${groupMember[0].Name}, ${user.Profile[0].FirstName} ${user.Profile[0].LastName}`;

                            const members: IChannelMember[] = [
                                {
                                    name: groupMember[0].Name,
                                    ref: groupMember[0].Ref,
                                    id: 0
                                },
                                {
                                    name: user.Profile[0].FirstName + " " + user.Profile[0].LastName,
                                    ref: user.Ref,
                                    id: user.Id
                                }
                            ];

                            const channel = await this.create(
                                ChannelType.Team,
                                groupMember[0].Ref,
                                members,
                                currentRequest.CompanyRef,
                                groupName,
                                memberRequestData.message ?? currentRequest.Message
                            );

                            if (channel != undefined) {
                                let company: CompanyInclude = <CompanyInclude>{};
                                company = await this.companyService.single({Ref: currentRequest.CompanyRef});
                                const personnel: Personnel = {
                                    Role: Role.User,
                                    Status: RecordStatus.Active,
                                    UserId: user.Id,
                                    CompanyId: company.Id,
                                    CreatedBy: userToken,
                                    CreatedOn: UtcDate.now(),
                                    Id: 0,
                                    ModifiedBy: undefined,
                                    ModifiedOn: undefined
                                };
                                await this.personnelService.create([personnel]);
                            } else {
                                throw new ApiError(Status.BadRequest, Message.InvalidData);
                            }

                            memberRequestData.approvedByRef = userToken;
                            break;
                        case RecordStatus.Archived:
                            break;
                    }
                }

                const updateInfo = super.toDbModel<MemberRequest>(memberRequestData);

                //Set the audit
                updateInfo.ModifiedOn = UtcDate.now();
                updateInfo.ModifiedBy = Hasher.guid();
                const r: MemberRequest = await this.connectionService.update(requestId, updateInfo);

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
     * @param {ChannelType} type Channel Stream Api Type
     * @param {string} createdById user who creates the channel
     * @param {IChannelMember[]} members Members of Channel
     * @param {string} companyRef Company identifier
     * @param {string?} name Name of Channel
     * @param {string?} inviteMessage message text to invite
     * @returns {Promise<IApiResponse<IChannelAPIResponse>>} promise of type IApiResponse of type IChannelAPIResponse
     */
    async create(
        type: ChannelType,
        createdById: string,
        members: (IChannelMember & { id: number })[],
        companyRef: string,
        name?: string,
        inviteMessage?: string
    ): Promise<IApiResponse<IChannelAPIResponse>> {
        //Generate channelId for Stream
        const streamChannelId = Hasher.guid();

        //Create the channel.
        const rChannel = await this.channelService.createChannel(
            type,
            name,
            createdById,
            CustomChannelType.OneToCompany,
            companyRef,
            streamChannelId
        );
        //Check if the channel was created successfully
        if (rChannel?.channelId !== undefined) {
            try {
                //Generate the list of stream members
                const streamMembers: { ref: string; id: number }[] = [];
                members.forEach((m: IChannelMember & { id: number }) => streamMembers.push({ref: m.ref, id: m.id}));
                //Add the channel members
                const rMembers = await this.channelService.addMembers(
                    rChannel.channelId,
                    streamMembers,
                    rChannel.channelRef,
                    rChannel.channel.id,
                    inviteMessage
                );
                //Check if the members were added successfully
                if (rMembers) {
                    //Send the response to UI
                    return new ApiResponse(Status.OK, rChannel);
                } else {
                    /* istanbul ignore next */
                    //Delete the channel in stream and database
                    this.delete(rChannel.channelId, true);

                    /* istanbul ignore next */
                    //Throw the exception
                    throw new ApiError(Status.Conflict, Message.Failure);
                }
            } catch (ex) {
                //Delete the channel in stream and database
                this.delete(rChannel.channelId, true);
                //Throw the exception
                throw new ApiError(Status.Conflict, ex.message);
            }
        }
    }

    /**
     * Delete a specific channel
     *
     * @param {number} id Channel Id from database
     * @param {boolean} isHard is Hard delete
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        // validate
        /* istanbul ignore next */
        if (id > 0) {
            const r: boolean = await this.channelService.deleteChannel(id, isHard);
            if (r) {
                return new ApiResponse(Status.OK, r);
            } else {
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            /* istanbul ignore next */
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

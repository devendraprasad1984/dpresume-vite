import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {Checker} from "fnpm/validators";
import {Hasher, UtcDate} from "fnpm/utils";

import {ModelMapper} from "ms-npm/model-mapper";
import {IMemberRequest} from "ms-npm/user-models";

import {Channel, MemberRequest, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {UserService} from "../service/user.service";
import {MemberRequestService} from "../service/member-request.service";
import {ChatService} from "../service/chat.service";
import {UserInclude} from "../db.includes";
import {Validator} from "../validator";

/**
 * Chat Controller declarations
 */
interface IInviteController {
    /**
     * Create Member request declaration
     */
    create(memberRequestData: IMemberRequest): Promise<IApiResponse<IMemberRequest>>;

    /**
     * Get user invites by id declaration
     */
    filterInvites(filter?: IWhereFilter<MemberRequest>): Promise<IApiResponse<IMemberRequest[]>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class InviteController extends ModelMapper implements IInviteController {
    /**
     * User Controller constructor
     *
     * @param {memberRequestService} memberRequestService database service dependency
     * @param {UserService} userService database service dependency
     * @param {ChatService} chatService database service dependency
     */
    constructor(
        @inject(delay(() => MemberRequestService)) private memberRequestService: MemberRequestService,
        @inject(delay(() => UserService)) private userService: UserService,
        @inject(delay(() => ChatService)) private chatService: ChatService
    ) {
        super();
    }

    /**
     * Create Profile method implementation
     *
     * @param {IMemberRequest} memberRequestData Member request data
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type APIResponse
     */
    async create(memberRequestData: IMemberRequest): Promise<IApiResponse<IMemberRequest>> {
        // validate
        if (Validator.isMemberRequestValid(memberRequestData)) {
            //map the data to create the new profile
            const newRequest = super.toDbModel<MemberRequest>(memberRequestData);
            newRequest.Status = RecordStatus.Pending;
            //Set the new ref and audit
            newRequest.CreatedOn = UtcDate.now();
            newRequest.CreatedBy = Hasher.guid();
            const r: MemberRequest = await this.memberRequestService.create(newRequest);

            if (r.Id) {
                memberRequestData = super.fromDbModel(r);
                return new ApiResponse(Status.OK, memberRequestData);
            } else {
                // no profile, no id
                throw new ApiError(Status.Conflict, Message.Conflict);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    // methods
    /**
     * Returns invites
     *
     * @param {IWhereFilter<MemberRequest>} filter Filter query
     * @returns {Promise<IApiResponse<IMemberRequest>>} promise of type IApiResponse of type Profile data
     */
    async filterInvites(filter?: IWhereFilter<MemberRequest>): Promise<IApiResponse<IMemberRequest[]>> {
        if (Checker.isStringValid(36, 36, filter.UserRef as string)) {
            filter.Status = RecordStatus.Pending;
            filter.CompanyRef = null;
            const r = await this.memberRequestService.filter(filter);

            let memberRequestUI: IMemberRequest[] = [];

            if (r && r.length > 0) {
                //create map of user information
                const users: Map<string, Partial<UserInclude>> = new Map(
                    (
                        await this.userService.filter(
                            {
                                Ref: {in: r.map((mr: MemberRequest) => mr.CreatedBy)},
                                NOT: {CreatedBy: filter.UserRef}
                            },
                            undefined,
                            undefined,
                            undefined,
                            {
                                Ref: true,
                                [Prisma.ModelName.Profile]: {select: {FirstName: true, LastName: true}}
                            }
                        )
                    ).map((u: Partial<UserInclude>): [string, Partial<UserInclude>] => [u.Ref, u])
                );

                //create map of channels
                const channels: Map<string, Partial<Channel>> = new Map(
                    (await this.chatService.filter({Ref: {in: r.map((mr: MemberRequest) => mr.ChannelRef)}})).map(
                        (c: Partial<Channel>): [string, Partial<Channel>] => [c.Ref, c]
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

                    if (channels.has(mr.ChannelRef)) {
                        newMemberRequest.eventName = channels.get(mr.ChannelRef).GroupName;
                    }

                    return newMemberRequest;
                });
            }

            return new ApiResponse(Status.OK, memberRequestUI);
        }
        throw new ApiError(Status.Conflict, Message.InvalidData);
    }
}

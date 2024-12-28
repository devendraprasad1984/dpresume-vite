import {delay, inject, injectable} from "tsyringe";

import {ApiError, ApiResponse, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {UtcDate, Hasher} from "fnpm/utils";
import {IPersonnel, IPersonnelSearch} from "ms-npm/company-models";

import {Role} from "ms-npm/auth-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {IWhereFilter, IModelSelect} from "/opt/nodejs/node14/db/models";
import {GroupMember, Personnel, Prisma} from "/opt/nodejs/node14/db/client-mysql";

import {MemberInclude, PersonnelInclude} from "../db.includes";
import {PersonnelMapper} from "../mapper/personnel-mapper";
import {Validator} from "../validator";
import {PersonnelService} from "../service/personnel.service";
import {ChannelService} from "../service/channel.service";
import {GroupMemberService} from "../service/group-member.service";
import {CompanyService} from "../service/company.service";
import {MemberService} from "../service/member.service";

/**
 * Personnel Controller declarations
 */
interface IPersonnelController {
    /**
     * Get company personnel array
     */
    filter(
        filter: IWhereFilter<Personnel>,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<IPersonnelSearch[]>>>;

    /**
     * create a personnel
     */
    create(personnel: IPersonnel[]): Promise<IApiResponse<boolean>>;

    /**
     * Update a specific personnel
     */
    update(id: number, personnel: Partial<IPersonnel>): Promise<IApiResponse<IPersonnel>>;

    /**
     * Delete a specific personnel
     */
    delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * Info Controller implementation
 */
@injectable()
export class PersonnelController extends PersonnelMapper implements IPersonnelController {
    /**
     * Info Controller constructor
     *
     * @param {PersonnelService} personnelService personnel database service dependency
     * @param {ChannelService} channelService channel database service dependency
     * @param {GroupMemberService} groupMemberService groupMember database service dependency
     * @param {CompanyService} companyService company database service dependency
     * @param {MemberService} memberService member database service dependency
     */
    constructor(
        @inject(delay(() => PersonnelService)) private personnelService: PersonnelService,
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => GroupMemberService)) private groupMemberService: GroupMemberService,
        @inject(delay(() => CompanyService)) private companyService: CompanyService,
        @inject(delay(() => MemberService)) private memberService: MemberService
    ) {
        super();
    }

    /**
     * Returns array of company personnel
     *
     * @param {IWhereFilter<Personnel>} filter filter information
     * @param {IPaginationRequest} pagination pagination request info
     * @returns {Promise<IApiResponse<IPersonnelSearch[]>>} promise of type IApiResponse of type Personnel data
     */
    async filter(
        filter: IWhereFilter<Personnel>,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<IPersonnelSearch[]>>> {
        if (filter.CompanyId > 0 || filter.Id > 0) {
            const select: IModelSelect = {
                Id: true,
                Status: true,
                CompanyId: true,
                Role: true,
                User: {
                    select: {
                        Id: true,
                        Ref: true,
                        Role: true,
                        Sub: true,
                        LastLogin: true,
                        Status: true,
                        Note: true,
                        Profile: {
                            select: {
                                Email: true,
                                FirstName: true,
                                LastName: true,
                                Pronouns: true,
                                Headline: true,
                                CompanyHeadline: true,
                                Picture: true
                            }
                        }
                    }
                }
            };

            const r: IPaginationResponse<PersonnelInclude[]> = await this.personnelService.retrievePaginated(
                filter,
                undefined,
                select,
                pagination
            );

            let response: IPersonnelSearch[] = [];

            if (r?.data && r.data.length > 0) {
                response = r.data.map((i: PersonnelInclude) => super.fromDbPersonnelSearchModel(i));
            }

            const paginationResult: IPaginationResponse<IPersonnelSearch[]> = {
                currentPage: r.currentPage,
                lastPage: r.lastPage,
                totalCount: r.totalCount,
                data: response
            };

            return new ApiResponse(Status.OK, paginationResult);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create Personnel method implementation
     *
     * @param {IPersonnel[]} personnel profile data
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type boolean
     */
    async create(personnel: IPersonnel[]): Promise<IApiResponse<boolean>> {
        // validate incoming data
        if (Validator.isCreatePersonnelValid(personnel)) {
            //create the array of DB Personnel
            const dbPersonnel: Personnel[] = [];
            personnel.forEach((p: IPersonnel) => {
                //map the data to create the new db personnel
                const newPersonnel = super.toDbModel<Personnel>(p);
                newPersonnel.CreatedOn = UtcDate.now();
                newPersonnel.CreatedBy = Hasher.guid();
                newPersonnel.Status = RecordStatus.Active;
                dbPersonnel.push(newPersonnel);
            });
            //call the service
            const r = await this.personnelService.create(dbPersonnel);
            //validate the service response
            if (r > 0) {
                return new ApiResponse(Status.OK, true);
            } else {
                // a conflict adding personnel to db
                throw new ApiError(Status.Conflict, Message.Conflict);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Update a specific personnel
     *
     * @param {number} id personnel id
     * @param {Partial<IPersonnel>} personnel new Role
     * @returns {Promise<IApiResponse<IPersonnel>>} promise of type IApiResponse of type IPersonnel
     */
    async update(id: number, personnel: Partial<IPersonnel>): Promise<IApiResponse<IPersonnel>> {
        if (id > 0 && (personnel.role == undefined || Object.values(Role).includes(personnel.role))) {
            const updatePersonnel: Personnel = {
                Id: id,
                Role: personnel.role,
                ModifiedOn: UtcDate.now(),
                ModifiedBy: Hasher.guid(),
                UserId: undefined,
                CompanyId: undefined,
                Status: personnel.status,
                CreatedOn: undefined,
                CreatedBy: undefined
            };

            const currentPersonnel = (
                await this.personnelService.filter({Id: id}, undefined, undefined, undefined, {
                    Role: true,
                    CompanyId: true,
                    UserId: true,
                    [Prisma.ModelName.User]: {select: {Ref: true}}
                })
            )[0];
            let isChannelFrozen = true;

            if (personnel.status && currentPersonnel.Role == Role.User) {
                const company = await this.companyService.single({Id: currentPersonnel.CompanyId}, {Ref: true});
                const groupMember: GroupMember = (
                    await this.groupMemberService.filter({
                        CompanyRef: company.Ref,
                        IsDefault: true
                    })
                )[0];

                const member: MemberInclude = (
                    await this.memberService.filter(
                        {
                            UserId: currentPersonnel.UserId,
                            GroupMemberRef: groupMember.Ref
                        },
                        undefined,
                        undefined,
                        undefined,
                        {
                            ChannelId: true,
                            [Prisma.ModelName.Channel]: true
                        }
                    )
                )[0];

                if (member) {
                    switch (personnel.status) {
                        case RecordStatus.Archived:
                            //Freeze channel
                            isChannelFrozen = await this.channelService.updateChannel(
                                {channelId: member.Channel.StreamRef, frozen: true, text: "Connection disabled"},
                                member.ChannelId
                            );

                            if (isChannelFrozen) {
                                await this.memberService.update(member.Id, {Status: RecordStatus.Archived});
                            } else {
                                throw new ApiError(Status.Conflict, Message.Conflict);
                            }
                            break;
                        case RecordStatus.Active:
                            //Unfreeze channel
                            isChannelFrozen = await this.channelService.updateChannel(
                                {channelId: member.Channel.StreamRef, frozen: false},
                                member.ChannelId
                            );

                            if (isChannelFrozen) {
                                await this.memberService.update(member.Id, {Status: RecordStatus.Active});
                            } else {
                                throw new ApiError(Status.Conflict, Message.Conflict);
                            }
                            break;
                    }
                }
            }

            if (isChannelFrozen) {
                //Send the update to the database
                const r = await this.personnelService.update(id, updatePersonnel);

                //Check the result
                if (r) {
                    const data = super.fromDbModel<IPersonnel>(r);
                    return new ApiResponse(Status.OK, data);
                } else {
                    // a conflict updating personnel to db
                    throw new ApiError(Status.Conflict, Message.Conflict);
                }
            } else {
                throw new ApiError(Status.Conflict, Message.Conflict);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete a specific personnel
     *
     * @param {number} id personnel Id
     * @param {boolean} isHard Is Hard delete
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type Info data
     */
    async delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        // validate
        if (id > 0) {
            const r: boolean = await this.personnelService.delete(id, isHard);
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

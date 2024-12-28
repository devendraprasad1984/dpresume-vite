import {delay, inject, injectable} from "tsyringe";

import {ApiResponse, ApiError, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Hasher, StringFormatter, UtcDate} from "fnpm/utils";
import {ChannelType} from "fnpm/chat/stream/enum";

import {ICompany} from "ms-npm/admin-models";
import {IUserIdentity, Role} from "ms-npm/auth-models";
import {State} from "ms-npm/base-models";
import {IInfo} from "ms-npm/company-models";
import {CustomChannelType} from "ms-npm/message-models";

import {RecordStatus, SortOrder} from "/opt/nodejs/node14/db/enums";
import {Prisma, Company, Info, Personnel, GroupMember} from "/opt/nodejs/node14/db/client-mysql";

import {CompanyService} from "../service/company.service";
import {ChannelService} from "../service/channel.service";
import {GroupMemberService} from "../service/group-member.service";
import {Validator} from "../validator";
import {CompanyInclude} from "../db.includes";
import {AdminMapper} from "../mapper/admin-mapper";
import {User} from "stream-chat";

/**
 * Company controller declarations
 */
interface ICompanyController {
    /**
     * Get all companies
     */
    getCompanies(pagination: IPaginationRequest): Promise<IApiResponse<IPaginationResponse<ICompany[]>>>;

    /**
     * Create company declaration
     *
     * @param {IUserIdentity} user user object
     * @param {ICompany} company company ui model
     * @returns {IInfo} info response
     */
    createCompany(user: IUserIdentity, company: ICompany): Promise<IApiResponse<IInfo>>;
}

/**
 * Company controller
 */
@injectable()
export class CompanyController extends AdminMapper implements ICompanyController {
    /**
     * Company Controller Constructor
     *
     * @param {CompanyService} companyService company service dependency
     * @param {ChannelService} channelService channel service dependency
     * @param {GroupMemberService} groupMemberService group member service dependency
     */
    constructor(
        @inject(delay(() => CompanyService)) private companyService: CompanyService,
        @inject(delay(() => ChannelService)) private channelService: ChannelService,
        @inject(delay(() => GroupMemberService)) private groupMemberService: GroupMemberService
    ) {
        super();
    }

    //methods
    /**
     *
     * Return the list of companies
     *
     * @param {IPaginationRequest} pagination pagination information
     * @returns {Promise<IApiResponse<ICompany[]>>} List of companies
     */
    async getCompanies(pagination: IPaginationRequest): Promise<IApiResponse<IPaginationResponse<ICompany[]>>> {
        // Select query to company
        const selectProfile = {select: {Id: true, FirstName: true, LastName: true, Email: true}};
        const selectPersonnel = {
            Id: true,
            Role: true,
            UserId: true,
            [Prisma.ModelName.User]: {select: {[Prisma.ModelName.Profile]: selectProfile}}
        };
        const selectCompany = {
            Id: true,
            Status: true,
            [Prisma.ModelName.Info]: {select: {Id: true, Category: true, Name: true}},
            [Prisma.ModelName.Personnel]: {select: selectPersonnel}
        };

        //Set the order by
        const orderBy = {Id: SortOrder.Asc};

        const r: IPaginationResponse<CompanyInclude[]> = await this.companyService.filter(
            {},
            orderBy,
            selectCompany,
            pagination
        );
        const companiesDataList: ICompany[] = [];

        //Convert the list
        r.data.forEach((info: CompanyInclude) => {
            companiesDataList.push(super.fromDBToCompany(info));
        });

        const paginationResult: IPaginationResponse<ICompany[]> = {
            currentPage: r.currentPage,
            lastPage: r.lastPage,
            totalCount: r.totalCount,
            data: companiesDataList
        };

        //return the list
        return new ApiResponse(Status.OK, paginationResult);
    }

    /**
     * Create company declaration
     *
     * @param {IUserIdentity} user user object
     * @param {ICompany} company company ui model
     * @returns {IInfo} info response
     */
    async createCompany(user: IUserIdentity, company: ICompany): Promise<IApiResponse<IInfo>> {
        if (Validator.isCompanyDataValid(company)) {
            //map the company
            const companyDB = super.toDbCompany(user);
            //Add company
            const r: Company = await this.companyService.createCompany(companyDB);
            const companyId: number = r.Id;
            //map the personnel
            const personnelDB: Personnel = super.toDbPersonnel(user, company.admin.userId, companyId, Role.Admin);
            //Add Personnel admin
            await this.companyService.createPersonnel(personnelDB);
            //map the info
            //This is necessary to un-map admin.userId when Info is added.
            company.admin = undefined;
            const infoDB: Info = super.toDbModel<Info>(company.info);
            infoDB.Status = RecordStatus.Active;
            infoDB.CompanyId = companyId;
            infoDB.CreatedBy = user.ref;
            infoDB.CreatedOn = UtcDate.now();
            infoDB.State =
                company.info.state != undefined
                    ? Object.keys(State)[Object.values(State).indexOf(<State>company.info.state)].replace(/_/g, " ")
                    : undefined;
            infoDB.City =
                company.info.city !== undefined ? StringFormatter.capitalizeSentence(company.info.city) : undefined;
            //Add Company Info
            const info: Info = await this.companyService.createInfo(infoDB);

            //Add Group Member
            const gm: GroupMember = {
                Id: 0,
                Ref: Hasher.guid(),
                CompanyRef: r.Ref,
                Status: RecordStatus.Active,
                Role: {roles: [Role.Admin]},
                Name: infoDB.Name,
                IsDefault: true,
                CreatedBy: user.ref,
                CreatedOn: UtcDate.now(),
                ModifiedBy: undefined,
                ModifiedOn: undefined
            };

            const rGM: GroupMember = await this.groupMemberService.create(gm);

            const rGroup: boolean = await this.createMSCompanyChannel(rGM);
            if (rGroup) {
                return new ApiResponse(Status.OK, super.fromDbModel(info));
            } else {
                throw new ApiError(Status.Conflict, Message.Conflict);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create MS:Company Channel
     *
     * @param {GroupMember} rGM Group member object
     * @returns {boolean} true / false create channel
     */
    private async createMSCompanyChannel(rGM: GroupMember): Promise<boolean> {
        //Generate channelId for Stream
        const streamChannelId = Hasher.guid();

        //Get MS Users (MSA, MSC Roles) from GroupMember
        const groupMember: GroupMember[] = await this.groupMemberService.filter({
            CompanyRef: null,
            IsDefault: true
        });

        const streamUsers: User[] = [];

        streamUsers.push({id: rGM.Ref, name: rGM.Name, role: Role.User.toLowerCase()});
        streamUsers.push({id: groupMember[0].Ref, name: groupMember[0].Name, role: Role.User.toLocaleLowerCase()});

        const rUser: boolean = await this.channelService.registerStreamUser(streamUsers);

        if (!rUser) {
            return false;
        }

        //Create the channel.
        const rChannel = await this.channelService.createChannel(
            ChannelType.Team,
            rGM.Name,
            rGM.Ref,
            CustomChannelType.MSToCompany,
            rGM.CompanyRef,
            streamChannelId
        );

        //Check if the channel was created successfully
        if (rChannel?.channelId !== undefined) {
            //Create array of members
            const members: { ref: string; id: number }[] = [
                {
                    ref: groupMember[0].Ref,
                    id: 0
                },
                {
                    ref: rGM.Ref,
                    id: rGM.Id
                }
            ];

            //Add the channel members
            const rMembers = await this.channelService.addMembers(
                rChannel.channelId,
                members,
                rChannel.channelRef,
                rChannel.channel.id,
                `Welcome to MS:${rGM.Name} channel` //TODO Define default invite message
            );
            //Check if the members were added successfully
            if (rMembers) {
                //Send the response to UI
                return true;
            } else {
                /* istanbul ignore next */
                //Delete the channel in stream and database
                await this.channelService.deleteChannel(rChannel.channelId, true);
                return false;
            }
        } else {
            return false;
        }
    }
}

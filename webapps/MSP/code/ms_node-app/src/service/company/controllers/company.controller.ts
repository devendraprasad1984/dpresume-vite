import {delay, inject, injectable} from "tsyringe";
import {ApiResponse, ApiError, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Checker} from "fnpm/validators";
import {ICompanyQuery, ICompanySearch} from "ms-npm/search-models";
import {CompanyFilter} from "ms-npm/routes/company";
import {IModelSelect, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {CompanyService} from "../service/company.service";
import {CompanyInclude, PersonnelInclude} from "../db.includes";
import {CompanyMapper} from "../mapper/company-mapper";
import {PersonnelService} from "../service/personnel.service";

/**
 * Company Controller declarations
 */
interface ICompanyController {
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;

    /**
     * Filter method
     *
     * @returns {Promise<IApiResponse<IPaginationResponse<ICompanySearch[]>>>}
     */
    filter(
        companyFilter: CompanyFilter,
        query: ICompanyQuery,
        userId: number,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<ICompanySearch[]>>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class CompanyController extends CompanyMapper implements ICompanyController {
    /**
     * Company Controller constructor
     *
     * @param {CompanyService} companyService company database service dependency
     * @param {PersonnelService} personnelService personnel database service dependency
     */
    constructor(
        @inject(delay(() => CompanyService)) private companyService: CompanyService,
        @inject(delay(() => PersonnelService)) private personnelService: PersonnelService
    ) {
        super();
    }

    // methods
    /**
     * Ping method implementation
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        try {
            return new ApiResponse(Status.OK, "company - pong");
        } catch (ex) {
            /* istanbul ignore next */
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Returns array of company info
     *
     * @param {CompanyFilter} companyFilter Company filter type
     * @param {ICompanyQuery} query Company query parameters
     * @param {number} userId Current user id
     * @param {IPaginationRequest} pagination Pagination request info
     * @returns {Promise<IApiResponse<IPaginationResponse<ICompanySearch[]>>>} promise of type IApiResponse of type Info data
     */
    async filter(
        companyFilter: CompanyFilter,
        query: ICompanyQuery,
        userId: number,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<ICompanySearch[]>>> {
        const filter: IWhereFilter<Prisma.CompanyWhereInput> = {};
        const searchFilter: Prisma.CompanyWhereInput[] = [];

        searchFilter.push({Status: RecordStatus.Active});

        let isQueryValid: boolean = true;

        const select: IModelSelect = {
            Id: true,
            Ref: true,
            Info: {
                select: {
                    Id: true,
                    Name: true,
                    Category: true,
                    State: true,
                    City: true,
                    Photo: true
                }
            },
            _count: {select: {Personnel: true}}
        };

        switch (companyFilter) {
            case CompanyFilter.explore:
                if (!Checker.isNullOrEmpty(query.keyword)) {
                    filter.OR = [
                        {Info: {some: {Name: {contains: query.keyword}}}},
                        {Info: {some: {State: {contains: query.keyword}}}},
                        {Info: {some: {City: {contains: query.keyword}}}},
                        {Info: {some: {Category: {contains: query.keyword}}}}
                    ];
                }

                if (query.location && query.location.length > 0) {
                    const locationFilter: Prisma.CompanyWhereInput[] = [];

                    query.location.forEach((l: string) => {
                        const data = l.split("-");

                        locationFilter.push({Info: {some: {State: data[0].trim(), City: data[1].trim()}}});
                    });

                    searchFilter.push({OR: locationFilter});
                }

                if (query.industry && query.industry.length > 0) {
                    searchFilter.push({Info: {some: {Category: {in: query.industry}}}});
                }
                if (query.hasOpenJobs != undefined) {
                    if (query.hasOpenJobs) {
                        searchFilter.push({Job: {some: {Id: {gt: 0}, Status: RecordStatus.Active}}});
                    } else {
                        searchFilter.push({Job: {none: {Id: {gt: 0}, Status: RecordStatus.Active}}});
                    }
                }
                filter.AND = searchFilter;

                break;
            default:
                isQueryValid = false;
        }

        if (isQueryValid) {
            const r: IPaginationResponse<CompanyInclude[]> = await this.companyService.retrievePaginated(
                filter,
                undefined,
                select,
                pagination
            );
            let rUI: ICompanySearch[] = [];
            let userConnections: PersonnelInclude[] = [];

            if (r?.data && r.data.length > 0) {
                userConnections = await this.personnelService.filter({
                    UserId: userId,
                    Status: RecordStatus.Active
                });
                rUI = r.data.map((i: CompanyInclude) => super.fromDbCompanySearchhModel(i, userConnections));
            }

            const paginationResult: IPaginationResponse<ICompanySearch[]> = {
                currentPage: r.currentPage,
                lastPage: r.lastPage,
                totalCount: r.totalCount,
                data: rUI
            };

            return new ApiResponse(Status.OK, paginationResult);
        }
        throw new ApiError(Status.BadRequest, Message.InvalidData);
    }
}

import {delay, inject, injectable} from "tsyringe";

import {ApiResponse, ApiError, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Any} from "fnpm/types";
import {LocationFilter} from "ms-npm/routes/user";
import {ILocationQuery} from "ms-npm/search-models";
import {ILocation} from "ms-npm/base-models";
import {SortOrder} from "/opt/nodejs/node14/db/enums";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {ProfileService} from "../service/profile.service";
import {ProfileInclude} from "../db.includes";
import {ProfileMapper} from "../mapper/profile-mapper";

/**
 * Location Controller declarations
 */
interface ILocationController {
    /**
     * Retrieve Location by filter
     *
     * @returns {IEducationHistory} return Location object
     */
    filter(
        filter: LocationFilter,
        data: ILocationQuery,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<ILocation[]>>>;

    /**
     * Retrieve complete location list
     */
    retrieve(): Promise<IApiResponse<ILocation[]>>;
}

/**
 * Location Controller implementation
 */
@injectable()
export class LocationController extends ProfileMapper implements ILocationController {
    /**
     * Location Controller constructor
     *
     * @param {EducationHistoryService} service Location service dependency
     */
    constructor(@inject(delay(() => ProfileService)) private service: ProfileService) {
        super();
    }

    //methods

    /**
     * Retrieve Location by profile id
     *
     * @returns {Promise<IApiResponse<ILocation[]>>} returns array of Location
     */
    async retrieve(): Promise<IApiResponse<ILocation[]>> {
        //Set the order by
        const orderBy = {State: SortOrder.Asc};

        const r: ProfileInclude[] = await this.service.filter({State: {not: null}}, orderBy);

        let location: ILocation[] = [];
        location = r.map((p: ProfileInclude) => super.fromDbLocationModel(p));

        return new ApiResponse(Status.OK, location);
    }

    /**
     * Retrieve Location by profile id
     *
     * @param {IWhereFilter<Profile>} filter location filter
     * @param {ILocationQuery} data request filter
     * @param {number} data.id location id
     * @param {string} data.keyword location filter keyword
     * @param {IPaginationRequest} pagination pagination information
     * @returns {Promise<IApiResponse<IPaginationResponse<ILocation[]>>>} returns array of Location
     */
    async filter(
        filter: LocationFilter,
        data: ILocationQuery,
        pagination: IPaginationRequest
    ): Promise<IApiResponse<IPaginationResponse<ILocation[]>>> {
        const queryFilter: IWhereFilter<Prisma.ProfileWhereInput> = {};
        queryFilter.AND = [];
        const distinct: Any[] = [];

        const select = {
            City: false,
            State: false
        };

        switch (filter) {
            case LocationFilter.getByKeyword:
                if (data.keywordCity === undefined && data.keywordState === undefined) {
                    throw new ApiError(Status.Conflict, Message.InvalidData);
                }
                if (data.keywordState !== undefined) {
                    if (data.keywordState.length > 0) {
                        queryFilter.AND.push({State: {contains: data.keywordState}});
                    }
                    select.State = true;
                    distinct.push(Prisma.ProfileScalarFieldEnum.State);
                }

                if (data.keywordCity !== undefined) {
                    if (data.keywordCity.length > 0) {
                        queryFilter.AND.push({City: {contains: data.keywordCity}});
                    }
                    select.City = true;
                    distinct.push(Prisma.ProfileScalarFieldEnum.City);
                }
                break;
            default:
                throw new ApiError(Status.NotImplemented, Message.InvalidData);
        }

        //Set the order by
        const orderBy = {Id: SortOrder.Asc};
        const r: IPaginationResponse<ProfileInclude[]> = await this.service.retrievePaginated(
            queryFilter,
            orderBy,
            select,
            pagination,
            distinct
        );

        let location: ILocation[] = [];
        location = r.data.map((l: ProfileInclude) => {
            const uiLocation = super.fromDbLocationModel(l);
            uiLocation.audit = undefined;
            return uiLocation;
        });

        const paginationResult: IPaginationResponse<ILocation[]> = {
            currentPage: r.currentPage,
            lastPage: r.lastPage,
            totalCount: r.totalCount,
            data: location
        };

        return new ApiResponse(Status.OK, paginationResult);
    }
}

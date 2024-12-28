import {delay, inject, injectable} from "tsyringe";

import {ApiError, ApiResponse, IApiResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {StringFormatter, UtcDate} from "fnpm/utils";

import {ModelMapper} from "ms-npm/model-mapper";
import {IInfo} from "ms-npm/company-models";
import {State} from "ms-npm/base-models";
import {IUserIdentity} from "ms-npm/auth-models";

import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {Info} from "/opt/nodejs/node14/db/client-mysql";

import {InfoService} from "../service/info.service";
import {Validator} from "../validator";

/**
 * Info Controller declarations
 */
interface IInfoController {
    /**
     * Get company info
     */
    single(id: number): Promise<IApiResponse<IInfo>>;

    /**
     * Get company info array
     */
    filter(filter: IWhereFilter<Info>): Promise<IApiResponse<IInfo[]>>;

    /**
     * Update a specific info
     */
    update(user: IUserIdentity, id: number, infoData: IInfo): Promise<IApiResponse<IInfo>>;

    /**
     * Delete a specific info
     */
    delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * Info Controller implementation
 */
@injectable()
export class InfoController extends ModelMapper implements IInfoController {
    /**
     * Info Controller constructor
     *
     * @param {InfoService} infoService info database service dependency
     */
    constructor(@inject(delay(() => InfoService)) private infoService: InfoService) {
        super();
    }

    /**
     * Returns a info for a specific company
     *
     * @param {number} id company info id
     * @returns {Promise<IApiResponse<InfoData>>} promise of type IApiResponse of type Info data
     */
    async single(id: number): Promise<IApiResponse<IInfo>> {
        // validate
        if (id > 0) {
            const r: Info = await this.infoService.single({Id: id});
            //r.State = State[r.State.replace(/\s/g, "_")];
            let response: IInfo = <IInfo>{};
            if (r) {
                response = super.fromDbModel<IInfo>(r);
            }
            return new ApiResponse(Status.OK, response);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Returns array of company info
     *
     * @param {IWhereFilter<Info>} filter filter information
     * @returns {Promise<IApiResponse<IInfo[]>>} promise of type IApiResponse of type Info data
     */
    async filter(filter: IWhereFilter<Info>): Promise<IApiResponse<IInfo[]>> {
        if (filter.CompanyId > 0) {
            const r: Info[] = await this.infoService.filter(filter);
            let response: IInfo[] = [];

            if (r && r.length > 0) {
                response = r.map((i: Info) => super.fromDbModel<IInfo>(i));
            }
            return new ApiResponse(Status.OK, response);
        }
        throw new ApiError(Status.BadRequest, Message.InvalidData);
    }

    /**
     * Update a specific info
     *
     * @param {IUserIdentity} user Request user info
     * @param {number} infoId Info Id
     * @param {IInfo} infoData new Info data
     * @returns {Promise<IApiResponse<IInfo>>} promise of type IApiResponse of type Info data
     */
    async update(user: IUserIdentity, infoId: number, infoData: Partial<IInfo>): Promise<IApiResponse<IInfo>> {
        // validate
        if (infoId > 0 && Validator.isInfoDataValid(infoData, true)) {
            const updateInfo = super.toDbModel<Info>(infoData);
            if (infoData.state) {
                infoData.state = Object.keys(State)[Object.values(State).indexOf(<State>infoData.state)].replace(
                    /_/g,
                    " "
                );
            }

            if (infoData.city) {
                infoData.city = StringFormatter.capitalizeSentence(infoData.city);
            }

            //Set the audit
            updateInfo.ModifiedOn = UtcDate.now();
            updateInfo.ModifiedBy = user.ref;
            const r: Info = await this.infoService.update(infoId, updateInfo);

            const data = super.fromDbModel<IInfo>(r);
            return new ApiResponse(Status.OK, data);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete a specific info
     *
     * @param {number} id Info Id
     * @param {boolean} isHard Is Hard delete
     * @returns {Promise<IApiResponse<boolean>>} promise of type IApiResponse of type Info data
     */
    async delete(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        // validate
        if (id > 0) {
            const r: boolean = await this.infoService.delete(id, isHard);
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

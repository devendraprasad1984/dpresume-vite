import {delay, inject, injectable} from "tsyringe";

import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Hasher, UtcDate} from "fnpm/utils";

import {IWorkHistory} from "ms-npm/profile-models";
import {IUserIdentity} from "ms-npm/auth-models";
import {ModelMapper} from "ms-npm/model-mapper";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {WorkHistory} from "/opt/nodejs/node14/db/client-mysql";

import {WorkHistoryService} from "../service/work-history.service";
import {Validator} from "../validator";

/**
 * WorkHistory Controller declarations
 */
interface IWorkHistoryController {
    /**
     * Retrieve WorkHistory by filter
     *
     * @param {number} id workHistory id
     * @returns {IWorkHistory} return WorkHistory object
     */
    getWorkHistoryById(id?: number): Promise<IApiResponse<IWorkHistory>>;

    /**
     * Retrieve WorkHistory by user id
     *
     * @param {number} profileId profile id
     * @returns {WorkHistory[]} returns array of WorkHistory
     */
    getWorkHistoryByProfileId(profileId: number): Promise<IApiResponse<IWorkHistory[]>>;

    /**
     * Create workHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {IWorkHistory} workHistory workHistory object from UI Model
     * @returns {IWorkHistory} return new workHistory ui information
     */
    createWorkHistory(user: IUserIdentity, workHistory: IWorkHistory): Promise<IApiResponse<IWorkHistory>>;

    /**
     * Update workHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {number} id workHistory id
     * @param {IWorkHistory} workHistory UI workHistory model
     * @returns {IWorkHistory} return new workHistory ui information
     */
    updateWorkHistory(user: IUserIdentity, id: number, workHistory: IWorkHistory): Promise<IApiResponse<IWorkHistory>>;

    /**
     * Delete workHistory implementation
     *
     * @param {number} id workHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {boolean} record deleted or not
     */
    deleteWorkHistory(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * WorkHistory Controller implementation
 */
@injectable()
export class WorkHistoryController extends ModelMapper implements IWorkHistoryController {
    /**
     * WorkHistory Controller constructor
     *
     * @param {WorkHistoryService} service WorkHistory service dependency
     */
    constructor(@inject(delay(() => WorkHistoryService)) private service: WorkHistoryService) {
        super();
    }

    //methods
    /**
     * Retrieve WorkHistory by filter
     *
     * @param {number} id workHistory id
     * @returns {IWorkHistory} return workHistory object
     */
    async getWorkHistoryById(id: number): Promise<IApiResponse<IWorkHistory>> {
        if (id > 0) {
            const r: WorkHistory = await this.service.single(id);

            const whUI: IWorkHistory = super.fromDbModel<IWorkHistory>(r);
            return new ApiResponse(Status.OK, whUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Retrieve WorkHistory by user id
     *
     * @param {number} profileId user id
     * @returns {IWorkHistory[]} returns array of WorkHistory
     */
    async getWorkHistoryByProfileId(profileId: number): Promise<IApiResponse<IWorkHistory[]>> {
        if (profileId > 0) {
            const filter: IWhereFilter<WorkHistory> = {ProfileId: profileId};
            filter.NOT = {Status: RecordStatus.Archived};
            const r: WorkHistory[] = await this.service.filter(filter);

            const WorkHistoryUI: IWorkHistory[] = [];
            r.forEach((workHistory: WorkHistory) => {
                const whUI: IWorkHistory = super.fromDbModel<IWorkHistory>(workHistory);
                WorkHistoryUI.push(whUI);
            });
            return new ApiResponse(Status.OK, WorkHistoryUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create workHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {IWorkHistory} workHistory workHistory UI model
     * @returns {IWorkHistory} workHistory UI model
     */
    async createWorkHistory(user: IUserIdentity, workHistory: IWorkHistory): Promise<IApiResponse<IWorkHistory>> {
        if (Validator.isWorkHistoryDataValid(workHistory)) {
            const whDB: WorkHistory = super.toDbModel<WorkHistory>(workHistory);
            whDB.Ref = Hasher.guid();
            whDB.CreatedOn = UtcDate.now();
            whDB.CreatedBy = user.ref;

            if (workHistory.isCurrent != undefined) {
                if (workHistory.isCurrent) {
                    whDB.EndedOn = null;
                }
            } else {
                whDB.IsCurrent = false;
            }

            const r: WorkHistory = await this.service.create(whDB);

            const whUI: IWorkHistory = super.fromDbModel<IWorkHistory>(r);
            return new ApiResponse(Status.OK, whUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Update workHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {number} id workHistory id
     * @param {IWorkHistory} workHistory workHistory UI model
     * @returns {IWorkHistory} workHistory UI model
     */
    async updateWorkHistory(
        user: IUserIdentity,
        id: number,
        workHistory: IWorkHistory
    ): Promise<IApiResponse<IWorkHistory>> {
        if (id > 0 && Validator.isWorkHistoryDataValid(workHistory, true)) {
            const whDB: WorkHistory = super.toDbModel<WorkHistory>(workHistory);
            whDB.ModifiedOn = UtcDate.now();
            whDB.ModifiedBy = user.ref;

            if (workHistory.isCurrent != undefined) {
                if (workHistory.isCurrent) {
                    whDB.EndedOn = null;
                }
            }

            const r: WorkHistory = await this.service.update(id, whDB);

            const whUI: IWorkHistory = super.fromDbModel<IWorkHistory>(r);
            return new ApiResponse(Status.OK, whUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete workHistory implementation
     *
     * @param {number} id workHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {boolean} record deleted or not
     */
    async deleteWorkHistory(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        if (id > 0) {
            const r: boolean = await this.service.delete(id, isHard);
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

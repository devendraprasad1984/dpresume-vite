import {delay, inject, injectable} from "tsyringe";

import {ApiResponse, ApiError, IApiResponse} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {UtcDate, Hasher} from "fnpm/utils";

import {IEducationHistory} from "ms-npm/profile-models";
import {ModelMapper} from "ms-npm/model-mapper";
import {IUserIdentity} from "ms-npm/auth-models";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {EducationHistory} from "/opt/nodejs/node14/db/client-mysql";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";

import {EducationHistoryService} from "../service/education-history.service";
import {Validator} from "../validator";

/**
 * EducationHistory Controller declarations
 */
interface IEducationHistoryController {
    /**
     * Retrieve EducationHistory by filter
     *
     * @param {number} id educationHistory id
     * @returns {IEducationHistory} return EducationHistory object
     */
    getEducationHistoryById(id?: number): Promise<IApiResponse<IEducationHistory>>;

    /**
     * Retrieve EducationHistory by user id
     *
     * @param {number} profileId profile id
     * @returns {EducationHistory[]} returns array of EducationHistory
     */
    getEducationHistoryByProfileId(profileId: number): Promise<IApiResponse<IEducationHistory[]>>;

    /**
     * Create educationHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {IEducationHistory} educationHistory educationHistory object from UI Model
     * @returns {IEducationHistory} return new educationHistory ui information
     */
    createEducationHistory(
        user: IUserIdentity,
        educationHistory: IEducationHistory
    ): Promise<IApiResponse<IEducationHistory>>;

    /**
     * Update educationHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {number} id educationHistory id
     * @param {IEducationHistory} educationHistory UI educationHistory model
     * @returns {IEducationHistory} return new educationHistory ui information
     */
    updateEducationHistory(
        user: IUserIdentity,
        id: number,
        educationHistory: IEducationHistory
    ): Promise<IApiResponse<IEducationHistory>>;

    /**
     * Delete educationHistory implementation
     *
     * @param {number} id educationHistory id
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {boolean} record deleted or not
     */
    deleteEducationHistory(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * EducationHistory Controller implementation
 */
@injectable()
export class EducationHistoryController extends ModelMapper implements IEducationHistoryController {
    /**
     * EducationHistory Controller constructor
     *
     * @param {EducationHistoryService} service EducationHistory service dependency
     */
    constructor(@inject(delay(() => EducationHistoryService)) private service: EducationHistoryService) {
        super();
    }

    //methods
    /**
     * Retrieve EducationHistory by filter
     *
     * @param {number} id educationHistory id
     * @returns {IEducationHistory} return educationHistory object
     */
    async getEducationHistoryById(id: number): Promise<IApiResponse<IEducationHistory>> {
        if (id > 0) {
            const r: EducationHistory = await this.service.single(id);
            const educationHistoryUI: IEducationHistory = super.fromDbModel<IEducationHistory>(
                r ? r : <EducationHistory>{}
            );
            return new ApiResponse(Status.OK, educationHistoryUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Retrieve EducationHistory by profile id
     *
     * @param {number} profileId profile id
     * @returns {IEducationHistory[]} returns array of EducationHistory
     */
    async getEducationHistoryByProfileId(profileId: number): Promise<IApiResponse<IEducationHistory[]>> {
        if (profileId > 0) {
            const filter: IWhereFilter<EducationHistory> = {ProfileId: profileId};
            filter.NOT = {Status: RecordStatus.Archived};
            const r: EducationHistory[] = await this.service.filter(filter);

            const EducationHistoryUI: IEducationHistory[] = [];
            r.forEach((educationHistory: EducationHistory) => {
                const whUI: IEducationHistory = super.fromDbModel<IEducationHistory>(educationHistory);
                EducationHistoryUI.push(whUI);
            });
            return new ApiResponse(Status.OK, EducationHistoryUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Create educationHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {IEducationHistory} educationHistory educationHistory UI model
     * @returns {IEducationHistory} educationHistory UI model
     */
    async createEducationHistory(
        user: IUserIdentity,
        educationHistory: IEducationHistory
    ): Promise<IApiResponse<IEducationHistory>> {
        if (Validator.isEducationHistoryDataValid(educationHistory)) {
            const ehDB: EducationHistory = super.toDbModel<EducationHistory>(educationHistory);
            ehDB.Ref = Hasher.guid();
            ehDB.CreatedBy = user.ref;
            ehDB.CreatedOn = UtcDate.now();

            if (educationHistory.isCurrent != undefined) {
                if (educationHistory.isCurrent) {
                    ehDB.EndedOn = null;
                }
            } else {
                ehDB.IsCurrent = false;
            }

            const r: EducationHistory = await this.service.create(ehDB);
            const whUI: IEducationHistory = super.fromDbModel<IEducationHistory>(r);
            return new ApiResponse(Status.OK, whUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Update educationHistory implementation
     *
     * @param {IUserIdentity} user user object
     * @param {number} id educationHistory id number
     * @param {IEducationHistory} educationHistory educationHistory UI model
     * @returns {IEducationHistory} educationHistory UI model
     */
    async updateEducationHistory(
        user: IUserIdentity,
        id: number,
        educationHistory: IEducationHistory
    ): Promise<IApiResponse<IEducationHistory>> {
        if (id > 0 && Validator.isEducationHistoryDataValid(educationHistory, true)) {
            const ehDB: EducationHistory = super.toDbModel<EducationHistory>(educationHistory);

            ehDB.ModifiedBy = user.ref;
            ehDB.ModifiedOn = UtcDate.now();

            if (educationHistory.isCurrent != undefined) {
                if (educationHistory.isCurrent) {
                    ehDB.EndedOn = null;
                }
            }

            const r: EducationHistory = await this.service.update(id, ehDB);
            const whUI: IEducationHistory = super.fromDbModel<IEducationHistory>(r);
            return new ApiResponse(Status.OK, whUI);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }

    /**
     * Delete educationHistory implementation
     *
     * @param {number} id educationHistory id number
     * @param {boolean} isHard indicate if record will be deleted on db or not
     * @returns {boolean} record deleted or not
     */
    async deleteEducationHistory(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        if (id > 0) {
            const r: boolean = await this.service.delete(id, isHard);
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

import {injectable} from "tsyringe";
import {IApiResponse, ApiResponse} from "fnpm/core";
import {Status} from "fnpm/enums";

/**
 * Schedule Controller declarations
 */
interface IScheduleController {
    //methods
    /**
     * Ping method
     *
     * @param {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;
}

/**
 * Schedule Controller implementation
 */
@injectable()
export class ScheduleController implements IScheduleController {
    //methods
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        return new ApiResponse(Status.OK, "schedule - pong");
    }
}

import {injectable} from "tsyringe";

import {ApiResponse, IApiResponse} from "fnpm/core";
import {Status} from "fnpm/enums";

/**
 * Admin Controller declarations
 */
interface IAdminController {
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;
}

/**
 * Admin Controller implementation
 */
@injectable()
export class AdminController implements IAdminController {
    // methods
    /**
     * Ping method implementation
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async ping(): Promise<IApiResponse<string>> {
        return new ApiResponse(Status.OK, "admin - pong");
    }
}

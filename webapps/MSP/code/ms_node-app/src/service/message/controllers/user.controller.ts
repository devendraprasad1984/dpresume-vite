import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiError, ApiResponse, IApiResponse} from "fnpm/core";

import {UserService} from "../service/user.service";

/**
 * User Controller declarations
 */
interface IUserController {
    /**
     * get User token
     */
    getToken(userId: number): Promise<IApiResponse<string>>;
}

/**
 * User Controller implementation
 */
@injectable()
export class UserController implements IUserController {
    //methods

    /**
     * User Controller constructor
     *
     * @param {UserService} service User service dependency
     */
    constructor(@inject(delay(() => UserService)) private service: UserService) {
    }

    /**
     * Get token from Stream API
     *
     * @param {number} userId user id
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async getToken(userId: number): Promise<IApiResponse<string>> {
        //Validate the userId
        if (userId !== undefined && userId > 0) {
            //Get the result from the services
            const r: string = await this.service.getToken(userId);
            //Check the result
            if (r) {
                //Token retrieve successfully
                return new ApiResponse(Status.OK, r);
            } else {
                //Conflict to retrieve a token
                throw new ApiError(Status.Conflict, Message.Failure);
            }
        } else {
            throw new ApiError(Status.BadRequest, Message.InvalidData);
        }
    }
}

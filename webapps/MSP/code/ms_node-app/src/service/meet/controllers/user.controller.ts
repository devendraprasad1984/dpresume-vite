import {delay, inject, injectable} from "tsyringe";

import {Message, Status} from "fnpm/enums";
import {ApiError, ApiResponse, IApiResponse} from "fnpm/core";

import {IUserIdentity} from "ms-npm/auth-models";

import {UserService} from "../service/user.service";

/**
 * User Controller declarations
 */
interface IUserController {
    /**
     * get User token
     */
    getToken(roomId: string, user: IUserIdentity): Promise<IApiResponse<string>>;
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
     * Get token from Twilio API
     *
     * @param {string} roomId room id
     * @param {IUserIdentity} user user Identity
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    async getToken(roomId: string, user: IUserIdentity): Promise<IApiResponse<string>> {
        //Validate the userId
        if (roomId !== undefined) {
            //Get the result from the services
            const r: string = await this.service.getToken(roomId, user);
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

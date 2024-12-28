import {delay, inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiResponse, IApiResponse, IPaginationResponse, IPaginationRequest} from "fnpm/core";

import {IUserSearch} from "ms-npm/admin-models";
import {SortOrder} from "/opt/nodejs/node14/db/enums/index";

import {UserInclude} from "../db.includes";
import {UserService} from "../service/user.service";
import {AdminMapper} from "../mapper/admin-mapper";

/**
 * User Controller declarations
 */
interface IUserController {
    /**
     * get users list method
     *
     * @returns { Promise<IApiResponse<IPaginationResponse<IUserSearch[]>>>} promise of type IApiResponse of type IPaginationResponse<IUserSearch[]>
     */
    getUsers(pagination: IPaginationRequest): Promise<IApiResponse<IPaginationResponse<IUserSearch[]>>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class UserController extends AdminMapper implements IUserController {
    /**
     * User Controller constructor
     *
     * @param {UserService} userService database service dependency
     */
    constructor(@inject(delay(() => UserService)) private userService: UserService) {
        super();
    }

    // methods
    /**
     * Return a list of users
     *
     * @param {IPaginationRequest} pagination pagination information
     * @returns {Promise<IApiResponse<IPaginationResponse<IUserSearch[]>>>} List of users
     */
    async getUsers(pagination: IPaginationRequest): Promise<IApiResponse<IPaginationResponse<IUserSearch[]>>> {
        //Set the order by
        const orderBy = {Id: SortOrder.Asc};
        const r: IPaginationResponse<UserInclude[]> = await this.userService.filter({}, orderBy, undefined, pagination);
        const userDataList: IUserSearch[] = [];
        //Convert the list
        r.data.forEach((user: UserInclude) => {
            userDataList.push(super.fromDbUserModel(user));
        });

        const paginationResult: IPaginationResponse<IUserSearch[]> = {
            currentPage: r.currentPage,
            lastPage: r.lastPage,
            totalCount: r.totalCount,
            data: userDataList
        };

        //return the list
        return new ApiResponse(Status.OK, paginationResult);
    }
}

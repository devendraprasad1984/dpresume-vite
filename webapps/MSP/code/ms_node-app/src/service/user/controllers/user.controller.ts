import {delay, inject, injectable} from "tsyringe";

import {StringFormatter} from "fnpm/utils";
import {Message, Status} from "fnpm/enums";
import {ApiResponse, ApiError, IApiResponse, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {IUser} from "ms-npm/user-models";
import {IPeopleQuery, IPeopleSearch, PeopleConnectedStatus} from "ms-npm/search-models";
import {UserFilter} from "ms-npm/routes/user";
import {IUserIdentity} from "ms-npm/auth-models";

import {User} from "/opt/nodejs/node14/db/client-mysql";
import {UserService} from "../service/user.service";
import {Validator} from "../validator";
import {ProfileMapper} from "../mapper/profile-mapper";
import {MemberService} from "../service/member.service";

/**
 * User Controller declarations
 */
interface IUserController {
    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    ping(): Promise<IApiResponse<string>>;

    /**
     * Get user by id declaration
     */
    getUserById(userId: number): Promise<IApiResponse<IUser>>;

    /**
     * Get user array
     */
    filter(
        userInfo: IUserIdentity,
        filter: UserFilter,
        pagination: IPaginationRequest,
        data?: IPeopleQuery
    ): Promise<IApiResponse<IPaginationResponse<IPeopleSearch[]>>>;

    /**
     * get users list method
     *
     * @returns {Promise<IApiResponse<IUser>>} promise of type IApiResponse of type IUser
     */
    updateUser(id: number, user: Partial<IUser>): Promise<IApiResponse<IUser>>;

    /**
     * Ping method
     *
     * @returns {Promise<IApiResponse<string>>} promise of type IApiResponse of type string
     */
    deleteUser(id: number, isHard?: boolean): Promise<IApiResponse<boolean>>;
}

/**
 * App Controller implementation
 */
@injectable()
export class UserController extends ProfileMapper implements IUserController {
    /**
     * User Controller constructor
     *
     * @param {UserService} userService database service dependency
     * @param {MemberService} memberService member service dependency
     */
    constructor(
        @inject(delay(() => UserService)) private userService: UserService,
        @inject(delay(() => MemberService)) private memberService: MemberService
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
        return new ApiResponse(Status.OK, "user - pong");
    }

    // methods
    /**
     * Return a list of users
     *
     * @param {IUserIdentity} userInfo user info
     * @param {number} filter connection filter 1:connected with me, 2: not connected, null: all
     * @param {IPaginationRequest} pagination pagination information
     * @param {IPeopleQuery} data body filter
     * @returns {Promise<IApiResponse<IPaginationResponse<IPeopleSearch[]>>> } List of users
     */
    async filter(
        userInfo: IUserIdentity,
        filter: UserFilter,
        pagination: IPaginationRequest,
        data?: IPeopleQuery
    ): Promise<IApiResponse<IPaginationResponse<IPeopleSearch[]>>> {
        let connectFilter: PeopleConnectedStatus = null;
        let rU: object[];

        switch (filter) {
            case UserFilter.connectedWithMe:
                connectFilter = PeopleConnectedStatus.Connected;
                rU = await this.userService.rawQuery(userInfo, connectFilter);
                break;
            case UserFilter.notConnectedWithMe:
                connectFilter = PeopleConnectedStatus.NotConnected;
                rU = await this.userService.rawQuery(userInfo, connectFilter);
                break;
            case UserFilter.pendingConnections:
                connectFilter = PeopleConnectedStatus.Pending;
                rU = await this.userService.rawQuery(userInfo, connectFilter);
                break;
            case UserFilter.peopleSearch:
                const pQuery: IPeopleQuery = data;
                const params: string[] = [];
                let strCity: string = "";
                let strState: string = "";

                if (pQuery) {
                    //Keyword
                    params.push(pQuery.keyword);
                    //Location
                    if (pQuery.location && pQuery.location.length > 0) {
                        pQuery.location.forEach((l: string) => {
                            const loc = l.split("-");
                            strState += StringFormatter.setQuote(loc[0].trim()) + ",";
                            strCity += StringFormatter.setQuote(loc[1].trim()) + ",";
                        });
                        params.push(StringFormatter.setQuote(strCity, true));
                        params.push(StringFormatter.setQuote(strState, true));
                    } else {
                        params.push(undefined);
                        params.push(undefined);
                    }

                    //YearsExperience
                    params.push(this.createParameter(pQuery.experience));
                    //School
                    params.push(this.createParameter(pQuery.school));
                    //Company
                    params.push(this.createParameter(pQuery.company));
                    //IndustryExperience
                    params.push(this.createParameter(pQuery.industry));
                    //Intent
                    params.push(this.createParameter(pQuery.intent));
                }

                rU = await this.userService.rawQueryUserSearch(userInfo, params);
                break;
            default:
                //all the connections
                rU = await this.userService.rawQuery(userInfo);
                break;
        }

        //Apply pagination
        const totalCount = rU.length;
        const lastPage = Math.ceil(rU.length / pagination.perPage);
        const start = pagination.page * pagination.perPage - pagination.perPage;
        const end = start + pagination.perPage;

        const rUPaginated = rU.slice(start, end);
        //map the response
        const connections: IPeopleSearch[] = rUPaginated.map((e: object) => super.fromDbConnectionModel(e));

        const paginationResponse: IPaginationResponse<IPeopleSearch[]> = {
            currentPage: pagination.page,
            lastPage: lastPage,
            totalCount: totalCount,
            data: connections
        };
        //return the list
        return new ApiResponse(Status.OK, paginationResponse);
    }

    /**
     * Returns specific user by id
     *
     * @param {number} userId user id
     * @returns {Promise<IApiResponse<IUser>>} promise of type IApiResponse of type Profile data
     */
    async getUserById(userId: number): Promise<IApiResponse<IUser>> {
        if (userId > 0) {
            const filter: Partial<User> = {Id: userId};
            const r: User = await this.userService.single(filter);
            if (r) {
                const user: IUser = super.fromDbModel<IUser>(r);
                return new ApiResponse(Status.OK, user);
            }
        }
        throw new ApiError(Status.BadRequest, Message.InvalidData);
    }

    /**
     * User update implementation
     *
     * @param {number} id User id to delete
     * @param {Partial<IUser>} user User data to be updated
     * @returns {boolean} Return flag to indicate delete state.
     */
    async updateUser(id: number, user: Partial<IUser>): Promise<IApiResponse<IUser>> {
        if (id > 0 && Validator.isUpdateUserDataValid(user)) {
            const userDB: Partial<User> = super.toDbModel<Partial<User>>(user);

            const r: User = await this.userService.update(id, userDB);
            return new ApiResponse(Status.OK, super.fromDbModel<IUser>(r));
        } else {
            throw new ApiError(Status.Conflict, Message.InvalidData);
        }
    }

    /**
     * User delete implementation
     *
     * @param {number} id User id to delete
     * @param {boolean} isHard Specify if delete is hard or soft
     * @returns {boolean} Return flag to indicate delete state.
     */
    async deleteUser(id: number, isHard?: boolean): Promise<IApiResponse<boolean>> {
        if (id > 0) {
            const r: boolean = await this.userService.delete(id, isHard);
            //Ignored in test due to cascade delete error
            /* istanbul ignore next */
            return new ApiResponse(Status.OK, r);
        } else {
            throw new ApiError(Status.Conflict, Message.InvalidData);
        }
    }

    /**
     * Function that allow to create a stored procedure in parameter
     *
     * @param {string[]} param IPeopleQuery array to create stored procedure parameter
     * @returns {string} if filter exists, return string, if not, undefined
     */
    private createParameter(param: string[]): string {
        let strBuild: string = "";
        if (param && param.length > 0) {
            param.forEach((l: string) => {
                strBuild = StringFormatter.setQuote(l) + ",";
            });
            return StringFormatter.setQuote(strBuild, true);
        } else {
            return undefined;
        }
    }
}

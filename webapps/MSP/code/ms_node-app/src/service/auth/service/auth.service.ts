import {inject, injectable} from "tsyringe";

import {Status} from "fnpm/enums";
import {ApiError} from "fnpm/core";

import {IAuthProfile, Role, RoleKeys} from "ms-npm/auth-models";

import {Info, Prisma, User} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {AuthUserInclude} from "/opt/nodejs/node14/auth/_/db.includes";

import {UserCreate} from "../db.includes";

/**
 * Auth Services declaration
 */
interface IAuthService {
    /**
     * Retrieve user
     *
     * @returns {User} returns User object
     */
    singleUser(filter: Partial<User>): Promise<User>;

    /**
     * Create user
     *
     * @param {User} user user object from UI Model
     * @returns {User} return new user information
     */
    createUser(user: UserCreate): Promise<UserCreate>;

    /**
     * Update login information from auth0
     *
     * @param {number} userId user id
     * @param {Partial<User>} user user object
     * @returns {User} User updated
     */
    updateLoginInfo(userId: number, user: Partial<User>);
}

/**
 * Auth Service implementation
 */
@injectable()
export class AuthService implements IAuthService {
    /**
     * Constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    /**
     * Retrieve user
     *
     * @param {Partial<User>} filter user filter
     * @returns {User} returns User object
     */
    async singleUser(filter: Partial<User>): Promise<User> {
        try {
            return this.service.retrieveUnique<User>(Prisma.ModelName.User, filter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Create user implementation
     *
     * @param {User} user user object from UI Model
     * @returns {User} return new user information
     */
    async createUser(user: UserCreate): Promise<UserCreate> {
        try {
            return this.service.create<UserCreate>(Prisma.ModelName.User, user);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update login information from auth0
     *
     * @param {number} userId user id
     * @param {Partial<User>} user user object
     * @returns {User} User updated
     */
    async updateLoginInfo(userId: number, user: Partial<User>): Promise<User> {
        try {
            return this.service.update<User>(Prisma.ModelName.User, userId, user);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Get User Roles from database
     *
     * @param {number} userId user id
     * @returns {Map<string, string>} Map of roles
     */
    async getRoles(userId: number): Promise<IAuthProfile> {
        const rolesMap: IAuthProfile = {} as IAuthProfile;
        const companyModel = {[Prisma.ModelName.Company]: {include: {[Prisma.ModelName.Info]: true}}};
        const personnelModel = {[Prisma.ModelName.Personnel]: {include: companyModel}};

        try {
            const r: AuthUserInclude = await this.service.retrieveUnique<AuthUserInclude>(
                Prisma.ModelName.User,
                {Id: userId},
                personnelModel
            );

            if (r) {
                rolesMap[RoleKeys.Default] = r.Role;
                r.Personnel.forEach((item: typeof r.Personnel[0]) => {
                    const companyInfo: typeof item.Company.Info = item.Company.Info;
                    const info: Info = companyInfo.find((x: Info) => x.Status == RecordStatus.Active);
                    rolesMap[info.Name] = item.Role;
                });
                return rolesMap;
            } else {
                rolesMap[RoleKeys.Default] = Role.User;
                return rolesMap;
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

import { inject, injectable } from "tsyringe";

import { Prisma, PrismaClient as MySqlClient, User } from "/opt/nodejs/node14/db/client-mysql";
import { DbRepo } from "/opt/nodejs/node14/db";
import { UserInclude } from "../db.includes";

/**
 *  User Meet Service declarations
 */
interface IUserService {
    /**
     * Get user data for specific userRef
     */
    getUserByRef(ref: string): Promise<User>;
}

/**
 * User service implementation
 */
@injectable()
export class UserService implements IUserService {
    /**
     * User controller constructor
     *
     * @param {DbRepo<MySqlClient>} dbService db client dependency
     */
    constructor(@inject("Db") private dbService: DbRepo<MySqlClient>) {}
    // methods
    /**
     * Return the user information based on the UserRef
     *
     * @param {string} ref guid from db
     * @returns {UserInclude} user data
     */
    async getUserByRef(ref: string): Promise<UserInclude> {
        const userModel = { [Prisma.ModelName.Profile]: true };
        const filter = { Ref: ref };
        return await this.dbService.retrieveUnique<UserInclude>(Prisma.ModelName.User, filter, userModel);
    }
}

import { inject, injectable } from "tsyringe";

import { User as dbUser, Prisma, PrismaClient as MySqlClient, Member } from "/opt/nodejs/node14/db/client-mysql";
import { DbRepo } from "/opt/nodejs/node14/db";
import { UserInclude } from "../db.includes";

/**
 *  User Chat Service declarations
 */
interface IUserService {
    // declarations

    /**
     * Get user data for specific userRef
     */
    getUserByRef(ref: string): Promise<dbUser>;
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

    /**
     * Return if the 1:MS Channel is already created for specific user.
     *
     * @param {number} userId user id ref
     * @param {string} groupMemberRef group member ref
     * @returns {true} is created
     */
    async msChannelCreated(userId: number, groupMemberRef: string): Promise<boolean> {
        const filter = { UserId: userId, GroupMemberRef: groupMemberRef };
        const msMember = await this.dbService.retrieve<Member>(Prisma.ModelName.Member, filter);
        //Check the result
        if (msMember.length === 1) {
            return true;
        } else {
            return false;
        }
    }
}

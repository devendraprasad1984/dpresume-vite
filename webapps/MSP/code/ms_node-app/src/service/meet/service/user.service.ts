import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Message, Status} from "fnpm/enums";
import {Meet} from "fnpm/meet";
import {TwilioApi} from "fnpm/meet/twilio";

import {IUserIdentity} from "ms-npm/auth-models";

import {Prisma, Meet as DbMeet, Channel, PrismaClient as MySqlClient, User} from "/opt/nodejs/node14/db/client-mysql";
import {DbRepo} from "/opt/nodejs/node14/db";
import {UserInclude} from "../db.includes";

/**
 *  User Meet Service declarations
 */
interface IUserService {
    // declarations
    /**
     * Get user token for Twilio
     */
    getToken(roomId: string, user: IUserIdentity): Promise<string>;

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
     * @param {Meet<TwilioApi>} meet meet client dependency
     * @param {DbRepo<MySqlClient>} dbService db client dependency
     */
    constructor(@inject("Meet") private meet: Meet<TwilioApi>, @inject("Db") private dbService: DbRepo<MySqlClient>) {
    }

    // methods

    /**
     * Return a twilio token for a specific user and room
     *
     * @param {string} roomId channel ref
     * @param {IUserIdentity} user user data
     * @returns {Promise<string>} promise of type string
     */
    async getToken(roomId: string, user: IUserIdentity): Promise<string> {
        try {
            const filter = {TwilioRef: roomId};
            const resMeet = await this.dbService.retrieve<DbMeet>(Prisma.ModelName.Meet, filter);
            const rMeet: DbMeet = resMeet[0];
            if (!rMeet) {
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            //get the channel data from database
            const filterChannel = {Id: rMeet.ChannelId};
            const rChannel = await this.dbService.retrieveUnique<Channel>(Prisma.ModelName.Channel, filterChannel);

            //check if the channel exist
            if (!rChannel) {
                //The channel could not be obtained
                throw new ApiError(Status.Conflict, Message.InvalidData);
            }

            return this.meet.client.getToken(user.ref, rChannel.Ref);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Return the user information based on the UserRef
     *
     * @param {string} ref guid from db
     * @returns {UserInclude} user data
     */
    async getUserByRef(ref: string): Promise<UserInclude> {
        const userModel = {[Prisma.ModelName.Profile]: true};
        const filter = {Ref: ref};
        return await this.dbService.retrieveUnique<UserInclude>(Prisma.ModelName.User, filter, userModel);
    }
}

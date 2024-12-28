import { Prisma, Profile, User } from "/opt/nodejs/node14/db/client-mysql";

/**
 * Type user to create new user
 */
export type UserCreate = Prisma.UserCreateInput & {
    Id: number;
};

/**
 * Type used to return profile included models
 */
export type UserInclude = User & {
    Profile: Profile;
};

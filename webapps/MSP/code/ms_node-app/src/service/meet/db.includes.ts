import { Channel, Meet, Profile, User } from "/opt/nodejs/node14/db/client-mysql";

/**
 * Type used to return profile included models
 */
export type UserInclude = User & {
    Profile: Profile;
};

/**
 * Type used to return meet included models
 */
export type MeetInclude = Meet & {
    Channel: Channel;
};

import { Event, Schedule, User, Profile } from "/opt/nodejs/node14/db/client-mysql";
/**
 * Type used to return all the event includes
 */
export type EventInclude = Event & {
    Schedule: Schedule;
};

/**
 * Type used to return profile included models
 */
export type UserInclude = User & {
    Profile: Profile;
};

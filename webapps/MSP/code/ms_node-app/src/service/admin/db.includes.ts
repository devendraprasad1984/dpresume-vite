import { Profile, User, WorkHistory, Note, Info, Company, Personnel } from "/opt/nodejs/node14/db/client-mysql";
/**
 * Type used to return profile included models
 */
export type UserInclude = User & {
    Profile: (Profile & {
        WorkHistory: WorkHistory[];
    })[];
    Note: Note[];
};

/**
 * Type user to return Company included models
 */
export type CompanyInclude = Company & {
    Info: Info[];
    Personnel: (Personnel & {
        User: User & {
            Profile: Profile[];
        };
    })[];
};

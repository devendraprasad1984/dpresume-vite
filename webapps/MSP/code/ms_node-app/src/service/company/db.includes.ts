import {
    Channel,
    Company,
    Info,
    Member,
    Note,
    Personnel,
    Profile,
    User,
    WorkHistory
} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Type user to return Personnel included models
 */
export type PersonnelInclude = Personnel & {
    User: User & {
        Profile: (Profile & {
            WorkHistory: WorkHistory[];
        })[];
        Note: Note[];
    };
};

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
 * Type used to return Company included models
 */
export type CompanyInclude = Company & {
    Info: Info[];
    Personnel: (Personnel & {
        User: User & {
            Profile: Profile[];
        };
    })[];
    _count: {
        Personnel: number;
    };
};

/**
 * Type used to return member included models
 */
export type MemberInclude = Member & {
    Channel: Channel;
};

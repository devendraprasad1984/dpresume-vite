import {
    Channel,
    Company,
    Info,
    Member,
    MemberRequest,
    Profile,
    Topic,
    User
} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Type used to return profile included models
 */
export type UserInclude = User & {
    Profile: Profile;
};

/**
 * Type used to return profile included models
 */
export type ChannelInclude = Channel & {
    Member: MemberInclude[];
};

/**
 * Type used to return topic included models
 */
export type TopicInclude = Topic & {
    Channel: ChannelInclude;
    Company: Company & {
        Info: Info[];
    };
    MemberRequest: MemberRequestInclude[];
};

/**
 * Type used to return member included models
 */
export type MemberInclude = Member & {
    User: User & {
        Profile: Profile[];
    };
};

/**
 * Type used to return member request included models
 */
export type MemberRequestInclude = MemberRequest & {
    User: User & {
        Profile: Profile[];
    };
};

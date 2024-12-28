import { EducationHistory, Profile, User, WorkHistory, Note, Member } from "/opt/nodejs/node14/db/client-mysql";
/**
 * Type used to return profile included models
 */
export type ProfileInclude = Profile & {
    User: User;
    WorkHistory: WorkHistory[];
    EducationHistory: EducationHistory[];
};

/**
 * Type used to return profile included models
 */
export type UserInclude = User & {
    Profile: (Profile & {
        WorkHistory: WorkHistory[];
    })[];
    Note: Note[];
    Member: Member[];
};

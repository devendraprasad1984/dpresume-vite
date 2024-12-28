/**
 * Route Ids enum
 */
export enum Route {
    ping = "ping",
    user = "user",
    profile = "profile",
    bucket = "bucket",
    match = "match",
    flag = "flag",
    tag = "tag",
    invite = "invite"
}

/**
 * Sub-routes for User
 */
export enum UserRoute {
    root = "root"
}

/**
 * Filters for Profile
 */
export enum UserFilter {
    connectedWithMe = "connectedWithMe",
    notConnectedWithMe = "notConnectedWithMe",
    withoutConnections = "withoutConnections",
    peopleSearch = "peopleSearch"
}

/**
 * Sub-routes for Profile
 */
export enum ProfileRoute {
    root = "root",
    workHistory = "workhistory",
    educationHistory = "educationhistory"
}

/**
 * Filters for Profile
 */
export enum ProfileFilter {
    getByUserId = "getByUserId"
}

/**
 * Filters for WorkHistory
 */
export enum WorkHistoryFilter {
    getWorkHistoryById = "getWorkHistoryById",
    getWorkHistoryByProfileId = "getWorkHistoryByProfileId"
}

/**
 * Filters for EducationHistory
 */
export enum EducationHistoryFilter {
    getEducationHistoryById = "getEducationHistoryById",
    getEducationHistoryByProfileId = "getEducationHistoryByProfileId"
}

/**
 * Filters for Profile
 */
export enum MemberRequestFilter {
    getRequestByUser = "getByUser",
    getRequestByCompany = "getByCompany"
}

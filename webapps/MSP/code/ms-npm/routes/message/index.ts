/**
 * Route Ids enum
 */
export enum Route {
    ping = "ping"
}

/**
 * Sub-routes for Chat
 */
export enum ChatRoute {
    root = "root",
    filter = "filter",
    delete = "delete",
    channel = "channel",
    message = "message",
    user = "user"
}

/**
 * Channel routes
 */
export enum ChannelRoute {
    invite = "invite",
    leave = "leave",
    archive = "archive",
    sync = "sync"
}

/**
 * Message routes
 */
export enum MessageRoute {
    send = "send",
    archive = "archive"
}

/**
 * User routes
 */
export enum UserRoute {
    token = "token",
    sync = "sync"
}

/**
 * Filters for Chat
 */
export enum ChatFilter {
    getByMembers = "getByMembers"
}

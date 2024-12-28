/**
 * Route Ids as enum
 */
export enum Route {
    ping = "ping",
    admin = "admin",
    note = "note",
    company = "company",
    flag = "flag",
    match = "match",
    user = "user"
}

/**
 * SubRoute for admin
 */
export enum AdminRoute {
    filter = "filter",
    delete = "delete"
}

/**
 * Notes filter
 */
export enum NotesFilter {
    getByNoteId = "getByNoteId",
    getByUserId = "getByUserId"
}

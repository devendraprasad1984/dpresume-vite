/**
 * Route Ids enum
 */
export enum Route {
    ping = "ping",
    company = "company",
    info = "info",
    personnel = "personnel",
    job = "job",
    connection = "connection"
}

/**
 * Filters for Info
 */
export enum InfoFilter {
    getByCompanyId = "getByCompanyId"
}

/**
 * Filters for Personnel
 */
export enum PersonnelFilter {
    getAllConnections = "getAllConnections",
    getEmployeeConnections = "getEmployeeConnections",
    getUserConnections = "getUserConnections"
}

/**
 * Filters for Company
 */
export enum CompanyFilter {
    explore = "explore"
}

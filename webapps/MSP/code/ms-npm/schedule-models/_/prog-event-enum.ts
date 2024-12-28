/**
 * Response enum
 */
export enum ProgEventResponse {
    instant = "instant",
    reminder = "reminder",
    action = "action"
}

/**
 * ProgEventType enum
 */
export enum ProgEventType {
    oneAndOne = "1:1",
    oneToMany = "1:*",
    oneToMS = "1:MS",
    oneToCompany = "1:Comp",
    companyToMS = "Comp:MS",
    msaInvite = "MSA:Invite",
    companyInvite = "Comp:Invite"
}

/**
 * ProgEventCategory enum
 */
export enum ProgEventCategory {
    message = "message",
    meet = "meet",
    meetSchedule = "meetSchedule",
    topic = "topic",
    session = "session"
}

/**
 * ProgEventSpecs enum
 */
export enum ProgEventSpecs {
    next = "next",
    today = "today",
    nextDay = "nextDay"
}

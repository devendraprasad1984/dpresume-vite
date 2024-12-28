import { IAudit } from "../../base-models";

/**
 * Member Request UI Model
 */
export interface IMemberRequest {
    id: number;
    userRef: string;
    channelRef: string;
    approvedByRef: string;
    topicRef: string;
    sessionRef: string;
    companyRef: string;
    status: string;
    type: MemberRequestType;
    message: string;
    invitedBy: string;
    eventName: string;
    audit: IAudit;
}

/**
 * Member request type
 */
export enum MemberRequestType {
    Channel = "Channel",
    Company = "Company"
}

import { IMemberRequest, MemberRequestType } from "ms-npm/user-models";

import { RecordStatus } from "../../common/db/enums";

const companyRef: string = "251225d2-4652-9367-79b8-5bf2b382fr56";
const userRef: string = "4b8de3be-a832-6cb6-acde-f0c47f23d2a6";

export const newMemberRequest: IMemberRequest = {
    id: 0,
    companyRef: companyRef,
    status: RecordStatus.Active,
    approvedByRef: undefined,
    channelRef: undefined,
    eventName: undefined,
    invitedBy: undefined,
    type: MemberRequestType.Company,
    userRef,
    message: "New request",
    sessionRef: undefined,
    topicRef: undefined,
    audit: undefined
};

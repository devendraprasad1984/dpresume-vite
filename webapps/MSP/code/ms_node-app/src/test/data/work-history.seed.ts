import {UtcDate} from "fnpm/utils";

import {RecordStatus} from "../../common/db/enums";

export const newWorkHistory = {
    id: 0,
    ref: "5e299b2b-c308-426d-fbd8-bda2524e4967",
    profileId: 1,
    status: RecordStatus.Active,
    company: "TestCompany",
    title: "TestTitle",
    description: "TestDescription",
    startedOn: UtcDate.now()
};

export const updateWorkHistory = {
    id: 0,
    ref: "5e299b2b-c308-426d-fbd8-bda2524e4967",
    profileId: 1,
    status: RecordStatus.Pending,
    company: "TestCompanyUpdate",
    title: "TestTitleUpdate",
    description: "TestDescriptionUpdate",
    startedOn: UtcDate.now()
};

export const updateWorkHistoryStatus = {status: RecordStatus.Archived};

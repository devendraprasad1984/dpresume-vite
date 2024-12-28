import {Hasher, UtcDate} from "fnpm/utils";

import {IEducationHistory} from "ms-npm/profile-models";

import {RecordStatus} from "../../common/db/enums";

const ref: string = Hasher.guid();

export const newEducationHistory: IEducationHistory = {
    id: 0,
    ref: ref,
    profileId: 1,
    status: RecordStatus.Active,
    school: "MIT",
    degree: "Software Engineer",
    description: "Education description",
    startedOn: UtcDate.now(),
    endedOn: UtcDate.now(),
    field: "Software",
    isCurrent: true,
    audit: undefined
};

export const updateEducationHistory: Partial<IEducationHistory> = {
    id: 0,
    ref: ref,
    profileId: 1,
    status: RecordStatus.Pending,
    school: "TTU",
    degree: "PhD Software Engineer",
    description: "Education description",
    endedOn: UtcDate.now(),
    field: "Software manager",
    isCurrent: true,
    audit: undefined
};

export const updateEducationHistoryStatus: Partial<IEducationHistory> = {status: RecordStatus.Archived};

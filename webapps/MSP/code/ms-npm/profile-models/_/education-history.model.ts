import { IAudit } from "../../base-models";

/**
 * Education History declarations
 */
export interface IEducationHistory {
    id: number;
    ref: string;
    profileId: number;
    status: string;
    school: string;
    degree: string;
    field: string;
    description: string;
    startedOn: Date | string;
    endedOn: Date | string;
    isCurrent: boolean;
    audit: IAudit;
}

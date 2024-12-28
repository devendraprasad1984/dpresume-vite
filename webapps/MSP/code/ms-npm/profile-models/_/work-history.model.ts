import { IAudit } from "../../base-models";

/**
 * Work History declarations
 */
export interface IWorkHistory {
    id: number;
    ref: string;
    profileId: number;
    status: string;
    company: string;
    title: string;
    description: string;
    startedOn: Date | string;
    endedOn: Date | string;
    isCurrent: boolean;
    audit: IAudit;
}

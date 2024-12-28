import { IAudit } from "../../base-models";

/**
 * Company declarations
 */
export interface ICompany {
    id: number;
    ref: string;
    status: string;
    audit: IAudit;
}

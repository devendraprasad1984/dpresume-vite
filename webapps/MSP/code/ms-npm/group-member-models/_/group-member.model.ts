import { IAudit } from "../../base-models";

/**
 * Group Member declarations
 */
export interface IGroupMember {
    id: number;
    ref: string;
    companyRef: string;
    status: string;
    role: { roles: string[] };
    name: string;
    isDefault: boolean;
    audit: IAudit;
}

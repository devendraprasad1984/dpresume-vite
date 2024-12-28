import { Role } from "../../auth-models";
import { IAudit } from "../../base-models";

/**
 * Personnel declarations
 */
export interface IPersonnel {
    id: number;
    userId: number;
    companyId: number;
    status: string;
    role: Role;
    audit: IAudit;
}

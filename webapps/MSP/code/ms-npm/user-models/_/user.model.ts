import { Role } from "../../auth-models";
import { IAudit } from "../../base-models";

/**
 * User declarations
 */
export interface IUser {
    id: number;
    ref: string;
    role: Role;
    sub: string;
    lastLogin: Date | string;
    status: string;
    audit: IAudit;
}

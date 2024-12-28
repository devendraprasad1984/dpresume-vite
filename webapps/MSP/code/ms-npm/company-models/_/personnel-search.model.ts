import { Role } from "../../auth-models";
import { IUserSearch } from "../../admin-models";

/**
 * Personnel search declarations
 */
export interface IPersonnelSearch {
    id: number;
    status: string;
    companyId: number;
    role: Role;
    user: IUserSearch;
}

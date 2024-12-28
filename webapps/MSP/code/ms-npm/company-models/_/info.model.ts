import { IAudit } from "../../base-models";
import { CompanyCategory } from "./info.enum";

/**
 * Info declarations
 */
export interface IInfo {
    id: number;
    companyId: number;
    category: CompanyCategory;
    status: string;
    name: string;
    established: number;
    location: string;
    photo: string;
    bio: string;
    video: string;
    website: string;
    linkedIn: string;
    facebook: string;
    instagram: string;
    twitter: string;
    audit: IAudit;
}

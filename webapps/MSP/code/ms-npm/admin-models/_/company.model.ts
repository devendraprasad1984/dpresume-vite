import { CompanyCategory } from "../../company-models";
import { IAudit } from "../../base-models";

/**
 * Company model
 */
export interface ICompany {
    id: number;
    name: string;
    adminContact: string;
    adminEmail: string;
    category: CompanyCategory;
    established: number;
    location: string;
    status: string;
    photo?: string;
    bio: string;
    video?: string;
    website?: string;
    linkedIn?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    audit: IAudit;
}

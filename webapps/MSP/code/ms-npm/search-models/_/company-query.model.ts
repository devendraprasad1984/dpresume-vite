import { IPagination } from "./pagination.model";

/**
 * Company filter request
 */
export interface ICompanyQuery {
    keyword: string;
    location: string[];
    industry: string[];
    hasOpenJobs?: boolean;
    pagination?: IPagination;
}

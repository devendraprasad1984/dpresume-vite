import { IPagination } from "./pagination.model";

/**
 * People filter query
 */
export interface IPeopleQuery {
    keyword?: string;
    location?: string[];
    experience?: string[];
    school?: string[];
    company?: string[];
    industry?: string[];
    intent?: string[];
    pagination?: IPagination;
}

import { IAudit } from "../../base-models";

/**
 * Note model
 */
export interface INote {
    id: number;
    userId: number;
    status: string;
    text: string;
    audit: IAudit;
}

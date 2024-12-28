/**
 * Audit declarations
 */
export interface IAudit {
    createdOn: Date | string;
    createdBy: string;
    modifiedOn: Date | string;
    modifiedBy: string;
}

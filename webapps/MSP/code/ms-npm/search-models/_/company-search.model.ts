/**
 * Company filter result
 */
export interface ICompanySearch {
    companyId: number;
    companyRef: string;
    name: string;
    category: string;
    location: string;
    connectionNumber: number;
    picture: string;
    isUserConnected: boolean;
}

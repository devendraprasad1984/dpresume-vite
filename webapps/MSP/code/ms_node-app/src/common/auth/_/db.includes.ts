import { User, Personnel, Company, Info } from "../../db/client-mysql";
/**
 * Type used to return auth included models
 */
export type AuthUserInclude = User & {
    Personnel: (Personnel & {
        Company: Company & {
            Info: Info[];
        };
    })[];
};

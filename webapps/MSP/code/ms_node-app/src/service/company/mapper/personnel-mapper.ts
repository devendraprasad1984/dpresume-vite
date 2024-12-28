import { ModelMapper } from "ms-npm/model-mapper";
import { Role } from "ms-npm/auth-models";
import { IPersonnelSearch } from "ms-npm/company-models";

import { RecordStatus } from "/opt/nodejs/node14/db/enums";

import { PersonnelInclude } from "../db.includes";
/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * From db model declaration
     */
    fromDbPersonnelSearchModel(personnel: PersonnelInclude): IPersonnelSearch;
}
/**
 * Model mapper class implementation
 */
export class PersonnelMapper extends ModelMapper implements IModelMapper {
    /**
     * User delete implementation
     *
     * @param {PersonnelInclude} personnel Data source object
     * @returns {IPersonnelSearch} Return converted data to UI model.
     */
    fromDbPersonnelSearchModel(personnel: PersonnelInclude): IPersonnelSearch {
        const profile = personnel.User.Profile[0];
        const userSearch: IPersonnelSearch = {
            id: personnel.Id,
            status: personnel.Status,
            role: <Role>personnel.Role,
            companyId: personnel.CompanyId,
            user: {
                id: personnel.User.Id,
                ref: personnel.User.Ref,
                role: <Role>personnel.User.Role,
                sub: personnel.User.Sub,
                lastLogin: personnel.User.LastLogin,
                status: <RecordStatus>personnel.User.Status,
                companyHeadline: profile.CompanyHeadline,
                email: profile?.Email ? profile.Email : "",
                firstName: profile.FirstName,
                lastName: profile.LastName,
                notesCount: personnel.User.Note ? personnel.User.Note.length : 0,
                headline: profile.Headline,
                pronouns: profile.Pronouns,
                picture: profile.Picture,
                isOnline: false,
                audit: {
                    createdBy: personnel.CreatedBy,
                    createdOn: personnel.CreatedOn,
                    modifiedBy: personnel.ModifiedBy,
                    modifiedOn: personnel.ModifiedOn
                }
            }
        };

        return userSearch;
    }
}

import {Hasher, StringFormatter, UtcDate} from "fnpm/utils";

import {ModelMapper} from "ms-npm/model-mapper";
import {ICompany, ICompanyAdmin, IUserSearch} from "ms-npm/admin-models";
import {CompanyCategory, IInfo} from "ms-npm/company-models";
import {IUserIdentity, Role} from "ms-npm/auth-models";
import {State} from "ms-npm/base-models";

import {Personnel, Company, Profile} from "/opt/nodejs/node14/db/client-mysql";
import {RecordStatus} from "/opt/nodejs/node14/db/enums";

import {CompanyInclude, UserInclude} from "../db.includes";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * From db to Company model method declaration
     */
    fromDBToCompany(source: CompanyInclude): ICompany;

    /**
     * To db Personnel model method declaration
     */
    toDbPersonnel(user: IUserIdentity, userId: number, companyId: number, role: string): Personnel;

    /**
     * To db Company model method declaration
     */
    toDbCompany(user: IUserIdentity): Company;

    /**
     * From db to Company model method declaration
     */
    fromDbUserModel(user: UserInclude): IUserSearch;
}

/**
 * Model mapper class implementation
 */
export class AdminMapper extends ModelMapper implements IModelMapper {
    /**
     * Mapper method to convert db model to object
     *
     * @param {object} source db model to be converted
     * @returns {T} converted object
     */
    fromDBToCompany(source: CompanyInclude): ICompany {
        const map: ICompany = {
            id: source.Id,
            info: {
                id: source.Info[0] === undefined ? null : source.Info[0].Id,
                name: source.Info[0] === undefined ? null : source.Info[0].Name,
                category: source.Info[0] === undefined ? null : (source.Info[0].Category as CompanyCategory),
                state: source.Info[0]?.State === undefined ? null : State[source.Info[0].State.replace(/\s/g, "_")],
                city:
                    source.Info[0]?.City === undefined ? null : StringFormatter.capitalizeSentence(source.Info[0].City),
                established: undefined,
                bio: undefined,
                status: source.Status
            } as IInfo,
            admin: {
                userId: source.Personnel[0] === undefined ? null : source.Personnel[0].UserId,
                profileId: source.Personnel[0] === undefined ? null : source.Personnel[0].User.Profile[0].Id,
                personnelId: source.Personnel[0] === undefined ? null : source.Personnel[0].Id,
                contact:
                    source.Personnel[0] === undefined
                        ? null
                        : [
                            source.Personnel[0].User.Profile[0].FirstName,
                            source.Personnel[0].User.Profile[0].LastName
                        ].join(" "),
                email: source.Personnel[0] === undefined ? null : source.Personnel[0].User.Profile[0].Email
            } as ICompanyAdmin,
            audit: undefined
        };
        return map;
    }

    /**
     * Mapper method to generate DB Personnel Model
     *
     * @param {IUserIdentity} user user identity
     * @param {number} userId user company owner id
     * @param {number} companyId company id
     * @param {string} role role
     * @returns {Personnel} personnel model
     */
    toDbPersonnel(user: IUserIdentity, userId: number, companyId: number, role: string): Personnel {
        const newPersonnel: Personnel = {
            Id: 0,
            UserId: userId,
            CompanyId: companyId,
            Status: RecordStatus.Active,
            Role: role,
            CreatedOn: UtcDate.now(),
            CreatedBy: user.ref,
            ModifiedOn: undefined,
            ModifiedBy: undefined
        };
        return newPersonnel;
    }

    /**
     * Mapper method to generate DB Company Model
     *
     * @param {IUserIdentity} user user identity
     * @returns {Company} company model
     */
    toDbCompany(user: IUserIdentity): Company {
        const newCompany: Company = {
            Id: 0,
            Ref: Hasher.guid(),
            Status: RecordStatus.Active,
            CreatedOn: UtcDate.now(),
            CreatedBy: user.ref,
            ModifiedOn: undefined,
            ModifiedBy: undefined
        };
        return newCompany;
    }

    /**
     * User delete implementation
     *
     * @param {UserInclude} user Data source object
     * @returns {IUserSearch} Return converted data to UI model.
     */
    fromDbUserModel(user: UserInclude): IUserSearch {
        let profile: Profile;

        if (user.Profile && user.Profile.length > 0) {
            profile = user.Profile[0];
        }

        const userSearch: IUserSearch = {
            id: user.Id,
            ref: user.Ref,
            role: <Role>user.Role,
            sub: user.Sub,
            lastLogin: user.LastLogin,
            status: <RecordStatus>user.Status,
            companyHeadline: profile.CompanyHeadline,
            email: profile?.Email ? profile.Email : "",
            firstName: profile.FirstName,
            lastName: profile.LastName,
            notesCount: user.Note ? user.Note.length : 0,
            headline: profile.Headline,
            pronouns: profile.Pronouns,
            picture: profile.Picture,
            isOnline: false,
            audit: {
                createdBy: user.CreatedBy,
                createdOn: user.CreatedOn,
                modifiedBy: user.ModifiedBy,
                modifiedOn: user.ModifiedOn
            }
        };

        return userSearch;
    }
}

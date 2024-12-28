import objectMapper from "object-mapper";

import { ModelMapper } from "ms-npm/model-mapper";
import { CompanyInclude, PersonnelInclude } from "../db.includes";
import { ICompanySearch, PeopleConnectedStatus } from "ms-npm/search-models";
import { Info } from "/opt/nodejs/node14/db/client-mysql";
import { ILocation, State } from "ms-npm/base-models";
import { CompanyCategory } from "ms-npm/company-models";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * From db model declaration
     */
    fromDbCompanySearchhModel(personnel: CompanyInclude, connections: PersonnelInclude[]): ICompanySearch;
}
/**
 * Model mapper class implementation
 */
export class CompanyMapper extends ModelMapper implements IModelMapper {
    /**
     * User delete implementation
     *
     * @param {CompanyInclude} company DB company info
     * @param {PersonnelInclude[]} connections User current connections
     * @returns {IPersonnelSearch} Return converted data to UI model.
     */
    fromDbCompanySearchhModel(company: CompanyInclude, connections: PersonnelInclude[]): ICompanySearch {
        const info = company.Info[0];

        const companySearch: ICompanySearch = {
            companyId: company.Id,
            companyRef: company.Ref,
            info: {
                id: info?.Id,
                name: info?.Name ? info.Name : undefined,
                category: info?.Category ? (info.Category as CompanyCategory) : undefined,
                city: info?.City ? info?.City : undefined,
                state: info?.State ? State[info.State.replace(/\s/g, "_")] : undefined,
                picture: info?.Photo ? info.Photo : undefined
            },
            connectStatus: connections.some((p: PersonnelInclude) => p.CompanyId == company.Id)
                ? PeopleConnectedStatus.Connected
                : PeopleConnectedStatus.NotConnected,
            connectionNumber: company._count.Personnel
        };

        return companySearch;
    }

    /**
     * User delete implementation
     *
     * @param {Info} source Company info
     * @returns {ILocation} Return converted data to UI model.
     */
    fromDbLocationModel(source: Info): ILocation {
        const map = {
            City: "city?",
            State: "state?",
            CreatedOn: "audit.createdOn?",
            CreatedBy: "audit.createdBy?",
            ModifiedOn: "audit.modifiedOn?",
            ModifiedBy: "audit.modifiedBy?"
        };

        const location: ILocation = objectMapper.merge(source, map) as unknown as ILocation;

        return location ?? <ILocation>{};
    }
}

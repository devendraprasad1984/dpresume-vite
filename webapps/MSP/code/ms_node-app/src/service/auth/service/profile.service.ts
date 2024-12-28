import {inject, injectable} from "tsyringe";

import {ApiError} from "fnpm/core";
import {Status} from "fnpm/enums";

import {Profile, Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {IModelSelect, ISort, IWhereFilter} from "/opt/nodejs/node14/db/models";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";

/**
 *  Profile Service declarations
 */
interface IProfileService {
    /**
     * Filter profile method declaration
     *
     */
    filter(
        filter?: IWhereFilter<Profile>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Profile[]>;
}

/**
 * Profile service implementation
 */
@injectable()
export class ProfileService implements IProfileService {
    /**
     * Profile Controller constructor
     *
     * @param {DbRepo<MySqlClient>} service database service dependency
     */
    constructor(@inject("Db") private service: DbRepo<MySqlClient>) {
    }

    /**
     * Get profile array
     *
     * @param {IWhereFilter<Profile>} filter Query parameter
     * @param {ISort} orderBy Order by fields indications
     * @param {number} skip Number of records to skip on query
     * @param {number} take Number of records returned on the query
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<Profile[]>} Return promise with profile array
     */
    async filter(
        filter?: IWhereFilter<Profile>,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<Profile[]> {
        try {
            return this.service.retrieve<Profile>(
                Prisma.ModelName.Profile,
                filter,
                undefined,
                orderBy,
                skip,
                take,
                select
            );
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

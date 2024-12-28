import {injectable} from "tsyringe";

import {ApiError, IPaginationResponse} from "fnpm/core";
import {Status} from "fnpm/enums";
import {StringFormatter, UtcDate} from "fnpm/utils";
import {Any} from "fnpm/types";

import {Prisma} from "/opt/nodejs/node14/db/client-mysql";
import {ClientType, RecordStatus} from "./enums";
import {IDbQueryFilter, IModelInclude, IModelSelect, ISort, IWhereFilter} from "./models";
import {DbClient} from "./db.client";

import {Value} from "./client-mysql/runtime";

/**
 * Repository pattern declaration
 */
export interface IDbRepo<TClient> {
    // declarations

    connection: TClient;

    /**
     * Create record declaration
     */
    create<T extends { Id: number; Ref?: string }>(model: string, record: T): Promise<T>;

    /**
     * Create record declaration
     */
    createMany<T extends { Id: number; Ref?: string }>(model: string, record: T[]): Promise<{ count: number }>;

    /**
     * Retrieve record declaration
     */
    retrieve<T extends { Id: number; Ref?: string }>(
        model: string,
        filter: IWhereFilter<T>,
        includes?: IModelInclude,
        orderBy?: ISort,
        skip?: number,
        take?: number
    ): Promise<T[]>;

    /**
     * Retrieve record paginated declaration
     */
    retrievePaginated<TModel extends { Id: number; Ref?: string }>(
        model: string,
        orderBy: ISort,
        take: number,
        page: number,
        filter?: IWhereFilter<TModel>,
        modelInclude?: IModelInclude,
        select?: IModelSelect
    ): Promise<IPaginationResponse<TModel[]>>;

    /**
     * Retrieve unique record declaration
     */
    retrieveUnique<T extends { Id: number; Ref?: string }>(
        model: string,
        filter: IWhereFilter<T>,
        includes?: IModelInclude
    ): Promise<T>;

    /**
     * Update record declaration
     */
    update<T extends { Id: number; Ref?: string }>(model: string, id: number, newRecord: Partial<T>): Promise<T>;

    /**
     * Update many record declaration
     */
    updateMany<T extends { Id: number; Ref?: string }>(
        model: string,
        filter: IWhereFilter<T>,
        newRecord: Partial<T>
    ): Promise<{ count: number }>;

    /**
     * Delete record declaration
     */
    delete<T extends { Id: number; Ref?: string }>(
        model: string,
        id: number,
        hard: boolean,
        userRef?: string
    ): Promise<T>;

    /**
     * Delete many record declaration
     */
    deleteMany<T extends { Id: number; Ref?: string }>(
        model: string,
        filter: IWhereFilter<T>,
        hard: boolean
    ): Promise<{ count: number }>;

    /**
     * Return count for specific table and filter
     */
    count<TModel>(model: string, filter?: IWhereFilter<TModel>): Promise<number>;

    /**
     * Execute a specific raw query to execute transactional operations
     *
     */
    executeQuery(query: readonly string[], ...values: Value[]): Promise<number>;
}

/**
 * User service implementation
 */
@injectable()
export class DbRepo<TClient> implements IDbRepo<TClient> {
    //properties
    private _dbClient: TClient;

    /**
     * Repo constructor
     *
     * @param {ClientType} clientType Type of database client
     */
    constructor(clientType: ClientType) {
        const catalog = new DbClient<TClient>(clientType);

        catalog.init();
        this._dbClient = catalog.client;
    }

    /**
     * Get the object to perform database actions
     *
     * @returns {TClient} Database connection object
     */
    get connection(): TClient {
        return this._dbClient;
    }

    /**
     * Insert data
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {TModel} record New user information
     * @returns {Promise<TModel>} promise of service response of type T[]
     */
    async create<TModel extends { Id: number; Ref?: string }>(model: string, record: TModel): Promise<TModel> {
        try {
            //Remove Id to avoid problem with the database auto increment
            delete record.Id;
            const name: string = StringFormatter.firstCharToLower(model);
            return this._dbClient[name].create({data: {...record}});
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Insert more than 1 record at once
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {TModel[]} record New records information
     * @returns {Promise<IServiceResponse<TModel>>} promise of service response of type T[]
     */
    createMany<TModel extends { Id: number; Ref?: string }>(
        model: string,
        record: TModel[]
    ): Promise<{ count: number }> {
        try {
            const name: string = StringFormatter.firstCharToLower(model);
            return this._dbClient[name].createMany({data: Array.from(record)});
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Retrieve data
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {IWhereFilter<TModel>} filter Query parameters for the record
     * @param {IModelInclude} modelInclude Name of models included on query, if filter is undefined, models won't be included
     * @param {ISort} orderBy Sort options for the query
     * @param {number} skip pagination - Number of records to skip on the query (ignored if undefined)
     * @param {number} take pagination - Number of records returned on the query (ignored if undefined)
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<TModel[]>} promise of service response of type T[]
     */
    async retrieve<TModel extends { Id: number; Ref?: string }>(
        model: string,
        filter?: IWhereFilter<TModel>,
        modelInclude?: IModelInclude,
        orderBy?: ISort,
        skip?: number,
        take?: number,
        select?: IModelSelect
    ): Promise<TModel[]> {
        try {
            if (modelInclude !== undefined && select !== undefined) {
                throw new ApiError(
                    Status.Conflict,
                    "Validation error: modelInclude and select should not be used on the same level."
                );
            }

            const queryFilter: IDbQueryFilter<TModel> = <IDbQueryFilter<TModel>>{
                orderBy,
                skip,
                take,
                select
            };

            if (filter != undefined) {
                queryFilter.where = {...filter};
                queryFilter.include = modelInclude !== undefined ? {...modelInclude} : undefined;
            }
            const modelName: string = StringFormatter.firstCharToLower(model);
            return this._dbClient[modelName].findMany(queryFilter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Retrieve data
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {ISort} orderBy Sort options for the query
     * @param {number} take pagination - Number of records returned on the query
     * @param {number} page pagination - current page requested (ignored if undefined)
     * @param {IWhereFilter<TModel>} filter Query parameters for the record
     * @param {IModelInclude} modelInclude Name of models included on query, if filter is undefined, models won't be included
     * @param {IModelSelect} select Retrieved fields on query
     * @param {Any | Any[]} distinct Distinct fields on query
     * @returns {Promise<IPaginationResponse<TModel[]>>} promise of service response of type IPaginationResponse<TModel[]>
     */
    async retrievePaginated<TModel extends { Id: number; Ref?: string }>(
        model: string,
        orderBy: ISort,
        take: number,
        page: number,
        filter?: IWhereFilter<TModel>,
        modelInclude?: IModelInclude,
        select?: IModelSelect,
        distinct?: Any | Any[]
    ): Promise<IPaginationResponse<TModel[]>> {
        try {
            if (modelInclude !== undefined && select !== undefined) {
                throw new ApiError(
                    Status.Conflict,
                    "Validation error: modelInclude and select should not be used on the same level."
                );
            }

            const modelName: string = StringFormatter.firstCharToLower(model);
            const paginationResponse: IPaginationResponse<TModel[]> = {
                currentPage: page,
                lastPage: 0,
                totalCount: 0,
                data: []
            };
            //Pagination logic
            paginationResponse.totalCount = await this.count(model, filter);
            paginationResponse.lastPage = Math.ceil(paginationResponse.totalCount / take);
            const skip = (paginationResponse.currentPage - 1) * take;

            const queryFilter: IDbQueryFilter<TModel> = <IDbQueryFilter<TModel>>{
                orderBy,
                skip,
                take,
                select,
                distinct
            };

            if (filter != undefined) {
                queryFilter.where = {...filter};
                queryFilter.include = modelInclude !== undefined ? {...modelInclude} : undefined;
            }

            paginationResponse.data = await this._dbClient[modelName].findMany(queryFilter);
            return paginationResponse;
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Retrieve data
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {IWhereFilter<TModel>} filter Query parameters for the record
     * @param {IModelInclude} modelInclude Name of models included on query, if filter is undefined, models won't be included
     * @param {IModelSelect} select Retrieved fields on query
     * @returns {Promise<TModel[]>} promise of service response of type T[]
     */
    async retrieveUnique<TModel extends { Id: number; Ref?: string }>(
        model: string,
        filter?: IWhereFilter<TModel>,
        modelInclude?: IModelInclude,
        select?: IModelSelect
    ): Promise<TModel> {
        try {
            const queryFilter: IDbQueryFilter<TModel> = <IDbQueryFilter<TModel>>{select};

            if (filter != undefined) {
                queryFilter.where = {...filter};
                queryFilter.include = modelInclude !== undefined ? {...modelInclude} : undefined;
            }

            const modelName: string = StringFormatter.firstCharToLower(model);
            return this._dbClient[modelName].findUnique(queryFilter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update data
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {number} id Record id number
     * @param {Partial<TModel>} newRecord New information to save on DB
     * @returns {Promise<T>} promise of service response of type User[]
     */
    async update<TModel extends { Id: number; Ref?: string }>(
        model: string,
        id: number,
        newRecord: Partial<TModel>
    ): Promise<TModel> {
        try {
            //Remove properties that can't be updated
            delete newRecord.Id;
            delete newRecord.Ref;
            const modelName: string = StringFormatter.firstCharToLower(model);
            return this._dbClient[modelName].update({
                where: {Id: id},
                data: {...newRecord}
            });
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Delete data
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {number} id Record id number
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @param {string} userRef Reference the user that is deleting the record
     * @returns {Promise<TModel>} promise of service response of type User[]
     */
    async delete<TModel extends { Id: number; Status?: string; Ref?: string; ModifiedBy?: string; ModifiedOn?: Date }>(
        model: string,
        id: number,
        isHard?: boolean,
        userRef?: string
    ): Promise<TModel> {
        try {
            if (isHard) {
                const modelName: string = StringFormatter.firstCharToLower(model);
                return await this._dbClient[modelName].delete({where: {Id: id}});
            } else {
                const updateData: Partial<TModel> = <TModel>{};
                updateData.Status = RecordStatus.Archived;
                updateData.ModifiedBy = userRef ?? "";
                updateData.ModifiedOn = UtcDate.now();

                return this.update(model, id, updateData);
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Update more than 1 record at once
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {IWhereFilter<TModel>} filter Records filter
     * @param {Partial<TModel>} newRecord New information to save on DB
     * @returns {Promise<TModel>} promise of TModel
     */
    async updateMany<TModel extends { Id: number; Ref?: string }>(
        model: string,
        filter: IWhereFilter<TModel>,
        newRecord: Partial<TModel>
    ): Promise<{ count: number }> {
        try {
            //Remove properties that can't be updated
            delete newRecord.Id;
            delete newRecord.Ref;
            const modelName: string = StringFormatter.firstCharToLower(model);
            return this._dbClient[modelName].updateMany({
                where: {...filter},
                data: {...newRecord}
            });
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Delete more than 1 record at once
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {IWhereFilter<TModel>} filter Records filter
     * @param {boolean} isHard Indicates if it is a hard or soft delete
     * @returns {Promise<TModel>} promise of TModel
     */
    async deleteMany<TModel extends { Id: number; Status?: string; Ref?: string }>(
        model: string,
        filter: IWhereFilter<TModel>,
        isHard?: boolean
    ): Promise<{ count: number }> {
        try {
            if (isHard) {
                const modelName: string = StringFormatter.firstCharToLower(model);
                const queryFilter: IDbQueryFilter<TModel> = {};
                queryFilter.where = {...filter};

                return this._dbClient[modelName].deleteMany(queryFilter);
            } else {
                const updateData: Partial<TModel> = <TModel>{};
                updateData.Status = RecordStatus.Archived;
                return this.updateMany(model, filter, updateData);
            }
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Return count for specific table and filter
     *
     * @param {string} model Name of the model that will be used on the method
     * @param {IWhereFilter<TModel>} filter Query parameters for the record
     * @returns {Promise<number>} promise of service response of type number
     */
    async count<TModel>(model: string, filter?: IWhereFilter<TModel>): Promise<number> {
        try {
            const modelName: string = StringFormatter.firstCharToLower(model);
            const queryFilter: IDbQueryFilter<TModel> = {};
            if (filter != undefined) {
                queryFilter.where = {...filter};
            }
            return this._dbClient[modelName].count(queryFilter);
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Execute a specific queryTemplate for stored procedures or view queries
     *
     * @param {string[]} query query to be executed
     * @param {Value[]} values values of parameter
     * @returns {Promise<T>} promise of service response of type T
     */
    async rawQuery<T>(query: readonly string[], ...values: Value[]): Promise<T> {
        try {
            return await this._dbClient["$queryRaw"]<T>(Prisma.sql(query, ...values));
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }

    /**
     * Execute a specific raw query to execute transactional operations
     *
     * @param {string[]} query query to be executed
     * @param {Value[]} values values of parameter
     * @returns {Promise<number>} promise of service response of type number
     */
    async executeQuery(query: readonly string[], ...values: Value[]): Promise<number> {
        try {
            return await this._dbClient["$executeRaw"](Prisma.sql(query, ...values));
        } catch (ex) {
            throw new ApiError(Status.Conflict, ex.message);
        }
    }
}

module.exports = {DbRepo};

import {Any} from "fnpm/types";

import {SortOrder} from "../enums";

/**
 * Interface to emulate generic behavior of Prisma class
 */
export interface IInclude {
    include: IModelInclude | null;
}

/**
 * Interface to emulate generic behavior of Prisma class
 */
export interface ISelect {
    select: IModelSelect | boolean;
}

/**
 * Interface to indicate properties for the model include in queries
 */
export interface IModelInclude {
    [root: string]: IInclude | ISelect | boolean;
}

/**
 * Interface to indicate properties for the model include in queries
 */
export interface IModelSelect {
    [root: string]: boolean | ISelect;
}

/**
 * interfaces that allows the sorting on query
 */
export interface ISort {
    [root: string]: SortOrder | ISort;
}

/**
 * Interface that contains the same behavior of the Prisma Where class
 */
export interface IWhere<T> {
    AND?: T | T[];
    OR?: T | T[];
    NOT?: T | T[];
}

/**
 *  Object that will be use for filter the query
 */
export interface IDbQueryFilter<T> {
    where?: IWhereFilter<T>;
    include?: IModelInclude;
    select?: IModelSelect;
    orderBy?: ISort;
    skip?: number;
    take?: number;
    distinct?: Any | Any[];
}

/**
 * Methods used by Prisma to filter data
 */
interface IWhereAction {
    equals?: Any;
    in?: Any;
    notIn?: Any;
    lt?: Any;
    lte?: Any;
    gt?: Any;
    gte?: Any;
    not?: Any;
    contains?: Any;
    startsWith?: Any;
    endsWith?: Any;
    _count?: Any;
    _avg?: Any;
    _sum?: Any;
    _min?: Any;
    _max?: Any;
}

/**
 * Create new type with the current property types and property actions
 */
type Model<T> = {
    [P in keyof T]?: T[P] | IWhereAction;
};

/**
 * Type that include method actions and conditions
 */
export type IWhereFilter<T> = Model<T> & IWhere<Model<T>>;

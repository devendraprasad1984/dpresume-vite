import {StringFormatter} from "fnpm/utils";
import objectMapper from "object-mapper";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * To db model method declaration
     */
    toDbModel<T>(source: object): T;

    /**
     * From db model declaration
     */
    fromDbModel<T>(source: object): T;
}

/**
 * Model mapper class implementation
 */
export class ModelMapper implements IModelMapper {
    /**
     * Mapper method to convert object to Db model
     *
     * @param {object} source source object to be mapped to db model
     * @returns {T} mapped db model
     */
    toDbModel<T>(source: object): T {
        let map = {};

        Object.keys(source).forEach((key: string) => {
            map = {...map, [StringFormatter.firstCharToLower(key)]: StringFormatter.firstCharToUpper(key)};
        });

        return objectMapper.merge(source, map) as unknown as T;
    }

    /**
     * Mapper method to conert db model to object
     *
     * @param {object} source db model to be converted
     * @returns {T} converted object
     */
    fromDbModel<T>(source: object): T {
        let map = {};

        Object.keys(source).forEach((key: string) => {
            map = {...map, [StringFormatter.firstCharToUpper(key)]: `${StringFormatter.firstCharToLower(key)}?`};
        });

        //Add the audit fields

        map = {
            ...map,

            CreatedOn: "audit.createdOn?",

            CreatedBy: "audit.createdBy?",

            ModifiedOn: "audit.modifiedOn?",

            ModifiedBy: "audit.modifiedBy?"
        };

        return objectMapper.merge(source, map) as unknown as T;
    }
}

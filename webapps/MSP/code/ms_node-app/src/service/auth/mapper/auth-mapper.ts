import objectMapper from "object-mapper";
import {Role} from "ms-npm/auth-models";
import {UtcDate} from "fnpm/utils";

import {RecordStatus} from "/opt/nodejs/node14/db/enums";
import {User} from "/opt/nodejs/node14/db/client-mysql";

/**
 * Model mapper declarations
 */
interface IModelMapper {
    /**
     * To db model method declaration
     */
    toDbModelAuth0<T>(source: object): T;
}

/**
 * Model mapper class implementation
 */
export class AuthMapper implements IModelMapper {
    /**
     * Mapper method to convert object to Db model
     *
     * @param {object} source source object to be mapped to db model
     * @returns {IProfile} mapped db model
     */
    toDbModelAuth0<T>(source: object): T {
        const map = {
            id: "Id",
            userId: "Auth0User",
            sub: "Sub",
            email: "Email",
            emailVerified: "EmailVerified",
            picture: "Picture",
            provider: "Provider",
            lastIp: "LastIp",
            lastLogin: "LastLogin",
            createdAt: "CreatedAt"
        };
        return objectMapper.merge(source, map) as unknown as T;
    }

    /**
     * Mapper method to convert object to Db User model
     *
     * @param {string} sub auth0 sub
     * @param {string} userRef userRef
     * @returns {User} mapped db model
     */
    toDbModelUser(sub: string, userRef: string): User {
        const user: User = {
            Id: 0,
            Ref: userRef,
            Status: RecordStatus.Active,
            Role: Role.User,
            Sub: sub,
            LastLogin: UtcDate.now(),
            CreatedOn: UtcDate.now(),
            CreatedBy: userRef,
            ModifiedOn: undefined,
            ModifiedBy: undefined
        };

        return user;
    }
}

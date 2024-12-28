import {injectable} from "tsyringe";

import {IServiceRequestHeader, ServiceRequest} from "fnpm/core";
import {Header, Method} from "fnpm/enums";

/**
 * User info model (Auth0)
 */
export interface IAuthZeroUser {
    sub: string;
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    picture: string;
    locale: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
}

/**
 * Auth0 service declarations
 */
interface IAuthZeroService {
    /**
     * get user info method declaration
     *
     * @param {string} domain auth0 tenant domain
     * @param {string} accessToken access token from Auth0
     * @returns {Promise<IAuthZeroUser>} user info as promise
     */
    getUserInfo(domain: string, accessToken: string): Promise<IAuthZeroUser>;
}

/**
 * Auth0 Service implementation
 */
@injectable()
export class AuthZeroService implements IAuthZeroService {
    /**
     * Get user info implementation
     *
     * @param {string} domain auth 0 tenant domain
     * @param {string} accessToken access token from Auth0
     * @returns {Promise<IAuthZeroUser>} user info as promise
     */
    async getUserInfo(domain: string, accessToken: string): Promise<IAuthZeroUser> {
        const req: ServiceRequest<undefined, IAuthZeroUser> = new ServiceRequest();
        req.url = [domain, "userinfo"].join("/");
        req.method = Method.GET;
        const authHeader: IServiceRequestHeader = {name: Header.Authorization, value: `${accessToken}`};
        req.headers = [authHeader];

        return req.send();
    }
}

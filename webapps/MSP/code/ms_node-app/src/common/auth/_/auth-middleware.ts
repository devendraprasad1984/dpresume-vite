import {injectable} from "tsyringe";
import Express, {RequestHandler} from "express";

import {EncryptionType, Header, Message, Status} from "fnpm/enums";
import {Checker} from "fnpm/validators";
import {Encoder, Encryptor} from "fnpm/utils";

import {Role, MSRole, IMetadata} from "ms-npm/auth-models";

/**
 * Auth middleware declarations
 */
interface IAuthMiddleware {
    // properties

    /**
     * Initialize method declaration
     */
    init(app: Express.Application): void;

    /**
     * Authorize method declaration
     */
    authorize(msRoles: MSRole[], ...roles: Role[]): RequestHandler;
}

/**
 * Auth class with authorization middleware
 */
@injectable()
export class AuthMiddleware implements IAuthMiddleware {
    // properties

    private _metadata: IMetadata;

    /**
     * getter for metadata
     *
     * @returns {IMetadata} parsed metadata from encrypted/encoded header
     */
    get metadata(): IMetadata {
        return this._metadata;
    }

    /**
     * Initialize
     *
     * @param {Express.Application} app express instance
     */
    init(app: Express.Application): void {
        if (process.env.NODE_ENV !== "test") {
            this.identityToken(app);
        }
    }

    /**
     * Authorize middleware
     *
     * @param {...MSRole[]?} msRoles array of MS roles that is authorized to access the route
     * @param {...Role[]} roles array of roles that is authorized to access the route
     * @returns {RequestHandler} request handler
     */
    authorize(msRoles: MSRole[], ...roles: Role[]): RequestHandler {
        // check if param role matches authorization rules (authorization-rules.json as source)
        return (req: Express.Request, res: Express.Response, next: Express.NextFunction): void => {
            if (msRoles.length > 0 && roles.length > 0) {
                next();
            }
            /*if (process.env.NODE_ENV !== "test") {
                const header = req?.headers[Header.Authorization.toLowerCase()]?.toString();
                if (header) {
                    const bearerToken: string | undefined =
                        header.indexOf("Bearer") >= 0 ? header.split(" ")[1].toString() : undefined;
                    if (!Checker.isNullOrEmpty(bearerToken)) {
                        // parse
                        const t: IToken = this.token.parse(bearerToken);
                        if (t) {*/
            /*const allRoles: string[] = (Object.values(roles) as string[]).concat(
                    Object.values(msRoles) as string[]
                );

                if (allRoles.find((x: string) => x == t.user.role)) {
                
                next();
                } else {
                    // Role not found, no access
                    res.status(Status.Unauthorized).json(Message.Unauthorized).end();
                }
                } else {
                            // invalid token
                            res.status(Status.Unauthorized).json(Message.InvalidToken);
                        }
                    } else {
                        // token empty
                        res.status(Status.Unauthorized).json(Message.Forbidden).end();
                    }
                } else {
                    // missing authorization header
                    res.status(Status.Unauthorized).json(Message.MissingAuthorizationHeader).end();
                }
            } else {
                next();
            }*/
        };
    }

    /**
     * Authentication middleware
     *
     * @param {Express.Application} app express instance
     */
    private identityToken(app: Express.Application): void {
        app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction): void => {
            const authHeader = req?.headers[Header.Authorization.toLowerCase()]?.toString();

            if (authHeader) {
                const accessToken: string | undefined =
                    authHeader.indexOf("Bearer") >= 0 ? authHeader.split(" ")[1].toString() : undefined;

                if (!Checker.isNullOrEmpty(accessToken)) {
                    const accessTokenSegments: string[] = accessToken.split(".");
                    const key: string = accessTokenSegments[accessTokenSegments.length - 1];

                    const metadata = req?.headers[Header.Metadata.toLowerCase()]?.toString();
                    if (metadata) {
                        const cipher: string = Encoder.fromBase64(metadata);
                        this._metadata = JSON.parse(Encryptor.decrypt(EncryptionType.AES, cipher, key)) as IMetadata;

                        next();
                    } else {
                        // no metadata header
                        res.status(Status.BadRequest).json(Message.MissingMetadataHeader).end();
                    }
                } else {
                    // token empty
                    res.status(Status.Unauthorized).json(Message.Unauthorized).end();
                }
            } else {
                // missing authorization header
                res.status(Status.Unauthorized).json(Message.MissingAuthorizationHeader).end();
            }
        });
    }
}

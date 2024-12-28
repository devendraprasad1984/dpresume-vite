import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";

import {Header, MimeType, Status} from "fnpm/enums";
import {IApiResponse, CorsHeaders} from "fnpm/core";

import {Route} from "ms-npm/routes/auth";
import {IAuthResponse, MSRole, Role} from "ms-npm/auth-models";

import {AuthMiddleware} from "/opt/nodejs/node14/auth";
import {IConfig} from "/opt/nodejs/node14/config/config.model";

import {AuthController} from "./controllers/auth.controller";

const router: Express.Router = Express.Router();

/**
 * Routes model declarations
 */
interface IRoutes {
    // declarations
    /**
     * Register method declaration
     */
    register(app: Express.Application, config: IConfig): void;
}

/**
 * Class that provides methods to register routes
 */
@injectable()
export class Routes implements IRoutes {
    /**
     * Routes controller
     *
     * @param {AuthMiddleware} auth auth middleware
     * @param {AuthController} controller controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => AuthController)) private controller: AuthController
    ) {
    }

    // methods
    /**
     * Register routes
     *
     * @param {Express.Application} app express instance
     * @param {IConfig} config merged config
     */
    register(app: Express.Application, config: IConfig): void {
        app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            // set default Content-Type header to application/json MimeType
            res.header[Header.ContentType] = MimeType.ApplicationJson;
            CorsHeaders.set(res);
            next();
        });

        // set authorization
        //this.auth.init(app);

        this.setRoutes(config);

        this.controller.config = config;

        app.use(router);

        // not found route
        app.use((req: Express.Request, res: Express.Response) => {
            res.status(Status.NotFound).json(res.statusMessage);
        });
    }

    /**
     * Set routes
     *
     * @param {IConfig} config merged config
     */
    private setRoutes(config: IConfig): void {
        //Services routes
        //GET
        router.get(
            [config.service.prefix, config.service.route[Route.ping]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.controller.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //POST (Not related with basic CRUD)
        router.get(
            [config.service.prefix, config.service.route[Route.validate]].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const authHeader: string = req.headers[Header.Authorization.toLowerCase()].toString();
                    const r: IApiResponse<IAuthResponse> = await this.controller.authenticate(authHeader);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.connect], ":ref"].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.controller.createMsGroupChannel(req.params.ref);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //FILTER
        //CREATE
        //UPDATE
        //DELETE
    }
}

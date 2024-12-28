import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";
import {Header, MimeType, Status} from "fnpm/enums";
import {IApiResponse, CorsHeaders} from "fnpm/core";

import {Route} from "ms-npm/routes/schedule";

import {IConfig} from "/opt/nodejs/node14/config";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";

import {ScheduleController} from "./controllers/schedule.controller";

const router: Express.Router = Express.Router();

/**
 * Routes model declarations
 */
interface IRoutes {
    //declarations
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
     * @param {ScheduleController} controller controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => ScheduleController)) private controller: ScheduleController
    ) {
    }

    //methods
    /**
     * Register routes
     *
     * @param {Express.Application} app express instance
     * @param {IConfig} config merged config
     */
    register(app: Express.Application, config: IConfig): void {
        app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
            //set default Content-Type header to application/json MimeType
            res.header[Header.ContentType] = MimeType.ApplicationJson;
            CorsHeaders.set(res);
            next();
        });

        // set authorization
        this.auth.init(app);

        this.setRoutes(config);

        app.use(router);

        //Not Found route
        app.use((req: Express.Request, res: Express.Response) => {
            res.status(Status.NotFound).json(res.statusMessage);
        });
    }

    /**
     * Set routes
     *
     *@param {IConfig} config merged config
     */
    private setRoutes(config: IConfig): void {
        //Services routes
        //GET
        router.get(
            [config.service.prefix, config.service.route[Route.ping]].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.controller.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex.message)
                        .end();
                }
            }
        );

        //POST (Not related with basic CRUD)
        //FILTER
        //CREATE
        //UPDATE
        //DELETE
    }
}

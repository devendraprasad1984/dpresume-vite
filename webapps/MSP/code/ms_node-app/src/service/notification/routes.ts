import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";
import {Header, MimeType, Status} from "fnpm/enums";
import {IApiResponse, CorsHeaders} from "fnpm/core";

import {IConfig} from "/opt/nodejs/node14/config";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";
import {NotificationController} from "./controllers/notification.controller";

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
     * @param {NotificationController} notificationController notification controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => NotificationController)) private notificationController: NotificationController
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
            [config.service.prefix, config.service.route["ping"]].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.notificationController.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //POST
        router.post(
            [config.service.prefix, config.service.route["events"]].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.notificationController.notifyEvents();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );
    }
}

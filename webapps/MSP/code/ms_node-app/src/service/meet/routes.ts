import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";

import {Header, MimeType, Status} from "fnpm/enums";
import {IApiResponse, CorsHeaders} from "fnpm/core";

import {RoomRoute, Route, UserRoute} from "ms-npm/routes/meet";
import {Role, MSRole} from "ms-npm/auth-models";
import {IRoom} from "ms-npm/meet-models";

import {IConfig} from "/opt/nodejs/node14/config";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";

import {MeetController} from "./controllers/meet.controller";
import {UserController} from "./controllers/user.controller";

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
     * @param {MeetController} meetController controller instance
     * @param {UserController} userController user controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => MeetController)) private meetController: MeetController,
        @inject(delay(() => UserController)) private userController: UserController
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
                    const r: IApiResponse<string> = await this.meetController.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.room], ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IRoom> = await this.meetController.single(req.params.ref);

                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //POST

        //CREATE Schedule ROOM
        router.post(
            [config.service.prefix, config.service.route[Route.room], RoomRoute.schedule].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.meetController.createScheduleRoom(
                        req.body,
                        this.auth.metadata.user.ref
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //CREATE ROOM
        router.post(
            [config.service.prefix, config.service.route[Route.room], ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.meetController.createRoom(
                        req.params.ref,
                        this.auth.metadata.user.ref,
                        req.body.message
                    );

                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //token
        router.post(
            [config.service.prefix, config.service.route[Route.user], UserRoute.token, ":sid"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.userController.getToken(
                        req.params.sid,
                        this.auth.metadata.user
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex.message)
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

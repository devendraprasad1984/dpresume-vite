import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";
import {Header, MimeType, Status, RouteOption} from "fnpm/enums";
import {IApiResponse, CorsHeaders, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {NotesFilter, Route} from "ms-npm/routes/admin";
import {ICompany, INote, IUserSearch} from "ms-npm/admin-models";
import {Role, MSRole} from "ms-npm/auth-models";
import {IInfo} from "ms-npm/company-models";

import {IConfig} from "/opt/nodejs/node14/config";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";

import {AdminController} from "./controllers/admin.controller";
import {NoteController} from "./controllers/note.controller";
import {UserController} from "./controllers/user.controller";
import {CompanyController} from "./controllers/company.controller";

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
     * @param {AdminController} adminController admin controller
     * @param {NoteController} noteController note controller
     * @param {UserController} userController user controller
     * @param {CompanyController} companyController company controller
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => AdminController)) private adminController: AdminController,
        @inject(delay(() => NoteController)) private noteController: NoteController,
        @inject(delay(() => UserController)) private userController: UserController,
        @inject(delay(() => CompanyController)) private companyController: CompanyController
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
        this.auth.init(app);

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
            [config.service.prefix, config.service.route[Route.ping]].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.adminController.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.user]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };
                    const r: IApiResponse<IPaginationResponse<IUserSearch[]>> = await this.userController.getUsers(
                        pagination
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.note]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<INote[]> = await this.noteController.getNotes();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, Route.company].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };
                    const r: IApiResponse<IPaginationResponse<ICompany[]>> = await this.companyController.getCompanies(
                        pagination
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.note], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<INote> = await this.noteController.getNotesById(Number(req.params.id));
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //POST (Not related with basic CRUD)

        //FILTER
        router.post(
            [config.service.prefix, config.service.route[Route.note], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                switch (req.body.filter) {
                    case NotesFilter.getByUserId:
                        const userId = req.body.data.userId as number;
                        try {
                            const r: IApiResponse<INote[]> = await this.noteController.getNotesByUserId(userId);

                            res.status(r.status).json(r).end();
                        } catch (ex) {
                            res.status(ex.status ?? Status.Conflict)
                                .json(ex)
                                .end();
                        }
                        break;
                    default:
                        res.status(Status.NotImplemented).json({}).end();
                }
            }
        );

        //CREATE
        //Note
        router.post(
            [config.service.prefix, config.service.route[Route.note]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const note: INote = req.body;
                try {
                    const r: IApiResponse<INote> = await this.noteController.createNote(note);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //Company
        router.post(
            [config.service.prefix, Route.company].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const company: ICompany = req.body;
                try {
                    const r: IApiResponse<IInfo> = await this.companyController.createCompany(
                        this.auth.metadata.user,
                        company
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //UPDATE
        router.patch(
            [config.service.prefix, config.service.route[Route.note], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const noteId: number = Number(req.params.id);
                const note: INote = req.body;

                try {
                    const r: IApiResponse<INote> = await this.noteController.updateNote(noteId, note);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //DELETE
        router.delete(
            [config.service.prefix, config.service.route[Route.note], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const noteId: number = Number(req.params.id);

                try {
                    const r: IApiResponse<boolean> = await this.noteController.deleteNote(noteId, true);
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

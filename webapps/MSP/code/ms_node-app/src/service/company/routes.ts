import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";

import {Header, MimeType, RouteOption, Status} from "fnpm/enums";
import {
    IApiResponse,
    IDataFilter,
    CorsHeaders,
    ApiResponse,
    IPaginationRequest,
    IPaginationResponse
} from "fnpm/core";

import {InfoFilter, PersonnelFilter, Route} from "ms-npm/routes/company";
import {IPersonnel, IPersonnelSearch} from "ms-npm/company-models";
import {IInfo} from "ms-npm/company-models";
import {MSRole, Role} from "ms-npm/auth-models";
import {LocationFilter, MemberRequestFilter} from "ms-npm/routes/user";
import {IMemberRequest} from "ms-npm/user-models";
import {ICompanyQuery, ICompanySearch, ILocationQuery} from "ms-npm/search-models";
import {CompanyFilter} from "ms-npm/routes/company";

import {IConfig} from "/opt/nodejs/node14/config";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";

import {CompanyController} from "./controllers/company.controller";
import {InfoController} from "./controllers/info.controller";
import {PersonnelController} from "./controllers/personnel.controller";
import {ConnectionController} from "./controllers/connection.controller";
import {ILocation} from "ms-npm/base-models";
import {LocationController} from "./controllers/location.controller";

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
     * @param {CompanyController} companyController controller instance
     * @param {InfoController} infoController controller instance
     * @param {PersonnelController} personnelController controller instance
     * @param {ConnectionController} connectionController controller instance
     * @param {LocationController} locationController controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => CompanyController)) private companyController: CompanyController,
        @inject(delay(() => InfoController)) private infoController: InfoController,
        @inject(delay(() => PersonnelController)) private personnelController: PersonnelController,
        @inject(delay(() => ConnectionController)) private connectionController: ConnectionController,
        @inject(delay(() => LocationController)) private locationController: LocationController
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
                    const r: IApiResponse<string> = await this.companyController.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.info], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IInfo> = await this.infoController.single(Number(req.params.id));
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.location]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<ILocation[]> = await this.locationController.retrieve();
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
            [config.service.prefix, config.service.route[Route.info], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                switch (req.body.filter) {
                    case InfoFilter.getByCompanyId:
                        const companyId = req.body.data.companyId as number;
                        try {
                            const r: IApiResponse<IInfo[]> = await this.infoController.filter({CompanyId: companyId});
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

        router.post(
            [config.service.prefix, config.service.route[Route.connection], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const filterRequest = req.body as IDataFilter;
                const data = filterRequest.data as {
                    companyRef: string;
                };
                try {
                    if (Object.values(MemberRequestFilter).includes(filterRequest.filter as MemberRequestFilter)) {
                        const r: IApiResponse<IMemberRequest[]> = await this.connectionController.filter(
                            <MemberRequestFilter>filterRequest.filter,
                            {CompanyRef: data.companyRef}
                        );
                        res.status(r.status).json(r).end();
                    } else {
                        res.status(Status.NotImplemented).json({}).end();
                    }
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.post(
            [config.service.prefix, config.service.route[Route.personnel], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const companyId = req.body.data.companyId as number;

                const pagination: IPaginationRequest = {
                    perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                    page: req.query.page !== undefined ? Number(req.query.page) : 1
                };

                switch (req.body.filter) {
                    case PersonnelFilter.getAllConnections:
                        try {
                            const r: IApiResponse<IPaginationResponse<IPersonnelSearch[]>> =
                                await this.personnelController.filter({CompanyId: companyId}, pagination);
                            res.status(r.status).json(r).end();
                        } catch (ex) {
                            res.status(ex.status ?? Status.Conflict)
                                .json(ex)
                                .end();
                        }
                        break;
                    case PersonnelFilter.getEmployeeConnections:
                        try {
                            const r: IApiResponse<IPaginationResponse<IPersonnelSearch[]>> =
                                await this.personnelController.filter(
                                    {
                                        CompanyId: companyId,
                                        NOT: {Role: Role.User}
                                    },
                                    pagination
                                );
                            res.status(r.status).json(r).end();
                        } catch (ex) {
                            res.status(ex.status ?? Status.Conflict)
                                .json(ex)
                                .end();
                        }
                        break;
                    case PersonnelFilter.getUserConnections:
                        try {
                            const r: IApiResponse<IPaginationResponse<IPersonnelSearch[]>> =
                                await this.personnelController.filter(
                                    {
                                        CompanyId: companyId,
                                        AND: {Role: Role.User}
                                    },
                                    pagination
                                );
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

        router.post(
            [config.service.prefix, config.service.route[Route.location], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const filterRequest = req.body as IDataFilter;

                    const filter: LocationFilter = filterRequest.filter as LocationFilter;

                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };

                    if (filter) {
                        const r: IApiResponse<IPaginationResponse<ILocation[]>> = await this.locationController.filter(
                            filter,
                            filterRequest.data as ILocationQuery,
                            pagination
                        );
                        res.status(r.status).json(r).end();
                    } else {
                        res.status(Status.NotImplemented).json({}).end();
                    }
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.post(
            [config.service.prefix, RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const filterRequest = req.body as IDataFilter;
                    const data = filterRequest.data as ICompanyQuery;
                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };

                    if (Object.values(CompanyFilter).includes(filterRequest.filter as CompanyFilter)) {
                        const r: IApiResponse<IPaginationResponse<ICompanySearch[]>> =
                            await this.companyController.filter(
                                <CompanyFilter>filterRequest.filter,
                                data,
                                this.auth.metadata.user.id,
                                pagination
                            );
                        res.status(r.status).json(r).end();
                    } else {
                        res.status(Status.NotImplemented).json(new ApiResponse(Status.NotImplemented, {})).end();
                    }
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //UPDATE
        router.patch(
            [config.service.prefix, config.service.route[Route.info], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const infoId: number = Number(req.params.id);
                const info: Partial<IInfo> = req.body;
                try {
                    const r: IApiResponse<IInfo> = await this.infoController.update(
                        this.auth.metadata.user,
                        infoId,
                        info
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.patch(
            [config.service.prefix, config.service.route[Route.connection], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const connectionId: number = Number(req.params.id);
                const connection: Partial<IMemberRequest> = req.body;
                try {
                    const r: IApiResponse<IMemberRequest> = await this.connectionController.update(
                        this.auth.metadata.user,
                        connectionId,
                        connection
                    );
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
            [config.service.prefix, config.service.route[Route.info], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.infoController.delete(Number(req.params.id), true);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        // CREATE
        // PERSONNEL
        router.post(
            [config.service.prefix, config.service.route[Route.personnel]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.personnelController.create(req.body);
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
            [config.service.prefix, config.service.route[Route.personnel], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const personnelId: number = Number(req.params.id);
                const personnel: Partial<IPersonnel> = req.body;
                try {
                    const r: IApiResponse<IPersonnel> = await this.personnelController.update(personnelId, personnel);
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
            [config.service.prefix, config.service.route[Route.personnel], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.personnelController.delete(Number(req.params.id), true);
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

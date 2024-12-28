import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";
import {Header, MimeType, RouteOption, Status} from "fnpm/enums";
import {IApiResponse, IDataFilter, CorsHeaders, IPaginationRequest, IPaginationResponse} from "fnpm/core";

import {IEducationHistory, IProfile, IWorkHistory} from "ms-npm/profile-models";
import {IMemberRequest, IUser} from "ms-npm/user-models";
import {Role, MSRole} from "ms-npm/auth-models";
import {
    EducationHistoryFilter,
    LocationFilter,
    MemberRequestFilter,
    ProfileFilter,
    ProfileRoute,
    Route,
    UserFilter,
    WorkHistoryFilter
} from "ms-npm/routes/user";
import {ILocation, ITag} from "ms-npm/base-models";
import {ILocationQuery, IPeopleQuery, IPeopleSearch} from "ms-npm/search-models";

import {IConfig} from "/opt/nodejs/node14/config";
import {IWhereFilter} from "/opt/nodejs/node14/db/models";
import {MemberRequest} from "/opt/nodejs/node14/db/client-mysql";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";

import {UserController} from "./controllers/user.controller";
import {ProfileController} from "./controllers/profile.controller";
import {WorkHistoryController} from "./controllers/work-history.controller";
import {EducationHistoryController} from "./controllers/education-history.controller";
import {TagController} from "./controllers/tag.controller";
import {InviteController} from "./controllers/invite.controller";
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
     * @param {UserController} userController User controller instance
     * @param {ProfileController} profileController Profile controller instance
     * @param {WorkHistoryController} workHistoryController WorkHistory controller instance
     * @param {EducationHistoryController} educationHistoryController EducationHistory controller instance
     * @param {TagController} tagController Tag controller instance
     * @param {ChatController} inviteController Chat controller instance
     * @param {LocationController} locationController Location controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => UserController)) private userController: UserController,
        @inject(delay(() => ProfileController)) private profileController: ProfileController,
        @inject(delay(() => WorkHistoryController)) private workHistoryController: WorkHistoryController,
        @inject(delay(() => EducationHistoryController)) private educationHistoryController: EducationHistoryController,
        @inject(delay(() => TagController)) private tagController: TagController,
        @inject(delay(() => InviteController)) private inviteController: InviteController,
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
                    const r: IApiResponse<string> = await this.userController.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.profile][ProfileRoute.root], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IProfile> = await this.profileController.getProfileById(
                        Number(req.params.id)
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
            [config.service.prefix, config.service.route[Route.tag]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<ITag[]> = await this.tagController.filter();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[Route.profile][ProfileRoute.root]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IProfile> = await this.profileController.getProfileByUserId(
                        this.auth.metadata.user.id
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

        router.get([config.service.prefix, ":id"].join("/"), async (req: Express.Request, res: Express.Response) => {
            try {
                const r: IApiResponse<IUser> = await this.userController.getUserById(Number(req.params.id));
                res.status(r.status).json(r).end();
            } catch (ex) {
                res.status(ex.status ?? Status.Conflict)
                    .json(ex)
                    .end();
            }
        });

        router.get(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.workHistory,
                ":id"
            ].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IWorkHistory> = await this.workHistoryController.getWorkHistoryById(
                        Number(req.params.id)
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
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.educationHistory,
                ":id"
            ].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IEducationHistory> =
                        await this.educationHistoryController.getEducationHistoryById(Number(req.params.id));
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
            [config.service.prefix, RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const filterRequest = req.body as IDataFilter;

                    const filter: UserFilter = filterRequest.filter as UserFilter;
                    const data: IPeopleQuery = filterRequest.data as IPeopleQuery;

                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };

                    let r: IApiResponse<IPaginationResponse<IPeopleSearch[]>>;
                    if (data) {
                        r = await this.userController.filter(this.auth.metadata.user, filter, pagination, data);
                    } else {
                        r = await this.userController.filter(this.auth.metadata.user, filter, pagination);
                    }

                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.post(
            [config.service.prefix, config.service.route[Route.profile][ProfileRoute.root], RouteOption.Filter].join(
                "/"
            ),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const filterRequest = req.body as IDataFilter;
                switch (filterRequest.filter) {
                    case ProfileFilter.getByUserId: {
                        const data = filterRequest.data as {
                            userId: number;
                        };
                        try {
                            const r: IApiResponse<IProfile> = await this.profileController.getProfileByUserId(
                                data.userId
                            );
                            res.status(r.status).json(r).end();
                        } catch (ex) {
                            res.status(ex.status ?? Status.Conflict)
                                .json(ex)
                                .end();
                        }
                    }
                        break;
                    default:
                        res.status(Status.NotImplemented).json({}).end();
                }
            }
        );
        // FILTER WORK HISTORY
        router.post(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.workHistory,
                RouteOption.Filter
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                switch (req.body.filter) {
                    case WorkHistoryFilter.getWorkHistoryByProfileId:
                        const profileId = req.body.data.profileId as number;

                        try {
                            const r: IApiResponse<IWorkHistory[]> =
                                await this.workHistoryController.getWorkHistoryByProfileId(profileId);
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

        //FILTER EDUCATION HISTORY
        router.post(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.educationHistory,
                RouteOption.Filter
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                switch (req.body.filter) {
                    case EducationHistoryFilter.getEducationHistoryByProfileId:
                        const profileId = req.body.data.profileId as number;
                        try {
                            const r: IApiResponse<IEducationHistory[]> =
                                await this.educationHistoryController.getEducationHistoryByProfileId(profileId);
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
            [config.service.prefix, config.service.route[Route.invite], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                switch (req.body.filter) {
                    case MemberRequestFilter.getRequestByUser:
                        const userRef = req.body.data.userRef;
                        try {
                            const filter: IWhereFilter<MemberRequest> = {UserRef: userRef};
                            const r: IApiResponse<IMemberRequest[]> = await this.inviteController.filterInvites(filter);
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

        //CREATE
        router.post(
            [config.service.prefix, config.service.route[Route.profile][ProfileRoute.root]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IProfile> = await this.profileController.createProfile(req.body);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.post(
            [config.service.prefix, config.service.route[Route.invite]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IMemberRequest> = await this.inviteController.create(req.body);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.post(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.workHistory
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const workHistory: IWorkHistory = req.body;

                try {
                    const r: IApiResponse<IWorkHistory> = await this.workHistoryController.createWorkHistory(
                        this.auth.metadata.user,
                        workHistory
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.post(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.educationHistory
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const educationHistory: IEducationHistory = req.body;

                try {
                    const r: IApiResponse<IEducationHistory> =
                        await this.educationHistoryController.createEducationHistory(
                            this.auth.metadata.user,
                            educationHistory
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
            [config.service.prefix, ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const userId: number = Number(req.params.id);
                const user: Partial<IUser> = req.body;
                try {
                    const r: IApiResponse<IUser> = await this.userController.updateUser(userId, user);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.patch(
            [config.service.prefix, config.service.route[Route.profile][ProfileRoute.root], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IProfile> = await this.profileController.updateProfile(
                        this.auth.metadata.user,
                        Number.parseInt(req.params.id),
                        req.body
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
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.workHistory,
                ":id"
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const workHistoryId: number = Number(req.params.id);
                const workHistory: IWorkHistory = req.body;

                try {
                    const r: IApiResponse<IWorkHistory> = await this.workHistoryController.updateWorkHistory(
                        this.auth.metadata.user,
                        workHistoryId,
                        workHistory
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
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.educationHistory,
                ":id"
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const educationHistoryId: number = Number(req.params.id);
                const educationHistory: IEducationHistory = req.body;

                try {
                    const r: IApiResponse<IEducationHistory> =
                        await this.educationHistoryController.updateEducationHistory(
                            this.auth.metadata.user,
                            educationHistoryId,
                            educationHistory
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
            [config.service.prefix, config.service.route[Route.profile][ProfileRoute.root], ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.profileController.deleteProfile(
                        Number.parseInt(req.params.id),
                        true
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.delete(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.workHistory,
                ":id"
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.workHistoryController.deleteWorkHistory(
                        Number(req.params.id),
                        true
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.delete(
            [
                config.service.prefix,
                config.service.route[Route.profile][ProfileRoute.root],
                ProfileRoute.educationHistory,
                ":id"
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.educationHistoryController.deleteEducationHistory(
                        Number(req.params.id),
                        true
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.delete([config.service.prefix, ":id"].join("/"), async (req: Express.Request, res: Express.Response) => {
            try {
                const r: IApiResponse<boolean> = await this.userController.deleteUser(Number(req.params.id), true);
                res.status(r.status).json(r).end();
            } catch (ex) {
                res.status(ex.status ?? Status.Conflict)
                    .json(ex)
                    .end();
            }
        });

        router.delete(
            [config.service.prefix, config.service.route[Route.tag], ":id"].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.tagController.delete(Number(req.params.id));
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

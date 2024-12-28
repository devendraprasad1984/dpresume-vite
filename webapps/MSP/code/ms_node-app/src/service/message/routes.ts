import {delay, inject, injectable} from "tsyringe";
import * as Express from "express";
import {ChannelData, SearchAPIResponse} from "stream-chat";

import {Header, MimeType, RouteOption, Status} from "fnpm/enums";
import {IApiResponse, IDataFilter, CorsHeaders, IPaginationRequest, IPaginationResponse} from "fnpm/core";
import {ChannelType} from "fnpm/chat/stream/enum";
import {IChannelAPIResponse, IChannelData, IMessageResponse} from "fnpm/chat/stream/models";

import {
    Route,
    ChatRoute,
    ChatFilter,
    ChannelRoute,
    MessageRoute,
    UserRoute,
    TopicRoute,
    TopicFilter,
    MembersFilter
} from "ms-npm/routes/message";
import {MemberRequestFilter} from "ms-npm/routes/user";
import {IMemberRequest} from "ms-npm/user-models";
import {Role, MSRole} from "ms-npm/auth-models";
import {IChannelInvite} from "ms-npm/message-models";
import {IMember, ITopic, ITopicView} from "ms-npm/topic-models";
import {ITopicQuery, ITopicSearch} from "ms-npm/search-models";

import {IConfig} from "/opt/nodejs/node14/config";
import {AuthMiddleware} from "/opt/nodejs/node14/auth";

import {MessageController} from "./controllers/message.controller";
import {ChannelController} from "./controllers/channel.controller";
import {UserController} from "./controllers/user.controller";
import {TopicController} from "./controllers/topic.controller";

const router: Express.Router = Express.Router();

/**
 * Routes model declarations
 */
interface IRoutes {
    //declaration
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
     * @param {MessageController} messageController message controller instance
     * @param {ChannelController} channelController channel controller instance
     * @param {UserController} userController user controller instance
     * @param {TopicController} topicController topic controller instance
     */
    constructor(
        @inject(delay(() => AuthMiddleware)) private auth: AuthMiddleware,
        @inject(delay(() => MessageController)) private messageController: MessageController,
        @inject(delay(() => ChannelController)) private channelController: ChannelController,
        @inject(delay(() => UserController)) private userController: UserController,
        @inject(delay(() => TopicController)) private topicController: TopicController
    ) {
    }

    //methods
    /**
     * Register routes
     *
     * @param {Express.Application} app  express instance
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

        //not found route
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
                    const r: IApiResponse<string> = await this.messageController.ping();
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.get(
            [config.service.prefix, config.service.route[ChatRoute.topic], ":ref"].join("/"),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<ITopicView> = await this.topicController.single(
                        this.auth.metadata.user,
                        req.params.ref
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //POST
        //CREATE
        router.post(
            [config.service.prefix, config.service.route[ChatRoute.channel]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const channelData: IChannelData = {
                        type: ChannelType.Team,
                        createdById: this.auth.metadata.user.ref,
                        name: req.body.name
                    };
                    const r: IApiResponse<IChannelAPIResponse> = await this.channelController.create(
                        channelData,
                        req.body.members
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
            [config.service.prefix, config.service.route[ChatRoute.topic]].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<ITopic> = await this.topicController.createTopic(
                        this.auth.metadata.user,
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

        router.post(
            [config.service.prefix, config.service.route[ChatRoute.topic], TopicRoute.member, RouteOption.Filter].join(
                "/"
            ),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };
                    const r: IApiResponse<IPaginationResponse<IMember[]>> =
                        await this.topicController.filterTopicMembers(
                            this.auth.metadata.user,
                            <MembersFilter>req.body.filter,
                            req.body.data.topicRef,
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

        router.post(
            [
                config.service.prefix,
                config.service.route[ChatRoute.channel],
                ChannelRoute.member,
                RouteOption.Filter
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const pagination: IPaginationRequest = {
                        perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                        page: req.query.page !== undefined ? Number(req.query.page) : 1
                    };
                    const r: IApiResponse<IPaginationResponse<IMember[]>> =
                        await this.channelController.filterTopicMembers(
                            this.auth.metadata.user,
                            <MembersFilter>req.body.filter,
                            req.body.data.channelRef,
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

        router.post(
            [config.service.prefix, config.service.route[ChatRoute.topic], TopicRoute.member].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.topicController.addMembers(
                        req.body.topicRef,
                        req.body.members
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
            [config.service.prefix, config.service.route[ChatRoute.topic], TopicRoute.moderator].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.topicController.addModerators(
                        this.auth.metadata.user,
                        req.body.topicRef,
                        req.body.members
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //INVITE
        router.post(
            [config.service.prefix, config.service.route[ChatRoute.channel], "invite"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const channelData: IChannelData = {members: req.body.members};
                    const r: IApiResponse<boolean> = await this.channelController.invite(
                        req.body.channelRef,
                        channelData
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //FILTER
        router.post(
            [config.service.prefix, RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const limit: number = req.query.limit !== undefined ? Number(req.query.limit) : 10;
                    const offset: number = req.query.offset !== undefined ? Number(req.query.offset) : 0;
                    const keyword: string = req.body.keyword;

                    const r: IApiResponse<SearchAPIResponse> = await this.messageController.filter(
                        this.auth.metadata.user.ref,
                        keyword,
                        limit,
                        offset
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
            [config.service.prefix, config.service.route[ChatRoute.channel], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const filterRequest = req.body as IDataFilter;
                //convert into a switch
                switch (filterRequest.filter) {
                    case ChatFilter.getByMembers:
                        const data = filterRequest.data as {
                            members: string[];
                        };
                        const channelData: IChannelData = {
                            type: ChannelType.Team,
                            members: data.members
                        };

                        try {
                            const r: IApiResponse<ChannelData> = await this.channelController.getByMembers(channelData);
                            res.status(r.status).json(r).end();
                        } catch (ex) {
                            res.status(ex.status ?? Status.Conflict)
                                .json(ex)
                                .end();
                        }
                        break;
                    default:
                        res.status(Status.NotImplemented).json({}).end();
                        break;
                }
            }
        );

        router.post(
            [config.service.prefix, config.service.route[ChatRoute.topic], RouteOption.Filter].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const filterRequest = req.body as IDataFilter;

                const filter: TopicFilter = filterRequest.filter as TopicFilter;

                const pagination: IPaginationRequest = {
                    perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : 10,
                    page: req.query.page !== undefined ? Number(req.query.page) : 1
                };

                try {
                    if (filter) {
                        const r: IApiResponse<IPaginationResponse<ITopicSearch[]>> = await this.topicController.filter(
                            this.auth.metadata.user,
                            filter,
                            filterRequest.data as ITopicQuery,
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
            [config.service.prefix, config.service.route[ChatRoute.topic], TopicRoute.invite, RouteOption.Filter].join(
                "/"
            ),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const filterRequest = req.body as IDataFilter;
                const data = filterRequest.data as {
                    topicRef: string;
                };
                try {
                    if (Object.values(MemberRequestFilter).includes(filterRequest.filter as MemberRequestFilter)) {
                        const r: IApiResponse<IMemberRequest[]> = await this.topicController.filterMemberRequest(
                            <MemberRequestFilter>filterRequest.filter,
                            {TopicRef: data.topicRef}
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

        //LEAVE
        router.post(
            [config.service.prefix, config.service.route[ChatRoute.channel], ChannelRoute.leave].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.channelController.leave(
                        this.auth.metadata.user,
                        req.body.channelRef,
                        req.body.members
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
            [config.service.prefix, config.service.route[ChatRoute.topic], TopicRoute.member, TopicRoute.leave].join(
                "/"
            ),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.topicController.removeMembers(
                        this.auth.metadata.user,
                        req.body.topicRef,
                        req.body.members
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
                config.service.route[ChatRoute.topic],
                TopicRoute.moderator,
                TopicRoute.demote
            ].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.topicController.demoteModerators(
                        this.auth.metadata.user,
                        req.body.topicRef,
                        req.body.members
                    );
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //ARCHIVE
        router.post(
            [config.service.prefix, config.service.route[ChatRoute.channel], ChannelRoute.archive, ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.channelController.delete(req.params.ref);
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
            [config.service.prefix, config.service.route[ChatRoute.topic], ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<ITopic> = await this.topicController.updateTopic(
                        this.auth.metadata.user,
                        req.params.ref,
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
            [config.service.prefix, config.service.route[ChatRoute.channel], ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const channelData: IChannelData = {name: req.body.name};
                    const r: IApiResponse<boolean> = await this.channelController.updateChannel(
                        req.params.ref,
                        channelData
                    );

                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //INVITE UPDATE
        router.patch(
            [config.service.prefix, config.service.route[ChatRoute.channel], ChannelRoute.invite, ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const invite: IChannelInvite = {
                        channelRef: req.body.channelRef,
                        memberRequestId: Number.parseInt(req.params.id),
                        status: req.body.status,
                        userRef: req.body.userRef
                    };
                    const r: IApiResponse<boolean> = await this.channelController.updateInvite(invite);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.patch(
            [config.service.prefix, config.service.route[ChatRoute.topic], TopicRoute.invite, ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                const connectionId: number = Number(req.params.id);
                const connection: Partial<IMemberRequest> = req.body;
                try {
                    const r: IApiResponse<IMemberRequest> = await this.topicController.updateMemberRequest(
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
            [config.service.prefix, config.service.route[ChatRoute.channel], ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.channelController.delete(req.params.ref, true);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        router.delete(
            [config.service.prefix, config.service.route[ChatRoute.topic], ":ref"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.topicController.deleteTopic(req.params.ref, true);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //MESSAGES

        //Send
        router.post(
            [config.service.prefix, MessageRoute.send].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<IMessageResponse> = await this.messageController.send(
                        req.body.channelRef,
                        req.body.messageText,
                        req.body.userRef
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
            [config.service.prefix, MessageRoute.archive, ":id"].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<boolean> = await this.messageController.delete(req.params.id);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex)
                        .end();
                }
            }
        );

        //USER

        //token
        router.post(
            [config.service.prefix, config.service.route[ChatRoute.user], UserRoute.token].join("/"),
            this.auth.authorize([MSRole.MSA], Role.User),
            async (req: Express.Request, res: Express.Response) => {
                try {
                    const r: IApiResponse<string> = await this.userController.getToken(this.auth.metadata.user.id);
                    res.status(r.status).json(r).end();
                } catch (ex) {
                    res.status(ex.status ?? Status.Conflict)
                        .json(ex.message)
                        .end();
                }
            }
        );
    }
}

import "reflect-metadata";
import {container, delay, inject, injectable} from "tsyringe";
import Express from "express";
import Cors from "cors";
import {Server} from "http";
import {readFileSync} from "fs";

import {Swagger, ISwaggerConfig} from "fnpm/swagger";
import {StreamApi} from "fnpm/chat/stream";
import {Chat} from "fnpm/chat";
import {ClientType} from "fnpm/chat/stream/enum";
import {IChatConfig} from "fnpm/chat/stream/models";

import {Global, IConfig, IServiceConfig} from "/opt/nodejs/node14/config";
import {DbRepo} from "/opt/nodejs/node14/db";
import {PrismaClient as MySqlClient} from "/opt/nodejs/node14/db/client-mysql";
import {ClientType as DbClientType} from "/opt/nodejs/node14/db/enums";

import * as Config from "./config.json";
import {Routes} from "./routes";

/**
 * User service/function interface
 */
interface IUser {
    // properties
    app: Express.Application;
    server: Server;
    config: IConfig;

    // declarations
    /**
     * Start listener service declaration
     */
    start(): void;

    /**
     * Stop listener service declaration
     */
    stop(): Promise<void>;
}

/**
 * Class derived from IUser
 */
@injectable()
export class User implements IUser {
    // properties
    private _xprs: Express.Application;
    private _server: Server;

    /**
     * Auth constructor
     *
     * @param {Global} global merged config
     * @param {Routes} routes routes instance
     */
    constructor(
        @inject(delay(() => Global)) private global: Global,
        @inject(delay(() => Routes)) private routes: Routes
    ) {
        this._xprs = Express();

        this._xprs.use(Cors());
        this._xprs.use(Express.text());
        this._xprs.use(Express.json());
        this._xprs.use(Express.urlencoded({extended: false}));

        // setup config
        const pckg = JSON.parse(readFileSync(`${__dirname}/package.json`, "utf-8"));

        global.init(Config as unknown as IServiceConfig, pckg.author?.name, pckg.author?.url);

        Config.docs.version = pckg.version;

        // resolve third party dependencies
        this.resolveDependencies();

        //Set the swagger models
        const swaggerDocs = global.retrieveSwaggerModels(__dirname);
        Config.docs.models.tags = swaggerDocs.tags;
        Config.docs.models.paths = swaggerDocs.paths;
        Config.docs.models.definitions = swaggerDocs.definitions;

        // setup swagger
        this.setSwagger();

        // setup routes
        this.routes.register(this.app, this.config);
    }

    // getter / setter
    /**
     * Express application instance getter
     *
     * @returns {Express.Application} express app instance
     */
    get app(): Express.Application {
        return this._xprs;
    }

    /**
     * Server instance
     *
     * @returns {Server} http server instance / listener
     */
    get server(): Server {
        return this._server;
    }

    /**
     * Config (merged)
     *
     * @returns {IConfig} merged config object
     */
    get config(): IConfig {
        return this.global.config;
    }

    // public methods
    /**
     * Start server
     *
     * @returns {Server} http server
     */
    start(): Server {
        // start
        const port = process.env.PORT || this.config.service.port;
        this._xprs.set("port", port);
        this._server = this._xprs.listen(this._xprs.get("port"));
        console.info(`User service API Docs are running on http://localhost:${port}/user/api-docs`);

        return this._server;
    }

    /**
     * Stop server
     */
    async stop(): Promise<void> {
        this._server.close();
    }

    /**
     * Set the swagger configuration and documentation
     */
    private setSwagger(): void {
        new Swagger(this._xprs, {
            swaggerVersion: this.config.info.swaggerVersion,
            contact: {name: this.config.info.contact.name, url: this.config.info.contact.url},
            service: {
                version: this.config.service.docs.version,
                title: this.config.service.docs.title,
                description: this.config.service.docs.description,
                routes: this.config.service.docs.routes,
                docsUrl: this.config.service.docs.url
            },
            tags: this.config.service.docs.models.tags,
            paths: this.config.service.docs.models.paths,
            definitions: this.config.service.docs.models.definitions,
            basePath: this.config.info.basePath
        } as ISwaggerConfig).setup();
    }

    /**
     * Resolve service dependencies
     */
    private resolveDependencies(): void {
        // db service
        container.register("Db", {useClass: DbRepo});
        const db: DbRepo<MySqlClient> = new DbRepo(DbClientType.MySql);
        container.registerInstance("Db", db);

        // chat service
        container.register("Chat", {useClass: Chat});
        const chat: Chat<StreamApi> = new Chat(ClientType.Stream, this.global.config.chat as unknown as IChatConfig);
        container.registerInstance("Chat", chat);
    }
}

// resolve and export instance of the service
module.exports = {User};

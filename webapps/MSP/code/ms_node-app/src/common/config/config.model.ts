/**
 * Config declarations
 */
export interface IConfig {
    info: IInfo;
    auth: IAuthConfig;
    chat: IChatConfig;
    meet: IMeetConfig;
    notification: INotificationConfig;
    service: IServiceConfig;
}

/**
 * Global Swagger Configuration declarations
 */
interface IInfo {
    swaggerVersion: string;
    contact: {
        name: string;
        url: string;
    };
    basePath: string;
}
/**
 * Global Auth Configuration
 */
interface IAuthConfig {
    domain: string;
}

/**
 * Chat Configuration declarations
 */
interface IChatConfig {
    key: string;
    secret: string;
    options: {
        token: {
            expiration: number;
        };
        message: {
            format: [];
        };
        media: {
            AllowedExt: [];
        };
    };
}

/**
 * Meet Configuration declarations
 */
interface IMeetConfig {
    account: {
        main: {
            sid: string;
            api: {
                key: string;
                secret: string;
            };
        };
        sub: {
            sid: string;
            api: {
                secret: string;
            };
        };
    };
    options: {
        room: {
            expiration: number;
        };
    };
}

/**
 * Notification config declarations
 */
interface INotificationConfig {
    actionMinutes: number;
    reminderMinutes: number;
}

/**
 * Service configuration declarations
 */
export interface IServiceConfig {
    docs: {
        version: string;
        title: string;
        description: string;
        routes: string;
        url: string;
        models: ISwaggerModels;
    };
    port: number;
    prefix: string;
    route: { [id: string]: string | ISubRoute };
}

/**
 * Swagger Docs declarations
 */
export interface ISwaggerModels {
    tags: object[];
    paths: object;
    definitions: object;
}
/**
 * Service SubRoute model declaration
 */
export interface ISubRoute {
    [id: string]: string;
}

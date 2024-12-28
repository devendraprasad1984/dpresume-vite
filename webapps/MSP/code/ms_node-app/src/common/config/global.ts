import dotenv from "dotenv";
dotenv.config();

import { injectable } from "tsyringe";
import { readFileSync, readdirSync } from "fs";
import _ from "lodash";

import * as GlobalConfig from "./data/global.config.json";
import { IConfig, IServiceConfig, ISwaggerModels } from "./config.model";

/**
 * Config merger declarations
 */
interface IGlobal {
    // properties
    config: IConfig;

    // declarations
    /**
     * initialize method
     */
    init(localConfig: IServiceConfig): void;

    /**
     * return Swagger models
     */
    retrieveSwaggerModels(dirname: string): ISwaggerModels;
}
/**
 * Class derived from IGlobal
 */
@injectable()
export class Global implements IGlobal {
    // properties
    private _config: IConfig;

    // getter / setter
    /**
     * getter for config
     *
     * @returns {IConfig} merged config
     */
    get config(): IConfig {
        return this._config;
    }

    // methods
    /**
     * Initializing
     *
     * @param {IServiceConfig} localConfig merged config
     * @param {string?} author author of the api
     * @param {string?} url url of the api
     */
    init(localConfig: IServiceConfig, author?: string, url?: string): void {
        // Set the merge file names
        let envJson: string;
        let envConfigJsonPath: string;
        if (process.env.NODE_ENV && process.env.NODE_ENV != "") {
            envConfigJsonPath = `${__dirname}/data/${process.env.NODE_ENV}.config.json`;
            envJson = readFileSync(envConfigJsonPath, "utf-8");
        }
        if (envJson && envConfigJsonPath) {
            const envConfig = JSON.parse(readFileSync(envConfigJsonPath, "utf-8"));
            this._config = _.mergeWith(GlobalConfig, envConfig) as unknown as IConfig;
        } else {
            this._config = GlobalConfig as unknown as IConfig;
        }
        this._config.service = localConfig;

        // setup api version, contact name/url from package.json (version, author: {name, url})
        this._config.info.contact.name = author;
        this._config.info.contact.url = url;

        this.appendSecureInfo();
    }

    /**
     * return Swagger models for every controllers in the server
     *
     * @param {string} dirname json config controller
     * @returns {ISwaggerModels} Swagger Models
     */
    retrieveSwaggerModels(dirname: string): ISwaggerModels {
        // Function to concat arrays
        const arrayConcat = (objValue: string, srcValue: string) => {
            if (_.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        };
        // Set the model and paths
        let swaggerDocs: ISwaggerModels;
        const swaggerConfigJsonPath: string = `${dirname}/data/`;

        // Read the file names
        const filesNames = readdirSync(swaggerConfigJsonPath);

        // Set the result
        filesNames.forEach((fileName: string) => {
            const ctrlJson = JSON.parse(readFileSync(`${swaggerConfigJsonPath}${fileName}`, "utf-8"));
            swaggerDocs = _.mergeWith(swaggerDocs, ctrlJson, arrayConcat);
        });

        //Return the model
        return swaggerDocs;
    }

    /**
     * Append secure information from env to config
     */
    private appendSecureInfo(): void {
        this._config.chat.key = process.env.STREAM_API_KEY || "";
        this._config.chat.secret = process.env.STREAM_API_SECRET || "";

        this._config.meet.account.main.sid = process.env.MEET_ACCOUNT_MAIN_SID || "";
        this._config.meet.account.main.api.key = process.env.MEET_ACCOUNT_MAIN_API_KEY || "";
        this._config.meet.account.main.api.secret = process.env.MEET_ACCOUNT_MAIN_API_SECRET || "";
        this._config.meet.account.sub.sid = process.env.MEET_ACCOUNT_SUB_SID || "";
        this._config.meet.account.sub.api.secret = process.env.MEET_ACCOUNT_SUB_API_SECRET || "";
    }
}

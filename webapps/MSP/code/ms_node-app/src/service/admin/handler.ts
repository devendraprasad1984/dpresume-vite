import "reflect-metadata";
import {container} from "tsyringe";

import {Serverless} from "fnpm/deployment";

import * as Service from "./";

const service: Service.Admin = container.resolve(Service.Admin);

module.exports.service = new Serverless(service.app).handler;

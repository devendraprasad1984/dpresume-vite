import "reflect-metadata";
import {container} from "tsyringe";

import {Serverless} from "fnpm/deployment";

import * as Service from "./";

const service: Service.Auth = container.resolve(Service.Auth);

module.exports.service = new Serverless(service.app).handler;

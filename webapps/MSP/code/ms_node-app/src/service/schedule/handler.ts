import "reflect-metadata";
import {container} from "tsyringe";

import {Serverless} from "fnpm/deployment";

import * as Service from "./";

const service: Service.Schedule = container.resolve(Service.Schedule);

module.exports.service = new Serverless(service.app).handler;

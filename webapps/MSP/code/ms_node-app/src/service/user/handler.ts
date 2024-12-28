import "reflect-metadata";
import {container} from "tsyringe";

import {Serverless} from "fnpm/deployment";

import * as Service from ".";

const service: Service.User = container.resolve(Service.User);

module.exports.service = new Serverless(service.app).handler;

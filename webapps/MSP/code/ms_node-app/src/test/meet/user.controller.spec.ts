/* eslint-disable @typescript-eslint/typedef */
import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method, Status} from "fnpm/enums";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {Route, UserRoute} from "ms-npm/routes/meet";

import * as Service from "../../service/meet";

const service: Service.Meet = container.resolve(Service.Meet);
let factory: TestFactory;
const paths: Map<string, string> = new Map();

describe("@meet", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    describe("@meet-user", () => {
        paths["baseUser"] = [service.config.service.prefix, Route.user].join("/");

        paths["userToken"] = [paths["baseUser"], UserRoute.token].join("/");

        it(`get token POST without header user: ${paths["userToken"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, [paths["userToken"], 0].join("/"));
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        //TODO Add test when we have the possibility of using headers in SuperTest
    });
});

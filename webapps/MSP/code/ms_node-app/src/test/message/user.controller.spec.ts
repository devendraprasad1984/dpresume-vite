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
import {IApiResponse} from "fnpm/core";
import {UserRole} from "fnpm/chat/stream/enum";

import {ChatRoute, UserRoute} from "ms-npm/routes/message";

import * as Service from "../../service/message";

const service: Service.Message = container.resolve(Service.Message);
let factory: TestFactory;
const paths: Map<string, string> = new Map();

describe("@message", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    describe("@message-user", () => {
        paths["baseUser"] = [service.config.service.prefix, ChatRoute.user].join("/");

        paths["syncUser"] = [paths["baseUser"], "sync"].join("/");

        paths["userToken"] = [paths["baseUser"], UserRoute.token].join("/");

        it(`sync users Invalid data POST: ${paths["syncUser"]}`, async () => {
            try {
                const data: object[] = [
                    {
                        id: "2f4bdba3-58a5-45d8-3714-ebbc4cc45e58",
                        role: "test" //NonExistRole
                    }
                ];
                const res: Response = await factory.test(Method.POST, paths["syncUser"], data);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`sync users POST: ${paths["syncUser"]}`, async () => {
            try {
                const data: object[] = [
                    {
                        id: "2f4bdba3-58a5-45d8-3714-ebbc4cc45e58",
                        role: UserRole.User,
                        name: "Josh Test"
                    }
                ];
                const res: Response = await factory.test(Method.POST, paths["syncUser"], data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).to.be.eql(true);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`get token POST without header user: ${paths["userToken"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, [paths["userToken"]].join("/"));
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

import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method, Status} from "fnpm/enums";
import {IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {RoomRoute, Route} from "ms-npm/routes/meet";

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

    describe("@meet-meet", () => {
        const channelId = 2;

        const path = [service.config.service.prefix, service.config.service.route[Route.ping]].join("/");

        paths["baseRoom"] = [service.config.service.prefix, service.config.service.route[Route.room]].join("/");

        it(`@system get: ${path}`, async () => {
            try {
                const res = await factory.test(Method.GET, path);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<string> = res.body as IApiResponse<string>;
                expect(r.error).to.be.undefined;
                expect(r.result).not.to.be.undefined;
                expect(r.result).to.be.a("string");
                expect(r.result).to.contain("pong");
            } catch (err) {
                throw err;
            }
        });

        it(`create room Invalid Data POST: ${paths["baseRoom"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, [paths["baseRoom"], 0].join("/"));
                factory.log("Response: ", res.status, res.body);

                //Check a bad request response
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`create room POST: ${paths["baseRoom"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, [paths["baseRoom"], channelId].join("/"));
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<string> = res.body as IApiResponse<string>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).not.to.be.eql("");
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`create schedule room Invalid Data POST: ${paths["baseRoom"]}/${RoomRoute.schedule}`, async () => {
            try {
                const data: object = {channelId: 0};
                const res: Response = await factory.test(
                    Method.POST,
                    [paths["baseRoom"], RoomRoute.schedule].join("/"),
                    data
                );
                factory.log("Response: ", res.status, res.body);

                //Check a bad request response
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`create schedule room POST: ${paths["baseRoom"]}/${RoomRoute.schedule}`, async () => {
            try {
                const data: object = {
                    channelId: channelId,
                    isRecurring: true,
                    audit: {createdBy: "4b8de3be-a832-6cb6-acde-f0c47f23d2a6"},
                    event: [
                        {
                            date: "2022-04-05T20:48:22Z",
                            time: "2022-04-05T20:48:22Z",
                            startedOn: "2022-04-05T20:48:22Z",
                            endOn: "2022-04-05T20:48:22Z",
                            invitees: [
                                {
                                    userId: 1,
                                    userRef: "4b8de3be-a832-6cb6-acde-f0c47f23d2a6"
                                },
                                {
                                    userId: 5,
                                    userRef: "ed69fb8b-1506-2cb9-e96b-6a0345643234"
                                }
                            ]
                        }
                    ]
                };

                const res: Response = await factory.test(
                    Method.POST,
                    [paths["baseRoom"], RoomRoute.schedule].join("/"),
                    data
                );
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<string> = res.body as IApiResponse<string>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).not.to.be.eql("");
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });
    });
});

import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method, Status} from "fnpm/enums";
import {IApiResponse} from "fnpm/core";
import {Hasher} from "fnpm/utils";
import {IChannelAPIResponse, IMessageResponse} from "fnpm/chat/stream/models";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {Route, ChatRoute, MessageRoute} from "ms-npm/routes/message";

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

    const path = [service.config.service.prefix, service.config.service.route[Route.ping]].join("/");
    it(`@system: ${path}`, async () => {
        try {
            const res: Response = await factory.test(Method.GET, path);
            factory.log("Response: ", res.status, res.body);

            // get api response
            const r: IApiResponse<string> = res.body as IApiResponse<string>;
            expect(r.error).to.be.undefined;
            expect(r.result).not.to.be.undefined;
            expect(r.result).to.be.a("string");
            expect(r.result).to.contain("ping");
        } catch (ex) {
            factory.log("Exception: ", JSON.stringify(ex));
            throw ex;
        }
    });

    describe("@message-message", () => {
        const createChannelMembers = [
            {
                name: "Test1",
                ref: "4b8de3be-a832-6cb6-acde-f0c47f23d2a6"
            },
            {
                name: "Test2",
                ref: "2f4bdba3-58a5-45d8-3714-ebbc4cc45e58"
            }
        ];
        const streamChannelId = Hasher.guid();
        const channelCreator = "4b8de3be-a832-6cb6-acde-f0c47f23d2a6";
        const sender = "4b8de3be-a832-6cb6-acde-f0c47f23d2ad";
        const invalidMessageRef = "859e0847-6c65-4e0b-8838-269ebd86f6d6";
        let channelRef = "";
        let messageRef = "";

        paths["baseMessage"] = [service.config.service.prefix, service.config.service.route[ChatRoute.message]].join(
            "/"
        );

        paths["baseChannel"] = [service.config.service.prefix, service.config.service.route[ChatRoute.channel]].join(
            "/"
        );

        paths["sendMessage"] = [paths["baseMessage"], MessageRoute.send].join("/");

        paths["archiveMessage"] = [paths["baseMessage"], MessageRoute.archive].join("/");

        it(`create Channel POST: ${paths["baseChannel"]}`, async () => {
            try {
                const data: object = {
                    name: streamChannelId,
                    createdById: channelCreator,
                    members: createChannelMembers,
                    channelRef: streamChannelId
                };

                const res: Response = await factory.test(Method.POST, paths["baseChannel"], data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IChannelAPIResponse> = res.body as IApiResponse<IChannelAPIResponse>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.channel.id).not.to.be.undefined;
                    channelRef = r.result.channelRef;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`message @send message POST: ${paths["sendMessage"]}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    messageText: "Test message",
                    userRef: sender
                };

                const res: Response = await factory.test(Method.POST, paths["sendMessage"], data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IMessageResponse> = res.body as IApiResponse<IMessageResponse>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.text).not.to.be.undefined;
                    expect(r.result.user).not.to.be.undefined;
                    messageRef = r.result.id;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`message @send invalid data POST: ${paths["sendMessage"]}`, async () => {
            try {
                const data: object = {
                    channelRef: undefined,
                    messageText: "Test message",
                    userRef: sender
                };

                const res: Response = await factory.test(Method.POST, paths["sendMessage"], data);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`message @archive POST: ${paths["archiveMessage"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.POST, [paths["archiveMessage"], messageRef].join("/"));
                factory.log("Response: ", res.status, res.body);
                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                expect(r.status).to.equal(Status.OK);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).to.be.eql(true);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`message @archive invalid data POST: ${paths["archiveMessage"]}/:id`, async () => {
            try {
                const res = await factory.test(
                    Method.POST,
                    [paths["archiveMessage"], "80000000-4e0b-8838-269ebd86f6d6"].join("/")
                );
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict); //TODO Change this for BadRequest
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`message @archive invalid id POST: ${paths["archiveMessage"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.POST, [paths["archiveMessage"], invalidMessageRef].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`delete channel DELETE: ${paths["baseChannel"]}/:ref`, async () => {
            try {
                factory.log(channelRef);
                const res = await factory.test(Method.DELETE, [paths["baseChannel"], channelRef].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                expect(r.status).to.equal(Status.OK);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).to.be.eql(true);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });
    });
});

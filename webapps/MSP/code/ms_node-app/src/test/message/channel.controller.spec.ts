import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";
import {ChannelData} from "stream-chat";

import {Method, Status} from "fnpm/enums";
import {IApiResponse} from "fnpm/core";
import {Hasher} from "fnpm/utils";
import {IChannelAPIResponse} from "fnpm/chat/stream/models";
import {TestFactory} from "fnpm/endpoint-test-factory";
import {RecordStatus} from "../../common/db/enums";

import {ChatRoute, ChannelRoute} from "ms-npm/routes/message";

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

    describe("@message-channel", () => {
        const createChannelMembers = ["4b8de3be-a832-6cb6-acde-f0c47f23d2a6", "2f4bdba3-58a5-45d8-3714-ebbc4cc45e58"];
        const inviteMembers = ["0a473312-b7fe-e9f3-461a-a436d548711d"];
        const streamChannelId = Hasher.guid();
        const leaveMembers = ["0a473312-b7fe-e9f3-461a-a436d548711d"];
        let streamRef = "";
        let channelRef = "";
        const memberRequestId1 = 1;
        const memberRequestId2 = 2;

        paths["baseChannel"] = [service.config.service.prefix, service.config.service.route[ChatRoute.channel]].join(
            "/"
        );

        paths["invite"] = [paths["baseChannel"], ChannelRoute.invite].join("/");

        paths["leave"] = [paths["baseChannel"], ChannelRoute.leave].join("/");

        paths["archive"] = [paths["baseChannel"], ChannelRoute.archive].join("/");

        paths["sync"] = [paths["baseChannel"], ChannelRoute.sync].join("/");

        it(`channel POST Invalid data: ${paths["baseChannel"]}`, async () => {
            try {
                const data: object = {name: "channelId"};

                const res: Response = await factory.test(Method.POST, paths["baseChannel"], data);
                factory.log("Response: ", res.status, res.body);

                //Check a bad request response
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`create Channel with nonExistent members POST: ${paths["baseChannel"]}`, async () => {
            try {
                const data: object = {
                    name: "testNonExistMembers",
                    members: ["00000000-0002-6cb6-acde-f0c47f23d2a6", "00000003-b7fe-e9f3-461a-a436d548711d"]
                };

                const res: Response = await factory.test(Method.POST, paths["baseChannel"], data);
                factory.log("Response: ", res.status, res.body);

                //Check a Conflict request response
                expect(res.status).to.equal(Status.Conflict);
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`create Channel POST: ${paths["baseChannel"]}`, async () => {
            try {
                const data: object = {
                    name: streamChannelId,
                    members: createChannelMembers
                };

                const res: Response = await factory.test(Method.POST, paths["baseChannel"], data);
                factory.log("POST create Channel Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IChannelAPIResponse> = res.body as IApiResponse<IChannelAPIResponse>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.channel.id).not.to.be.undefined;
                    expect(r.result.channel.type).not.to.be.undefined;
                    expect(r.result.channel.cid).not.to.be.undefined;
                    expect(r.result.channel.created_at).not.to.be.undefined;
                    channelRef = r.result.channelRef;
                    streamRef = r.result.channel.id;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`filter POST: ${paths["baseChannel"]}`, async () => {
            try {
                const res = await factory.test(Method.POST, [paths["baseChannel"], ChatRoute.filter].join("/"), {
                    filter: "getByMembers",
                    data: {members: createChannelMembers}
                });
                factory.log("POST filter Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<ChannelData> = res.body as IApiResponse<ChannelData>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.type).not.to.be.undefined;
                    expect(r.result.cid).not.to.be.undefined;
                    expect(r.result.created_at).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter POST NonExist Channel: ${paths["baseChannel"]}`, async () => {
            try {
                const res = await factory.test(Method.POST, [paths["baseChannel"], ChatRoute.filter].join("/"), {
                    filter: "getByMembers",
                    data: {members: ["00000000-0002-6cb6-acde-f0c47f23d2a6", "00000003-b7fe-e9f3-461a-a436d548711d"]}
                });

                factory.log("Response: ", res.status, res.body);
                //Check a Conflict request response
                expect(res.status).to.equal(Status.Conflict);
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`invite with invalid data member Channel POST: ${paths["invite"]}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    members: "00000000-0002"
                };

                const res: Response = await factory.test(Method.POST, paths["invite"], data);
                factory.log("Response: ", res.status, res.body);

                //Check a Conflict request response
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`invite with nonExistent member Channel POST: ${paths["invite"]}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    members: "00000000-0002-6cb6-acde-f0c47f23d2a6"
                };

                const res: Response = await factory.test(Method.POST, paths["invite"], data);
                factory.log("Response: ", res.status, res.body);

                //Check a Conflict request response
                expect(res.status).to.equal(Status.Conflict);
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`invite member Channel POST: ${paths["invite"]}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    members: inviteMembers
                };

                const res: Response = await factory.test(Method.POST, paths["invite"], data);
                factory.log("POST invite member channel Response: ", res.status, res.body);

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

        it(`accept invite member Channel PATCH: ${[paths["invite"], memberRequestId1].join("/")}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    userRef: createChannelMembers[1],
                    status: RecordStatus.Active
                };

                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["invite"], memberRequestId1].join("/"),
                    data
                );
                factory.log("PATCH accept invite member Response: ", res.status, res.body);

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

        it(`accept invite invalid member Channel PATCH: ${[paths["invite"], memberRequestId1].join("/")}`, async () => {
            try {
                const data: object = {
                    channelRef: undefined,
                    userRef: createChannelMembers[0],
                    status: RecordStatus.Active
                };

                const res: Response = await factory.test(Method.PATCH, [paths["invite"], -1].join("/"), data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.Conflict);
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

        it(`reject invite member Channel PATCH: ${[paths["invite"], memberRequestId2].join("/")}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    userRef: createChannelMembers[1],
                    status: RecordStatus.Archived
                };

                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["invite"], memberRequestId2].join("/"),
                    data
                );
                factory.log("PATCH reject invite member Response: ", res.status, res.body);

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

        it(`reject invite invalid member Channel PATCH: ${[paths["invite"], memberRequestId2].join("/")}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    userRef: createChannelMembers[1],
                    status: RecordStatus.Archived
                };

                const res: Response = await factory.test(Method.PATCH, [paths["invite"], -1].join("/"), data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.Conflict);
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

        it(`leave group nonExistent Channel POST: ${paths["leave"]}`, async () => {
            try {
                const data: object = {
                    channelRef: "00000000-0002-6cb6-acde-f0c47f23d2a6",
                    members: ["00000000-0002-6cb6-acde-f0c47f23d2a6"]
                };

                const res: Response = await factory.test(Method.POST, paths["leave"], data);
                factory.log("Response: ", res.status, res.body);

                //Check a Conflict request response
                expect(res.status).to.equal(Status.Conflict); //TODO Change to Bad Request
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`leave group nonExistent member Channel POST: ${paths["leave"]}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    members: ["00000000-0002-6cb6-acde-f0c47f23d2a6"]
                };

                const res: Response = await factory.test(Method.POST, paths["leave"], data);
                factory.log("Response: ", res.status, res.body);

                //Check a Conflict request response
                expect(res.status).to.equal(Status.Conflict); //TODO Change to Bad Request
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`leave group Channel POST: ${paths["leave"]}`, async () => {
            try {
                const data: object = {
                    channelRef: channelRef,
                    members: leaveMembers
                };

                const res: Response = await factory.test(Method.POST, paths["leave"], data);
                factory.log("POST leave group channel Response: ", res.status, res.body);

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

        it(`sync channel Invalid data POST: ${paths["sync"]}`, async () => {
            try {
                const data: object = {
                    channelId: "ChannelNonExistChannel", // NonExistChannel
                    text: "Thierry changed the channel image",
                    name: "TestSync",
                    image: "https://commons.wikimedia.org/wiki/File:Channel_A_Logo_transparent.png"
                };
                const res = await factory.test(Method.POST, paths["sync"], data);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`sync channel POST: ${paths["sync"]}`, async () => {
            try {
                const data: object = {
                    channelId: streamRef,
                    text: "Thierry changed the channel image",
                    name: "TestSync",
                    image: "https://commons.wikimedia.org/wiki/File:Channel_A_Logo_transparent.png"
                };
                const res = await factory.test(Method.POST, paths["sync"], data);
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

        it(`delete channel invalid channel DELETE: ${paths["baseChannel"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.DELETE, [paths["baseChannel"], 0].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict); //TODO Change this when we fix the validators
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`delete channel DELETE: ${paths["baseChannel"]}/${channelRef}`, async () => {
            try {
                const res = await factory.test(Method.DELETE, [paths["baseChannel"], channelRef].join("/"));
                factory.log("DELETE channel Response: ", res.status, res.body);
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

/* eslint-disable @typescript-eslint/typedef */
import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method, RouteOption, Status} from "fnpm/enums";
import {IApiError, IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";
import {Hasher} from "fnpm/utils";
import {RecordStatus} from "../../common/db/enums";

import {MemberRequestFilter, Route} from "ms-npm/routes/user";
import {IMemberRequest} from "ms-npm/user-models";

import * as Service from "../../service/user";
import {newMemberRequest} from "../../test/data/user.seed";

const service: Service.User = container.resolve(Service.User);
let factory: TestFactory;
const paths: Map<string, string> = new Map();

describe("@user", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    describe("@user-chat", () => {
        const userRefInvalid = "1";
        const userRef: string = "808425d2-4652-9367-79b8-5bf2b382f992";

        paths["base"] = [service.config.service.prefix, Route.invite].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`create Member request POST: ${paths["base"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, paths["base"], newMemberRequest);
                factory.log("POST Create Member requestResponse: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IMemberRequest> = res.body as IApiResponse<IMemberRequest>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).to.be.eq(RecordStatus.Pending);
                    expect(r.result.message).not.to.be.undefined;

                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`filter Member Request ByUser POST: ${paths["filter"]}`, async () => {
            try {
                const filterByUser = {
                    filter: MemberRequestFilter.getRequestByUser,
                    data: {userRef}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("Member Request filter Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IMemberRequest[]> = res.body as IApiResponse<IMemberRequest[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).not.to.be.undefined;
                    expect(r.result.length).to.be.above(0);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`exception filter Member Request by id invalid POST: ${paths["filter"]}`, async () => {
            try {
                const filterByUser = {
                    filter: MemberRequestFilter.getRequestByUser,
                    data: {userRef: userRefInvalid}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("GET Exception Member Request by User Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict);
                // get api response
                const r: IApiError = res.body as IApiError;
                factory.log("Api Response: ", r.status, r.message, r.details);
                if (r.message) {
                    expect(r.status).to.equal(Status.Conflict);
                    expect(r.message).to.contain("Invalid");
                } else {
                    expect(r).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`exception filter Member Request not existing user POST: ${paths["filter"]}`, async () => {
            try {
                const filterByUser = {
                    filter: MemberRequestFilter.getRequestByUser,
                    data: {userRef: Hasher.guid()}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("GET Exception Member Request non existing by Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IMemberRequest[]> = res.body as IApiResponse<IMemberRequest[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).not.to.be.undefined;
                    expect(r.result.length).to.be.eq(0);
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

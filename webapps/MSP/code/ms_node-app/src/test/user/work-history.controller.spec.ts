/* eslint-disable @typescript-eslint/typedef */
import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method, RouteOption} from "fnpm/enums";
import {IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";
import {RecordStatus} from "../../common/db/enums";

import {ProfileRoute, Route, WorkHistoryFilter} from "ms-npm/routes/user";
import {IWorkHistory} from "ms-npm/profile-models";

import * as Service from "../../service/user";
import {newWorkHistory, updateWorkHistory, updateWorkHistoryStatus} from "../data/work-history.seed";

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

    describe("@work-history", () => {
        const currentProfileId = 1;
        let workHistoryId = 0;

        paths["base"] = [
            service.config.service.prefix,
            service.config.service.route[Route.profile][ProfileRoute.root],
            ProfileRoute.workHistory
        ].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`@create Work History POST: ${paths["base"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, paths["base"], newWorkHistory);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IWorkHistory> = res.body as IApiResponse<IWorkHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.profileId).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.company).not.to.be.undefined;
                    expect(r.result.title).not.to.be.undefined;
                    expect(r.result.description).not.to.be.undefined;
                    expect(r.result.startedOn).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                    workHistoryId = r.result.id;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`@retrieve Work History GET: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], workHistoryId].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IWorkHistory> = res.body as IApiResponse<IWorkHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.profileId).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.company).not.to.be.undefined;
                    expect(r.result.title).not.to.be.undefined;
                    expect(r.result.description).not.to.be.undefined;
                    expect(r.result.startedOn).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`@filter Work History ByProfileId POST: ${paths["filter"]}`, async () => {
            try {
                const filterByProfileId = {
                    filter: WorkHistoryFilter.getWorkHistoryByProfileId,
                    data: {profileId: currentProfileId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByProfileId);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IWorkHistory[]> = res.body as IApiResponse<IWorkHistory[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
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

        it(`@update Work History PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], workHistoryId].join("/"),
                    updateWorkHistory
                );
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IWorkHistory> = res.body as IApiResponse<IWorkHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.profileId).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.status).eq(updateWorkHistory.status);
                    expect(r.result.company).not.to.be.undefined;
                    expect(r.result.company).eq(updateWorkHistory.company);
                    expect(r.result.title).not.to.be.undefined;
                    expect(r.result.title).eq(updateWorkHistory.title);
                    expect(r.result.description).not.to.be.undefined;
                    expect(r.result.description).eq(updateWorkHistory.description);
                    expect(r.result.startedOn).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`@update Work History status PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], workHistoryId].join("/"),
                    updateWorkHistoryStatus
                );
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IWorkHistory> = res.body as IApiResponse<IWorkHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.status).eq(RecordStatus.Archived);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`@delete Education History DELETE: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.DELETE, [paths["base"], workHistoryId].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);

                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).eq(true);
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

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

import {EducationHistoryFilter, ProfileRoute, Route} from "ms-npm/routes/user";
import {IEducationHistory} from "ms-npm/profile-models";

import * as Service from "../../service/user";
import {
    newEducationHistory,
    updateEducationHistory,
    updateEducationHistoryStatus
} from "../data/education-history.seed";

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

    describe("@user-education-history", () => {
        const currentProfileId = 1;
        let educationHistoryId = 0;

        paths["base"] = [
            service.config.service.prefix,
            service.config.service.route[Route.profile][ProfileRoute.root],
            ProfileRoute.educationHistory
        ].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`create Education History POST: ${paths["base"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, paths["base"], newEducationHistory);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IEducationHistory> = res.body as IApiResponse<IEducationHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.profileId).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.school).not.to.be.undefined;
                    expect(r.result.degree).not.to.be.undefined;
                    expect(r.result.description).not.to.be.undefined;
                    expect(r.result.field).not.to.be.undefined;
                    expect(r.result.startedOn).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                    educationHistoryId = r.result.id;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`retrieve Education History GET: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], educationHistoryId].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IEducationHistory> = res.body as IApiResponse<IEducationHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.profileId).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.school).not.to.be.undefined;
                    expect(r.result.degree).not.to.be.undefined;
                    expect(r.result.description).not.to.be.undefined;
                    expect(r.result.field).not.to.be.undefined;
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

        it(`filter Education History ByProfileId POST: ${paths["filter"]}`, async () => {
            try {
                const filterByProfileId = {
                    filter: EducationHistoryFilter.getEducationHistoryByProfileId,
                    data: {profileId: currentProfileId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByProfileId);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IEducationHistory[]> = res.body as IApiResponse<IEducationHistory[]>;
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

        it(`update Education History PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], educationHistoryId].join("/"),
                    updateEducationHistory
                );
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IEducationHistory> = res.body as IApiResponse<IEducationHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.profileId).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.status).eq(updateEducationHistory.status);
                    expect(r.result.school).not.to.be.undefined;
                    expect(r.result.school).eq(updateEducationHistory.school);
                    expect(r.result.degree).not.to.be.undefined;
                    expect(r.result.degree).eq(updateEducationHistory.degree);
                    expect(r.result.field).not.to.be.undefined;
                    expect(r.result.field).eq(updateEducationHistory.field);
                    expect(r.result.description).not.to.be.undefined;
                    expect(r.result.description).eq(updateEducationHistory.description);
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

        it(`update Education History Status PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], educationHistoryId].join("/"),
                    updateEducationHistoryStatus
                );
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IEducationHistory> = res.body as IApiResponse<IEducationHistory>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result.status).to.be.eq(RecordStatus.Archived);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`delete Education History DELETE: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.DELETE, [paths["base"], educationHistoryId].join("/"));
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

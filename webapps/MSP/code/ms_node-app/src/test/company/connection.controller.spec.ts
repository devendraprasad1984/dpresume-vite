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

import {Route} from "ms-npm/routes/company";
import {IMemberRequest} from "ms-npm/user-models";
import {MemberRequestFilter} from "ms-npm/routes/user";

import * as Service from "../../service/company";

const service: Service.Company = container.resolve(Service.Company);
let factory: TestFactory;
const paths: Map<string, string> = new Map();

describe("@company", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    describe("@company-connection", () => {
        const companyRefInvalid = "1";
        const companyRef: string = "251225d2-4652-9367-79b8-5bf2b382fr56";
        //const groupMemberRef: string = "4cw2380c-971f-aa39-5534-73e52c15po25";
        const pendingUpdateId = "4";
        const updateIdNoExist = "50";

        paths["base"] = [service.config.service.prefix, Route.connection].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`filter Member Request ByCompany POST: ${paths["filter"]}`, async () => {
            try {
                const filterByUser = {
                    filter: MemberRequestFilter.getRequestByCompany,
                    data: {companyRef}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("Member Request filter Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IMemberRequest[]> = res.body as IApiResponse<IMemberRequest[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).not.to.be.undefined;
                    expect(r.result.length).to.be.above(0);
                    expect(r.result[0].companyRef).to.be.eq(companyRef);
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
                    filter: MemberRequestFilter.getRequestByCompany,
                    data: {companyRef: companyRefInvalid}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("POST Exception Member Request by User Response: ", res.status, res.body);
                expect(res.status).to.equal(409);
                // get api response
                const r: IApiError = res.body as IApiError;
                factory.log("Api Response: ", r.status, r.message, r.details);
                if (r.message) {
                    expect(r.status).to.equal(409);
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
                    filter: MemberRequestFilter.getRequestByCompany,
                    data: {companyRef: Hasher.guid()}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("POST Exception Member Request non existing by Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IMemberRequest[]> = res.body as IApiResponse<IMemberRequest[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
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

        it(`update accept pending connection PATCH: ${paths["base"]}/${pendingUpdateId} `, async () => {
            try {
                const data: Partial<IMemberRequest> = {status: RecordStatus.Active};

                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], pendingUpdateId].join("/"),
                    data
                );
                factory.log("PATCH Accept connection Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IMemberRequest> = res.body as IApiResponse<IMemberRequest>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.status).equal(RecordStatus.Active);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`exception update connection non existing PATCH: ${paths["base"]}/:id `, async () => {
            try {
                const data: Partial<IMemberRequest> = {status: RecordStatus.Archived};
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], updateIdNoExist].join("/"),
                    data
                );
                factory.log("GET Exception Info update non existing Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.Conflict);
                // get api response
                const r: IApiError = res.body as IApiError;
                factory.log("Api Response: ", r.status, r.message, r.details);
                if (r.message) {
                    expect(r.status).to.equal(Status.Conflict);
                    expect(r.message).not.to.be.undefined;
                } else {
                    expect(r).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });
    });
});

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
import {RecordStatus} from "../../common/db/enums";

import {InfoFilter, Route} from "ms-npm/routes/company";
import {IInfo} from "ms-npm/company-models";

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

    const removeId: string = "1";
    const getInfoId: number = 1;
    const invalidId: number = 0;
    const getInfoIdNoExist: number = 50;
    const updateId: number = 1;
    const updateIdNoExist: number = 50;
    const companyId: number = 1;
    const companyIdNonExist: number = 50;

    paths["base"] = [service.config.service.prefix, service.config.service.route[Route.info]].join("/");
    paths["filter"] = [
        service.config.service.prefix,
        service.config.service.route[Route.info],
        RouteOption.Filter
    ].join("/");

    describe("@company-info", () => {
        it(`retrieve Info by id GET: ${paths["base"]}/${getInfoId} `, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], getInfoId].join("/"));
                factory.log("GET Info by Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IInfo> = res.body as IApiResponse<IInfo>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.bio).not.to.be.empty;
                    expect(r.result.category).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`exception retrieve Info by id invalid GET: ${paths["base"]}/${invalidId} `, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], invalidId].join("/"));
                factory.log("GET Exception Info by Response: ", res.status, res.body);
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

        it(`exception retrieve Info by id non existing record GET: ${paths["base"]}/${getInfoIdNoExist}`, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], getInfoIdNoExist].join("/"));
                factory.log("GET Exception Info non existing Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IInfo> = res.body as IApiResponse<IInfo>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result.id).to.be.undefined;
                } else {
                    expect(r).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter Info By Company Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: InfoFilter.getByCompanyId,
                    data: {companyId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Filter Info By Company Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IInfo[]> = res.body as IApiResponse<IInfo[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.gt(0);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`exception filter Info by id invalid POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: InfoFilter.getByCompanyId,
                    data: {companyId: invalidId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("GET Exception Info by Response: ", res.status, res.body);
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

        it(`exception filter Info By Company Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: InfoFilter.getByCompanyId,
                    data: {companyId: companyIdNonExist}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Filter Info By Company Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IInfo[]> = res.body as IApiResponse<IInfo[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.eq(0);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`update Info PATCH: ${paths["base"]}/${updateId} `, async () => {
            try {
                const newBio = "Bio description updated";
                const data: Partial<IInfo> = {bio: "Bio description updated"};

                const res: Response = await factory.test(Method.PATCH, [paths["base"], updateId].join("/"), data);
                factory.log("PATCH Info Bio Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IInfo> = res.body as IApiResponse<IInfo>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.bio).equal(newBio);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`update suspend Info PATCH: ${paths["base"]}/${updateId} `, async () => {
            try {
                const data: Partial<IInfo> = {status: RecordStatus.Suspended};

                const res: Response = await factory.test(Method.PATCH, [paths["base"], updateId].join("/"), data);
                factory.log("PATCH Suspend Info Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IInfo> = res.body as IApiResponse<IInfo>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.status).equal(RecordStatus.Suspended);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`exception update Info non existing PATCH: ${paths["base"]}/:id `, async () => {
            try {
                const data: Partial<IInfo> = {status: RecordStatus.Archived};
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

        it(`exception update Info invalid PATCH: ${paths["base"]}/:id `, async () => {
            try {
                const data: Partial<IInfo> = {status: RecordStatus.Archived};
                const res: Response = await factory.test(Method.PATCH, [paths["base"], invalidId].join("/"), data);
                factory.log("GET Exception Info update invalid Response: ", res.status, res.body);
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

        it(`delete Info DELETE: ${paths["base"]}/${removeId} `, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, [paths["base"], removeId].join("/"));
                factory.log("DELETE Info Response: ", res.status, res.body);

                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(res.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).to.be.true;
                } else {
                    //hard delete could fail due to relations
                    expect(res.body.message).to.contain("Foreign key constraint failed");
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`exception delete Info DELETE: ${paths["base"]}/${invalidId} `, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, [paths["base"], invalidId].join("/"));
                factory.log("GET Exception Info by Response: ", res.status, res.body);
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

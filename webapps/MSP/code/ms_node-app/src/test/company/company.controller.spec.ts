import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";

import {Method, RouteOption, Status} from "fnpm/enums";
import {IApiError, IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {CompanyFilter, Route} from "ms-npm/routes/company";

import * as Service from "../../service/company";
import {ICompanySearch} from "ms-npm/search-models";

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

    paths["ping"] = [service.config.service.prefix, service.config.service.route[Route.ping]].join("/");
    paths["filter"] = [service.config.service.prefix, RouteOption.Filter].join("/");

    it(`@system get: ${paths}`, async () => {
        try {
            const res = await factory.test(Method.GET, paths["ping"]);
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

    it(`filter Company no jobs POST: ${paths["filter"]}`, async () => {
        try {
            const filterById = {
                filter: CompanyFilter.explore,
                data: {
                    keywords: "Test",
                    location: [],
                    hasOpenJobs: false,
                    industry: ["Retail"]
                }
            };
            const res = await factory.test(Method.POST, paths["filter"], filterById);
            factory.log("POST Filter Company no jobs Response: ", res.status, res.body);
            expect(res.status).to.equal(Status.OK);
            // get api response
            const r: IApiResponse<ICompanySearch[]> = res.body as IApiResponse<ICompanySearch[]>;
            factory.log("Api Response: ", r.status, r.result, r.error);
            if (r.result) {
                expect(r.status).to.equal(Status.OK);
                expect(r.result).not.to.be.undefined;
                expect(r.result.length).to.be.gt(0);
                expect(r.result[0].info.name).to.be.eq("Test company");
            } else {
                expect(r.result).to.be.undefined;
            }
        } catch (ex) {
            factory.log("Exception: ", ex);
            throw ex;
        }
    });

    it(`filter Company with jobs POST: ${paths["filter"]}`, async () => {
        try {
            const filterById = {
                filter: CompanyFilter.explore,
                data: {
                    keywords: "Second",
                    location: [],
                    hasOpenJobs: true,
                    industry: ["Retail"]
                }
            };
            const res = await factory.test(Method.POST, paths["filter"], filterById);
            factory.log("POST Filter Company with jobs Response: ", res.status, res.body);
            expect(res.status).to.equal(Status.OK);
            // get api response
            const r: IApiResponse<ICompanySearch[]> = res.body as IApiResponse<ICompanySearch[]>;
            factory.log("Api Response: ", r.status, r.result, r.error);
            if (r.result) {
                expect(r.status).to.equal(Status.OK);
                expect(r.result).not.to.be.undefined;
                expect(r.result.length).to.be.gt(0);
                expect(r.result[0].info.name).to.be.eq("Second company");
            } else {
                expect(r.result).to.be.undefined;
            }
        } catch (ex) {
            factory.log("Exception: ", ex);
            throw ex;
        }
    });

    it(`exception filter Company invalid POST: ${paths["filter"]}`, async () => {
        try {
            const filterById = {
                filter: CompanyFilter.explore,
                data: {
                    keywords: "Second",
                    location: [],
                    hasOpenJobs: true,
                    industry: ["Retail"]
                }
            };
            const res = await factory.test(Method.POST, paths["filter"], filterById);
            factory.log("POST Filter Company invalid data Response: ", res.status, res.body);
            expect(res.status).to.equal(Status.Conflict);
            // get api response
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
});

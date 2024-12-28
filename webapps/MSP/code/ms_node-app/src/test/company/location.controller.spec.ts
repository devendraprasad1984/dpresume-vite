/* eslint-disable @typescript-eslint/typedef */
import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";

import {Method, RouteOption, Status} from "fnpm/enums";
import {TestFactory} from "fnpm/endpoint-test-factory";
import {IApiResponse} from "fnpm/core";

import {LocationFilter, Route} from "ms-npm/routes/company";

import * as Service from "../../service/company";
import {ILocationQuery} from "ms-npm/search-models";
import {ILocation} from "ms-npm/base-models";

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

    describe("@company-location", () => {
        paths["base"] = [service.config.service.prefix, Route.location].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`retrieve Location GET: ${paths["base"]} `, async () => {
            try {
                const res = await factory.test(Method.GET, paths["base"]);
                factory.log("GET Location Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<ILocation[]> = res.body as IApiResponse<ILocation[]>;
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

        it(`filter Company location POST: ${paths["filter"]}`, async () => {
            try {
                const filterByUser = {
                    filter: LocationFilter.getByKeyword,
                    data: <ILocationQuery>{
                        keywordCity: "",
                        keywordState: ""
                    }
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUser);
                factory.log("POST Location Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<ILocation[]> = res.body as IApiResponse<ILocation[]>;
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
    });
});

import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method} from "fnpm/enums";
import {IApiResponse, IPaginationResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {Route} from "ms-npm/routes/admin";
import {IUserSearch} from "ms-npm/admin-models";

import * as Service from "../../service/admin";

const service: Service.Admin = container.resolve(Service.Admin);
let factory: TestFactory;
const paths: Map<string, string> = new Map();

describe("@admin", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    describe("@admin-user", () => {
        const pagination = "?perPage=5&page=2";
        paths["userList"] = [service.config.service.prefix, Route.user].join("/");

        it(`retrieve GET: ${paths["userList"]}${pagination} `, async () => {
            try {
                const res: Response = await factory.test(Method.GET, paths["userList"] + pagination);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IPaginationResponse<IUserSearch[]>> = res.body as IApiResponse<
                    IPaginationResponse<IUserSearch[]>
                >;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.data.length).to.be.greaterThan(0);
                    expect(r.result[0].ref).not.to.be.undefined;
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

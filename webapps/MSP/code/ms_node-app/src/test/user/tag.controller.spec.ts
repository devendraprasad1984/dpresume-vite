import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method} from "fnpm/enums";
import {IApiError, IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {Route} from "ms-npm/routes/user";
import {ITag} from "ms-npm/base-models";

import * as Service from "../../service/user";

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

    const tagRemoveId: string = "9";
    const tagMSRemoveId: string = "1";
    const tagRemoveIdNonExisting: string = "0";

    paths["base"] = [service.config.service.prefix, service.config.service.route[Route.tag]].join("/");
    paths["deleteTag"] = [paths["base"], tagRemoveId].join("/");
    paths["deleteTagInvalid"] = [paths["base"], tagRemoveIdNonExisting].join("/");
    paths["deleteMSTag"] = [paths["base"], tagMSRemoveId].join("/");

    describe("@user-tag", () => {
        it(`retrieve Tags GET: ${paths["base"]} `, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"]].join("/"));
                factory.log("GET Tags Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<ITag[]> = res.body as IApiResponse<ITag[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.gt(0);
                    expect(r.result[0].ref).not.to.be.undefined;
                    expect(r.result[0].status).not.to.be.undefined;
                    expect(r.result[0].audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`delete Tag DELETE: ${paths["deleteTag"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, paths["deleteTag"]);
                factory.log("DELETE Tag Response: ", res.status, res.body);

                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(res.status).to.equal(200);
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

        it(`delete MS Tag DELETE: ${paths["deleteTag"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, paths["deleteMSTag"]);
                factory.log("DELETE MS Tag Response: ", res.status, res.body);

                // get api response
                const r: IApiResponse<boolean> = res.body as IApiResponse<boolean>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(res.status).to.equal(200);
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

        it(`exception delete Tag DELETE: ${paths["deleteTagInvalid"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, paths["deleteTagInvalid"]);
                factory.log("DELETE Invalid Tag Response: ", res.status, res.body);

                // get api response
                const r: IApiError = res.body as IApiError;
                factory.log("Api Response: ", r.status, r.message, r.details);
                if (r.message) {
                    expect(res.status).to.equal(409);
                    expect(r.message).not.to.be.undefined;
                } else {
                    //hard delete could fail due to relations
                    expect(res.body.message).to.contain("Foreign key constraint failed");
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });
    });
});

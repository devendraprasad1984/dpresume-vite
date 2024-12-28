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

import {IPersonnelSearch, IPersonnel} from "ms-npm/company-models";
import {PersonnelFilter, Route} from "ms-npm/routes/company";
import {Role} from "ms-npm/auth-models";

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

    const invalidId: number = 0;
    const companyId: number = 1;
    const userId: number = 1;
    const companyIdNonExist: number = 50;
    let newPersonnelId: number = 0;

    paths["base"] = [service.config.service.prefix, service.config.service.route[Route.personnel]].join("/");
    paths["filter"] = [
        service.config.service.prefix,
        service.config.service.route[Route.personnel],
        RouteOption.Filter
    ].join("/");

    describe("@company-personnel", () => {
        it(`filter All Personnel By Company Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: PersonnelFilter.getAllConnections,
                    data: {companyId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Filter Personnel By Company Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnelSearch[]> = res.body as IApiResponse<IPersonnelSearch[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.gt(2);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter Employee Personnel By Company Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: PersonnelFilter.getEmployeeConnections,
                    data: {companyId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Filter Personnel By Company Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnelSearch[]> = res.body as IApiResponse<IPersonnelSearch[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.gt(0);
                    expect(r.result[0].role).not.to.be.eq(Role.User);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter User Personnel By Company Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: PersonnelFilter.getUserConnections,
                    data: {companyId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Filter Personnel By Company Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnelSearch[]> = res.body as IApiResponse<IPersonnelSearch[]>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(Status.OK);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.gt(0);
                    expect(r.result[0].role).to.be.eq(Role.User);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`exception filter Personnel by id invalid POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: PersonnelFilter.getAllConnections,
                    data: {companyId: invalidId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Exception Personnel by Invalid Response: ", res.status, res.body);
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

        it(`exception filter Personnel By Company Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: PersonnelFilter.getAllConnections,
                    data: {companyId: companyIdNonExist}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Exception Personnel by non existing Company Response: ", res.status, res.body);
                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnelSearch[]> = res.body as IApiResponse<IPersonnelSearch[]>;
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

        it(`exception create Personnel company id non exist POST: ${paths["base"]}`, async () => {
            try {
                const data: object = [
                    {
                        userId: userId,
                        companyId: companyIdNonExist,
                        role: Role.Member
                    }
                ];
                const res = await factory.test(Method.POST, paths["base"], data);
                factory.log("POST Exception create Personnel invalid company id Response: ", res.status, res.body);
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

        it(`exception create Personnel invalid company id POST: ${paths["base"]}`, async () => {
            try {
                const data: object = [
                    {
                        userId: userId,
                        companyId: invalidId,
                        role: Role.Member
                    }
                ];
                const res = await factory.test(Method.POST, paths["base"], data);
                factory.log("POST Exception create Personnel invalid company id Response: ", res.status, res.body);
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

        it(`create Personnel one POST: ${paths["base"]}`, async () => {
            try {
                const data: object = [
                    {
                        userId: userId,
                        companyId: companyId,
                        role: Role.Member
                    }
                ];

                const res: Response = await factory.test(Method.POST, paths["base"], data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnel> = res.body as IApiResponse<IPersonnel>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result).to.be.eql(true);

                    const filterById = {
                        filter: PersonnelFilter.getAllConnections,
                        data: {companyId}
                    };
                    const resFilter = await factory.test(Method.POST, paths["filter"], filterById);
                    factory.log("POST Filter Personnel By Company Response: ", resFilter.status, resFilter.body);
                    expect(resFilter.status).to.equal(Status.OK);
                    // get api response
                    const rFilter: IApiResponse<IPersonnelSearch[]> = resFilter.body as IApiResponse<
                        IPersonnelSearch[]
                    >;
                    if (rFilter.result) {
                        expect(rFilter.status).to.equal(Status.OK);
                        expect(rFilter.result).not.to.be.undefined;
                        expect(rFilter.result.length).to.be.gt(0);
                        const filter = rFilter.result.filter((per) => per.role === Role.Member)[0];
                        newPersonnelId = filter.id;
                    } else {
                        expect(r.result).to.be.undefined;
                    }
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`exception update Personnel invalid id PATCH: ${paths["base"]}/${invalidId} `, async () => {
            try {
                const data: object = {role: Role.User};
                const res = await factory.test(Method.PATCH, [paths["base"], invalidId].join("/"), data);
                factory.log("POST Exception update Personnel invalid id Response: ", res.status, res.body);
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

        it(`update Personnel PATCH: ${paths["base"]}`, async () => {
            try {
                const data: object = {role: Role.User};

                const res: Response = await factory.test(Method.PATCH, [paths["base"], newPersonnelId].join("/"), data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnel> = res.body as IApiResponse<IPersonnel>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.userId).not.to.be.undefined;
                    expect(r.result.companyId).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`update Personnel status PATCH: ${paths["base"]}`, async () => {
            try {
                const data: object = {status: RecordStatus.Archived};

                const res: Response = await factory.test(Method.PATCH, [paths["base"], newPersonnelId].join("/"), data);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnel> = res.body as IApiResponse<IPersonnel>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.userId).not.to.be.undefined;
                    expect(r.result.companyId).not.to.be.undefined;
                    expect(r.result.status).to.be.eq(RecordStatus.Archived);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`exception delete Personnel invalid id DELETE: ${paths["base"]}/${invalidId} `, async () => {
            try {
                const data: object = {role: Role.User};
                const res = await factory.test(Method.DELETE, [paths["base"], invalidId].join("/"), data);
                factory.log("POST Exception update Personnel invalid id Response: ", res.status, res.body);
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

        it(`delete Personnel DELETE: ${paths["base"]}/${newPersonnelId}`, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, [paths["base"], newPersonnelId].join("/"));
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(Status.OK);
                // get api response
                const r: IApiResponse<IPersonnel> = res.body as IApiResponse<IPersonnel>;
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
    });
});

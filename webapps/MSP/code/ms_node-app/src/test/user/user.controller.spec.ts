import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {Method, RouteOption} from "fnpm/enums";
import {IApiError, IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";
import {RecordStatus} from "../../common/db/enums";

import {Route, UserFilter} from "ms-npm/routes/user";
import {Role} from "ms-npm/auth-models";
import {IUser} from "ms-npm/user-models";
import {IUserSearch} from "ms-npm/admin-models";

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

    const userRemoveId: string = "1";
    const userRemoveHardId: string = "2";
    const getUserId: number = 5;
    const invalidId: number = 0;
    const getUserIdNoExist: number = 50;
    const updateId: string = "3";
    const updateIdNoExist: number = 50;
    const suspendId: string = "4";

    paths["ping"] = [service.config.service.prefix, service.config.service.route[Route.ping]].join("/");
    paths["base"] = service.config.service.prefix;
    paths["filter"] = [service.config.service.prefix, RouteOption.Filter].join("/");
    paths["update"] = [service.config.service.prefix, updateId].join("/");
    paths["suspendUser"] = [service.config.service.prefix, suspendId].join("/");
    paths["archiveUser"] = [service.config.service.prefix, userRemoveId].join("/");
    paths["deleteUser"] = [service.config.service.prefix, userRemoveHardId].join("/");

    it(`@system get: ${paths["ping"]}`, async () => {
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
    describe("@user-user", () => {
        it(`retrieve User by id GET: ${paths["base"]}/:id `, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], getUserId].join("/"));
                factory.log("GET User by Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUser> = res.body as IApiResponse<IUser>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.role).not.to.be.undefined;
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

        it(`exception retrieve User by id invalid GET: ${paths["base"]}/:id `, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], invalidId].join("/"));
                factory.log("GET Exception User by Response: ", res.status, res.body);
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

        it(`exception retrieve User by id non existing user GET: ${paths["base"]}/:id `, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], getUserIdNoExist].join("/"));
                factory.log("GET Exception User by Response: ", res.status, res.body);
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

        it(`filter Users Connected With Me POST: ${paths["filter"]} `, async () => {
            try {
                const filter = {
                    filter: UserFilter.connectedWithMe,
                    data: {userId: 1}
                };
                const res = await factory.test(Method.POST, paths["filter"], filter);
                factory.log("POST users connected Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUserSearch[]> = res.body as IApiResponse<IUserSearch[]>;
                factory.log("Api Response:", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.above(0);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter Users No Connected With Me POST: ${paths["filter"]} `, async () => {
            try {
                const filter = {
                    filter: UserFilter.notConnectedWithMe,
                    data: {userId: 1}
                };
                const res = await factory.test(Method.POST, paths["filter"], filter);
                factory.log("POST users not connected Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUserSearch[]> = res.body as IApiResponse<IUserSearch[]>;
                factory.log("Api Response:", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.above(0);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter Users Without Connections Me POST: ${paths["filter"]} `, async () => {
            try {
                const filter = {
                    filter: UserFilter.withoutConnections,
                    data: {userId: 1}
                };
                const res = await factory.test(Method.POST, paths["filter"], filter);
                factory.log("POST users without connections Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUserSearch[]> = res.body as IApiResponse<IUserSearch[]>;
                factory.log("Api Response:", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.length).to.be.above(0);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`update User role PATCH: ${paths["update"]} `, async () => {
            try {
                const data: Partial<IUser> = {role: Role.Admin};

                const res: Response = await factory.test(Method.PATCH, paths["update"], data);
                factory.log("PATCH User Role Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUser> = res.body as IApiResponse<IUser>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.role).equal(Role.Admin);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`update suspend User PATCH: ${paths["suspendUser"]} `, async () => {
            try {
                const data: Partial<IUser> = {status: RecordStatus.Suspended};

                const res: Response = await factory.test(Method.PATCH, paths["suspendUser"], data);
                factory.log("PATCH Suspend User Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUser> = res.body as IApiResponse<IUser>;
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

        it(`update archive User PATCH: ${paths["archiveUser"]} `, async () => {
            try {
                const data: Partial<IUser> = {status: RecordStatus.Archived};

                const res: Response = await factory.test(Method.PATCH, paths["archiveUser"], data);
                factory.log("PATCH Archive User Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IUser> = res.body as IApiResponse<IUser>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.status).to.be.eq(RecordStatus.Archived);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`exception update User invalid PATCH: ${paths["base"]}/:id `, async () => {
            try {
                const data: Partial<IUser> = {status: RecordStatus.Archived};
                const res: Response = await factory.test(Method.PATCH, [paths["base"], invalidId].join("/"), data);
                factory.log("GET Exception User by Response: ", res.status, res.body);
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

        it(`exception update User non existing PATCH: ${paths["base"]}/:id `, async () => {
            try {
                const data: Partial<IUser> = {status: RecordStatus.Archived};
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], updateIdNoExist].join("/"),
                    data
                );
                factory.log("GET Exception User by Response: ", res.status, res.body);
                expect(res.status).to.equal(409);
                // get api response
                const r: IApiError = res.body as IApiError;
                factory.log("Api Response: ", r.status, r.message, r.details);
                if (r.message) {
                    expect(r.status).to.equal(409);
                    expect(r.message).not.to.be.undefined;
                } else {
                    expect(r).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`delete User DELETE: ${paths["deleteUser"]} `, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, paths["deleteUser"]);
                factory.log("DELETE User Response: ", res.status, res.body);

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

        it(`exception delete User DELETE: ${paths["base"]}/:id `, async () => {
            try {
                const res: Response = await factory.test(Method.DELETE, [paths["base"], invalidId].join("/"));
                factory.log("GET Exception User by Response: ", res.status, res.body);
                expect(res.status).to.equal(409);
                // get api response
                const r: IApiError = res.body as IApiError;
                factory.log("Api Response: ", r.status, r.message, r.details);
                if (r.message) {
                    expect(r.status).to.equal(409);
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

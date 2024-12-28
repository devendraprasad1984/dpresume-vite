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
import {RecordStatus} from "../../common/db/enums";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {INote} from "ms-npm/admin-models";
import {NotesFilter, Route} from "ms-npm/routes/admin";

import * as Service from "../../service/admin";
import {newNote, updateNote, updateNoteStatus} from "../data/note.seed";

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

    describe("@admin-note", () => {
        const currentUserId = 1;
        let noteId = 0;

        paths["base"] = [service.config.service.prefix, service.config.service.route[Route.note]].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`create note POST: ${paths["base"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, paths["base"], newNote);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<INote> = res.body as IApiResponse<INote>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    noteId = r.result.id;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`retrieve all notes GET: ${paths["base"]}`, async () => {
            try {
                const res = await factory.test(Method.GET, paths["base"]);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<INote[]> = res.body as IApiResponse<INote[]>;
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

        it(`retrieve note by id GET: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], noteId].join("/"));
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<INote> = res.body as IApiResponse<INote>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.userId).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter note ByUserId POST: ${paths["filter"]}`, async () => {
            try {
                const filterByUserId = {
                    filter: NotesFilter.getByUserId,
                    data: {userId: currentUserId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterByUserId);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<INote> = res.body as IApiResponse<INote>;
                factory.log("Api Response:", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result[0].id).not.to.be.undefined;
                    expect(r.result[0].status).not.to.be.undefined;
                    expect(r.result[0].userId).not.to.be.undefined;
                    expect(r.result[0].userId).eql(currentUserId);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`update note PATCH: ${paths["base"]}:id`, async () => {
            try {
                const res: Response = await factory.test(Method.PATCH, [paths["base"], noteId].join("/"), updateNote);
                factory.log("Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<INote> = res.body as IApiResponse<INote>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.userId).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`update note status PATCH: ${paths["base"]}:id`, async () => {
            try {
                const res = await factory.test(Method.PATCH, [paths["base"], noteId].join("/"), updateNoteStatus);
                factory.log("Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<INote> = res.body as IApiResponse<INote>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).to.be.eq(RecordStatus.Archived);
                    expect(r.result.userId).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`hard delete post `, async () => {
            try {
                const res = await factory.test(Method.DELETE, [paths["base"], noteId].join("/"));
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

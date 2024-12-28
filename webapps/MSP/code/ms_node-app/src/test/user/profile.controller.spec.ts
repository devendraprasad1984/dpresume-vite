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

import {ProfileFilter, ProfileRoute, Route} from "ms-npm/routes/user";
import {IProfile} from "ms-npm/profile-models";

import * as Service from "../../service/user";
import {newProfile, updateProfile, updateProfileStatus, updateProfileTags} from "../data/profile.seed";

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

    describe("@user-profile", () => {
        const currentUserId = 11;
        const deleteProfileId = 3;
        let profileId = 0;

        paths["base"] = [
            service.config.service.prefix,
            service.config.service.route[Route.profile][ProfileRoute.root]
        ].join("/");
        paths["filter"] = [paths["base"], RouteOption.Filter].join("/");

        it(`create Profile POST: ${paths["base"]}`, async () => {
            try {
                const res: Response = await factory.test(Method.POST, paths["base"], newProfile);
                factory.log("POST Create Profile Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile> = res.body as IApiResponse<IProfile>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.ref).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                    profileId = r.result.id;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`retrieve all Profiles GET: ${paths["base"]}`, async () => {
            try {
                const res = await factory.test(Method.GET, paths["base"]);
                factory.log("GET All Profiles Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile[]> = res.body as IApiResponse<IProfile[]>;
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

        it(`retrieve Profile By Id GET: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.GET, [paths["base"], profileId].join("/"));
                factory.log("GET Profile By Id Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile> = res.body as IApiResponse<IProfile>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.userId).not.to.be.undefined;
                    expect(r.result.basicInfo).not.to.be.undefined;
                    expect(r.result.bio).not.to.be.undefined;
                    expect(r.result.workHistory).not.to.be.undefined;
                    expect(r.result.educationHistory).not.to.be.undefined;
                    expect(r.result.publicContactInfo).not.to.be.undefined;
                    expect(r.result.privateContactInfo).not.to.be.undefined;
                    expect(r.result.personalData).not.to.be.undefined;
                    expect(r.result.MSPshipObjectives).not.to.be.undefined;
                    expect(r.result.notifications).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`filter Profile By User Id POST: ${paths["filter"]}`, async () => {
            try {
                const filterById = {
                    filter: ProfileFilter.getByUserId,
                    data: {userId: currentUserId}
                };
                const res = await factory.test(Method.POST, paths["filter"], filterById);
                factory.log("POST Filter Profile By User Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile> = res.body as IApiResponse<IProfile>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.userId).not.to.be.undefined;
                    expect(r.result.userId).eql(currentUserId);
                    expect(r.result.basicInfo).not.to.be.undefined;
                    expect(r.result.bio).not.to.be.undefined;
                    expect(r.result.workHistory).not.to.be.undefined;
                    expect(r.result.educationHistory).not.to.be.undefined;
                    expect(r.result.publicContactInfo).not.to.be.undefined;
                    expect(r.result.privateContactInfo).not.to.be.undefined;
                    expect(r.result.personalData).not.to.be.undefined;
                    expect(r.result.MSPshipObjectives).not.to.be.undefined;
                    expect(r.result.notifications).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`update Profile PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], profileId].join("/"),
                    updateProfile
                );
                factory.log("PATCH Update Profile Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile> = res.body as IApiResponse<IProfile>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.status).eq(updateProfile.status);
                    expect(r.result.userId).not.to.be.undefined;
                    expect(r.result.basicInfo).not.to.be.undefined;
                    expect(r.result.basicInfo.firstName).eq(updateProfile.basicInfo.firstName);
                    expect(r.result.basicInfo.lastName).eq(updateProfile.basicInfo.lastName);
                    expect(r.result.bio).not.to.be.undefined;
                    expect(r.result.publicContactInfo).not.to.be.undefined;
                    expect(r.result.privateContactInfo).not.to.be.undefined;
                    expect(r.result.personalData).not.to.be.undefined;
                    expect(r.result.MSPshipObjectives).not.to.be.undefined;
                    expect(r.result.notifications).not.to.be.undefined;
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`update Profile Tags PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], profileId].join("/"),
                    updateProfileTags
                );
                factory.log("PATCH Update Profile Tags Response: ", res.status, res.body);

                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile> = res.body as IApiResponse<IProfile>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.id).not.to.be.undefined;
                    expect(r.result.status).not.to.be.undefined;
                    expect(r.result.status).eq(updateProfile.status);
                    expect(r.result.userId).not.to.be.undefined;
                    expect(r.result.basicInfo).not.to.be.undefined;
                    expect(r.result.basicInfo.firstName).eq(updateProfile.basicInfo.firstName);
                    expect(r.result.basicInfo.lastName).eq(updateProfile.basicInfo.lastName);
                    expect(r.result.bio).not.to.be.undefined;
                    expect(r.result.publicContactInfo).not.to.be.undefined;
                    expect(r.result.privateContactInfo).not.to.be.undefined;
                    expect(r.result.personalData).not.to.be.undefined;
                    expect(r.result.MSPshipObjectives).not.to.be.undefined;
                    expect(r.result.notifications).not.to.be.undefined;
                    expect(r.result.MSPshipObjectives.skills.tags.length).to.be.eq(1);
                    expect(r.result.audit).not.to.be.undefined;
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", JSON.stringify(ex));
                throw ex;
            }
        });

        it(`update Profile Status PATCH: ${paths["base"]}/:id`, async () => {
            try {
                const res: Response = await factory.test(
                    Method.PATCH,
                    [paths["base"], deleteProfileId].join("/"),
                    updateProfileStatus
                );
                factory.log("PATCH Update Profile Status Response: ", res.status, res.body);
                expect(res.status).to.equal(200);
                // get api response
                const r: IApiResponse<IProfile> = res.body as IApiResponse<IProfile>;
                factory.log("Api Response: ", r.status, r.result, r.error);
                if (r.result) {
                    expect(r.status).to.equal(200);
                    expect(r.result).not.to.be.undefined;
                    expect(r.result.status).eq(RecordStatus.Archived);
                } else {
                    expect(r.result).to.be.undefined;
                }
            } catch (ex) {
                factory.log("Exception: ", ex);
                throw ex;
            }
        });

        it(`delete Profile DELETE: ${paths["base"]}/:id`, async () => {
            try {
                const res = await factory.test(Method.DELETE, [paths["base"], deleteProfileId].join("/"));
                factory.log("DELETE Profile Response: ", res.status, res.body);
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

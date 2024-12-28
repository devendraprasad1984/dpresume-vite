import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Response} from "supertest";

import {EncryptionType, Header, Method, Status} from "fnpm/enums";
import {IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {Route} from "ms-npm/routes/auth";

import * as Service from "../../service/auth";
import {IAuthResponse, IMetadata} from "ms-npm/auth-models";
import {Encoder, Encryptor, Hasher} from "fnpm/utils";

const service: Service.Auth = container.resolve(Service.Auth);
let factory: TestFactory;
const paths: Map<string, string> = new Map();

describe("@auth", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    paths["ping"] = [service.config.service.prefix, service.config.service.route[Route.ping]].join("/");
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

    //TODO Delete the user created in this suite test
    paths["auth"] = [service.config.service.prefix, service.config.service.route[Route.validate]].join("/");
    const aToken =
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkVmTExWZ0EwS3ZkZTdubG1Vay02RyJ9.eyJpc3MiOiJodHRwczovL21lbnRvci1zcGFjZXMtMi1kZXYudXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTE4Mzc1MDk2MTE2MDEzODY3NTI2IiwiYXVkIjpbImh0dHBzOi8vbWVudG9yLXNwYWNlcy0yLWRldi51cy5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vbWVudG9yLXNwYWNlcy0yLWRldi51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjQ5Mjg5MTMyLCJleHAiOjE2NDkzNzU1MzIsImF6cCI6IkVQdDdkSWxGQzR3Yk15NzFsRnRoMGN5VnZHbm1ZNk85Iiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCByZWFkOmN1cnJlbnRfdXNlciB1cGRhdGU6Y3VycmVudF91c2VyX21ldGFkYXRhIn0.p4EkI40ZWk_Xaw9WwT3rdeujcH5wtgaMRfVRLUJWCwxe6bijSIhLnDHle1j8Vy7Ltem4XmmaciRlhLOoWHK7LnnlAYhHuG-JjD66dnQ7ma6mAHM7o-jmv4S0oRofQqPSUf8qAQwOFV7zvkCUywyLmw1LkQ0hYaPic8sPs9XELU08gfqU_Wg_fXK_eUZJqvXN6AVoUWTRlqnMRw8XI_NVCiLRjxwte6HTRiXRAsTxGZzYOG7r3Vo4pHjGvOzln75bJbcBjbt1EXZtCQzyLSV23xICKhQi9FzJoZAaN7Ic9v3JamOkv01iibLWbdMmGShW5EFqf5IxD-874zpdxaOdNg";

    it(`validate get `, async () => {
        try {
            const headers: Map<string, string> = new Map<string, string>();
            headers.set(Header.Authorization, aToken);

            const res: Response = await factory.test(Method.GET, paths["auth"], undefined, headers);
            factory.log("Response: ", res.status, res.body);

            expect(res.status).to.equal(Status.OK);
            // get api response
            const r: IApiResponse<IAuthResponse> = res.body as IApiResponse<IAuthResponse>;
            factory.log("Api Response: ", r.status, r.result, r.error);
            if (r.result) {
                expect(r.status).to.equal(Status.OK);
                expect(r.result).not.to.be.undefined;
                expect(r.result.metadata).not.to.be.undefined;
                try {
                    // decrypt metadata
                    const tokenArray: string[] = aToken.split(".");
                    const key: string = tokenArray[tokenArray.length - 1];
                    const cipher: string = Encoder.fromBase64(r.result.metadata);
                    const decryptedValue: string = Encryptor.decrypt(EncryptionType.AES, cipher, key);
                    try {
                        const metadata: IMetadata = JSON.parse(decryptedValue);
                        // check for id, ref
                        expect(metadata.user).not.to.be.undefined;
                        expect(metadata.user.id).to.be.greaterThan(0);
                        expect(metadata.user.ref).not.to.be.undefined;
                        expect(metadata.user.ref.length).to.be.greaterThan(0);
                        expect(Hasher.isGuid(metadata.user.ref)).to.be.true;
                    } catch (ex) {
                        factory.log("Exception: ", JSON.stringify(ex));
                        throw ex;
                    }
                } catch (ex) {
                    factory.log("Exception: ", JSON.stringify(ex));
                    throw ex;
                }
            } else {
                expect(r.result).to.be.undefined;
            }
        } catch (ex) {
            factory.log("Exception: ", JSON.stringify(ex));
            throw ex;
        }
    });

    it(`validate-fail get `, async () => {
        try {
            const res: Response = await factory.test(Method.GET, paths["auth"]);
            factory.log("Response: ", res.status, res.body);

            expect(res.status).not.to.equal(Status.OK);
            // get api response
            const r: IApiResponse<IAuthResponse> = res.body as IApiResponse<IAuthResponse>;
            factory.log("Api Response: ", r.status, r.result, r.error);
            if (r.result) {
                expect(r.status).to.equal(Status.Conflict);
                expect(r.result).not.to.be.undefined;
            } else {
                expect(r.result).to.be.undefined;
            }
        } catch (ex) {
            factory.log("Exception: ", JSON.stringify(ex));
            throw ex;
        }
    });
});

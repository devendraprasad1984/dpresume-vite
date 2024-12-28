import dotenv from "dotenv";

dotenv.config();
import "reflect-metadata";
import {container} from "tsyringe";
import {describe, it} from "mocha";
import {expect} from "chai";

import {Method} from "fnpm/enums";
import {IApiResponse} from "fnpm/core";
import {TestFactory} from "fnpm/endpoint-test-factory";

import {Route} from "ms-npm/routes/admin";

import * as Service from "../../service/admin";

const service: Service.Admin = container.resolve(Service.Admin);
let factory: TestFactory;

describe("@admin", () => {
    before(() => {
        factory = new TestFactory(service.app);
    });

    after(() => {
        container.clearInstances();
    });

    const path = [service.config.service.prefix, service.config.service.route[Route.ping]].join("/");

    it(`@system get: ${path}`, async () => {
        try {
            const res = await factory.test(Method.GET, path);
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
});

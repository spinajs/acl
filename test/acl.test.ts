
import { DI } from '@spinajs/di';
import { FrameworkConfiguration, Configuration } from "@spinajs/configuration";
import { join, normalize, resolve } from 'path';
import { LogModule, SpinaJsDefaultLog } from "@spinajs/log";
import { SqliteOrmDriver } from "@spinajs/orm-sqlite";
import { Orm } from "@spinajs/orm";
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { Acl } from './../src';
import { Role } from '../src/models/Role';

const expect = chai.expect;
chai.use(chaiAsPromised);


function dir(path: string) {
    return resolve(normalize(join(__dirname, path)));
}

function db() {
    return DI.get(Orm);
}

function acl() {
    return DI.resolve(Acl);
}

describe("Cli tests", () => {

    beforeEach(async () => {
        DI.clear();
        DI.register(FrameworkConfiguration).as(Configuration);
        DI.register(SpinaJsDefaultLog).as(LogModule);
        DI.register(SqliteOrmDriver).as("orm-driver-sqlite");

        await DI.resolve(Configuration, [null, null, [dir("./config")]]);
        await DI.resolve(LogModule);
        await DI.resolve(Orm);
    });

    afterEach(async () => {
        DI.clear();
    });

    it("Should migrate acl tables", async () => {

        expect(db().Connections.get("default").select().from("users")).to.be.fulfilled;
        expect(db().Connections.get("default").select().from("user_metadatas")).to.be.fulfilled;
        expect(db().Connections.get("default").select().from("roles")).to.be.fulfilled;
        expect(db().Connections.get("default").select().from("user_to_role")).to.be.fulfilled;
        expect(db().Connections.get("default").select().from("resources")).to.be.fulfilled;
        expect(db().Connections.get("default").select().from("role_to_resource")).to.be.fulfilled;
    });

    it("Should sync roles from config", async () => {

        await acl();

        const roles : Role[] = await Role.all().populate("Resources");

        expect(roles.length).to.eq(2);
        expect(roles[0]).to.include({
            Name: "User management",
            Slug: "admin.user"
        });
        expect(roles[1]).to.include({
            Name: "Guest account",
            Slug: "guest"
        });
    });

});
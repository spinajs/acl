import { BasicPasswordProvider } from '../src/passwordProvider';
import { DI } from '@spinajs/di';
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { PasswordProvider, SimpleDbAuthProvider, AuthProvider, User, Role } from '../src';
import { expect } from 'chai';
import { FrameworkConfiguration, Configuration } from '@spinajs/configuration';
import { SpinaJsDefaultLog, LogModule } from '@spinajs/log';
import { SqliteOrmDriver } from '@spinajs/orm-sqlite';
import { Orm } from '@spinajs/orm';
import { join, normalize, resolve } from 'path';
 
chai.use(chaiAsPromised);

function dir(path: string) {
    return resolve(normalize(join(__dirname, path)));
}

 
describe("Authorization provider tests", () => {

    beforeEach(async () => {
        DI.clear();
        DI.register(SimpleDbAuthProvider).as(AuthProvider);
        DI.register(FrameworkConfiguration).as(Configuration);
        DI.register(SpinaJsDefaultLog).as(LogModule);
        DI.register(SqliteOrmDriver).as("orm-driver-sqlite");
        DI.register(BasicPasswordProvider).as(PasswordProvider);


        await DI.resolve(Configuration, [null, null, [dir("./config")]]);
        await DI.resolve(LogModule);
        await DI.resolve(Orm);
        const provider = DI.resolve(PasswordProvider);

        const user = new User({
            Email: "test@spinajs.pl",
            NiceName: "test",
            Login: "test",
            Password: await provider.hash("bbbb"),
            RegisteredAt: new Date()
        });

        const role = await Role.where({
            Slug: "admin.user"
        }).first<Role>();

        await user.save();
        await user.Roles.add(role);
      
    });

    afterEach(async () => {
        DI.clear();
    });

    it("Should exists", async () => {

        const provider = DI.resolve(AuthProvider);
        let result = await provider.exists("test@spinajs.pl");
        expect(result).to.be.true;

        result = await provider.exists(new User({
            Email: "test@spinajs.pl"
        }));
        expect(result).to.be.true;


        result = await provider.exists("dasda@dasd.pl");
        expect(result).to.be.false;
    });

    it("Should authenticate", async () => {

        const provider = DI.resolve(AuthProvider);
        let user = await provider.authenticate("test@spinajs.pl", "bbbb");
        expect(user).to.be.not.null;

        user = await provider.authenticate("test@spinajs.pl", "dbbbb");
        expect(user).to.be.null;

        user = await provider.authenticate("test@spinsajs.pl", "bbbb");
        expect(user).to.be.null;
      
    });

    

     
});
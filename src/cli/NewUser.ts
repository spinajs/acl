
import { Cli, Option, ICliCommand } from "@spinajs/cli";
import { Autoinject, Container } from "@spinajs/di";
import { AuthProvider, PasswordProvider } from "../interfaces";
import { User } from "../models/User";
import { Logger, Log } from "../../../log/lib";
import { Orm } from "@spinajs/orm";


@Cli("acl:new-user <login> <email>", "Creates new user")
@Option("-p, --password <password>", "User password. If not set password is generated and printed to console")
@Option("-n, --nice_name <nice_name>", "User friendly name eg. name with surname")
export class NewUser implements ICliCommand {

    @Logger()
    protected Log: Log;

    @Autoinject()
    protected Container: Container;

    @Autoinject()
    protected Orm: Orm;

    public get Name(): string {
        return "New user";
    }

    public async execute(login: string, email: string, command: any) {

        const auth = this.Container.resolve<AuthProvider>(AuthProvider);
        const password = this.Container.resolve<PasswordProvider>(PasswordProvider);
        
        let hashedPassword = "";
        let userPassword = command.password?.trim();

        if (!userPassword) {
            userPassword = password.generate();
        }

        hashedPassword = await password.hash(userPassword);
        const user = new User({
            Login: login,
            Email: email,
            NiceName: command.nice_name.trim(),
            Password: hashedPassword,
            CreatedAt: new Date(),
        });

        const exists = await auth.exists(user);
        if (exists) {
            this.Log.warn(`User ${user.Email}:${user.NiceName} already exists`);
            return -1;
        }

        try {
            await user.save();
        } catch (ex) {
            this.Log.error(ex, "Cannot save user to db");
            return -1;
        }

        this.Log.info(`User ${user.Email}:${user.NiceName}, password: ${userPassword} added to db !`); 

        return 0;
    }
}
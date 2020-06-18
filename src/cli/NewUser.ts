
import { Cli, Option, ICliCommand } from "@spinajs/cli";
import { Autoinject, Container } from "@spinajs/di";
import { AuthProvider, PasswordProvider } from "../interfaces";
import { User } from "../models/User";
import { Logger, Log } from "../../../log/lib";


@Cli("acl:new-user <login>", "Creates new user")
@Option("-p, --password", "User password. If not set password is generated and printed to console")
@Option("-n, --nice_name", "User friendly name eg. name with surname")
export class NewUser implements ICliCommand {

    @Logger()
    protected Log: Log;

    @Autoinject()
    protected Container: Container;

    public get Name(): string {
        return "New user";
    }

    public async execute(login: string, command: any) {

        const auth = this.Container.resolve<AuthProvider>(AuthProvider);
        const password = this.Container.resolve<PasswordProvider>(PasswordProvider);

        let hashedPassword = "";
        let userPassword = command.password;

        if (!userPassword) {
            userPassword = password.generate();
        }

        hashedPassword = await password.hash(userPassword);
        const user = new User({
            Email: login,
            DisplayName: command.nice_name,
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

        this.Log.info(`User ${user.Email}:${user.NiceName} added to db !`);

        return 0;
    }
}
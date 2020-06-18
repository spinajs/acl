import { Cli, ICliCommand } from "@spinajs/cli";
import { Logger, Log } from "../../../log/lib";
import { User } from "../models/User";


@Cli("acl:user <login>", "Get info about specified user and attached roles")
export class Roles implements ICliCommand {

    @Logger()
    protected Log: Log;

    public get Name(): string {
        return "User info";
    }

    public async execute(login: string) {

        try {

            const user = await User.where({
                Email: login
            })
                .populate("Roles")
                .populate("Metadata").first<User>();

            if (!user) {
                this.Log.info(`User ${login} not exists in db`)
                return 0;
            }

            this.Log.info(`User: ${user.Id}:${user.Email}, name: ${user.NiceName}, created at: ${user.CreatedAt}`);
            this.Log.info(`Roles: ${user.Roles.map(r => r.Slug).join(",")}`);
            this.Log.info(`Metadata`);

            user.Metadata.forEach(m => {
                this.Log.info(`Key: ${m.Key}=${m.Value}`);
            });

            return 0;
        } catch (ex) {
            this.Log.error(ex, "Cannot load user from db");
            return -1;
        }
    }
}
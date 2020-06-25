import { Cli, ICliCommand } from "@spinajs/cli";
import { Logger, Log } from "../../../log/lib";
import { User } from "../models/User";

@Cli("acl:role-revoke <login> <role>", "Revoke role from user")
export class RevokeRole implements ICliCommand {

    @Logger()
    protected Log: Log;

    public get Name(): string {
        return "Revoke role";
    }

    public async execute(login: string, roleSlug: string) {

        try {
            const user = await User.where({
                Email: login
            }).populate("Role", function () {
                this.where("Slug", roleSlug);
            }).first<User>();

            if (!user) {
                this.Log.error(`User ${login} not exists in database`);
                return -1;
            }

            if(user.Roles.length === 0){
                this.Log.info("Role not assigned to user, nothing to revoke");
                return 0;
            }
            await user.Roles.remove(user.Roles[0]);

            this.Log.info("Role revoked");

            return 0;
        } catch (ex) {
            this.Log.error(ex, "Cannot revoke user role");
            return -1;
        }
    }
}
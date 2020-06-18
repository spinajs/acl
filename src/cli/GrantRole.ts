import { Cli, ICliCommand } from "@spinajs/cli";
import { Logger, Log } from "../../../log/lib";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { InsertBehaviour } from '@spinajs/orm';


@Cli("acl:role-grant <login> <role>", "Adds role to user")
export class GrantRole implements ICliCommand {

    @Logger()
    protected Log: Log;

    public get Name(): string {
        return "Add user metadata";
    }

    public async execute(login: string, roleSlug: string) {

        try {
            const user = await User.where({
                Email: login
            }).first<User>();

            if (!user) {
                this.Log.error(`User ${login} not exists in database`);
                return -1;
            }

            const role = await Role.where({
                Slug: roleSlug
            }).first<Role>();

            if(!role){
                this.Log.error(`Role ${roleSlug} not exists in database`);
                return -1;
            }

            await user.Roles.add(role,InsertBehaviour.OnDuplicateIgnore);

            this.Log.info("Role granted"); 

            return 0;
        } catch (ex) {
            this.Log.error(ex, "Cannot grand user role");
            return -1;
        }
    }
}
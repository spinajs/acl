
import { Cli, ICliCommand } from "@spinajs/cli";
import { Logger, Log } from "../../../log/lib";
import { Role } from "../models/Role";


@Cli("acl:roles", "List all roles in system")
export class Roles implements ICliCommand {

    @Logger()
    protected Log: Log;

    public get Name(): string {
        return "Role list";
    }

    public async execute() {

        try {

            const roles: Role[] = await Role.all().populate("Resources");

            roles.forEach(r => {
                this.Log.info(`Role: ${r.Id}:${r.Slug}, parent: ${r.parent_id}`);
                this.Log.info(`Resources:`);

                r.Resources.forEach(res => {
                    this.Log.info(`${res.Slug}, permissions: ${res.Permission.Permissions.join(",")}`);
                })
            });

            return 0;
        } catch (ex) {
            this.Log.error(ex, "Cannot load roles from db");
            return -1;
        }
    }
}
import { Cli, ICliCommand } from "@spinajs/cli";
import { Logger, Log } from "../../../log/lib";
import { Resource } from "../models/Resource";


@Cli("acl:resources", "List all resources in acl")
export class Resources implements ICliCommand {

    @Logger()
    protected Log: Log;

    public get Name(): string {
        return "Resources list";
    }

    public async execute() {

        try {
            const resources: Resource[] = await Resource.all();

            resources.forEach(r => {
                this.Log.info(`${r.Slug} - ${r.Name}`);
            });

            return 0;
        } catch (ex) {
            this.Log.error(ex, "Cannot load resources from db");
            return -1;
        }
    }
}
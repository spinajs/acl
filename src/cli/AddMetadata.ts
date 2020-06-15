import { UserMetadata } from '../models/UserMetadata';
import { Cli, ICliCommand } from "@spinajs/cli";
import { Logger, Log } from "../../../log/lib";
import { User } from "../models/User";
import { InsertBehaviour } from '@spinajs/orm';


@Cli("acl:add-metadata <login> <key> <value>", "Adds metadata to user")
export class AddMetadata implements ICliCommand {

    @Logger()
    protected Log: Log;

    public get Name(): string {
        return "Add user metadata";
    }

    public async execute(login: string, key: string, value: string) {

        try {

            const user = await User.where({
                Email: login
            }).first<User>();

            if (!user) {
                this.Log.error(`User ${login} not exists in database`);
                return -1;
            }

            const meta = new UserMetadata({
                Key: key,
                Value: value
            });
            meta.Owner = user;

            // when owner & key already exists update its content
            await meta.save(InsertBehaviour.OnDuplicateUpdate);

            this.Log.info("Metadata added !");

            return 0;
        } catch (ex) {
            this.Log.error(ex, "Cannot add metadata to user");
            return -1;
        }
    }
}
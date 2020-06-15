import { ModelBase, Primary, BelongsTo, Connection, Model } from "@spinajs/orm";
import { User } from "./User";
import { Group } from "./Group";

@Connection("default")
@Model("groups_to_users")
export class GroupToUser extends ModelBase<GroupToUser>
{
    @Primary()
    public Id: number;

    @BelongsTo()
    public User: User;

    @BelongsTo()
    public Group: Group;
}
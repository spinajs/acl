import { ModelBase, Primary, BelongsTo, Connection, Model } from "@spinajs/orm";
import { User } from "./User";
import { Role } from "./Role";

@Connection("default")
@Model("user_to_role")
export class UserToRole extends ModelBase<UserToRole>
{
    @Primary()
    public Id: number;

    @BelongsTo()
    public User: User;

    @BelongsTo()
    public Role: Role;
}
import { ModelBase, Primary, Connection, Model } from "@spinajs/orm";
 
@Connection("default")
@Model("user_to_role")
export class UserToRole extends ModelBase<UserToRole>
{
    @Primary()
    public Id: number;

    /**
     * Relation field
     */
    public user_id: number;

    /**
     * Relation field
     */
    public role_id: number;
}
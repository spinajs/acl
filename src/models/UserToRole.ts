import { ModelBase, Primary, Connection, Model, Uuid } from "@spinajs/orm";
 
@Connection("default")
@Model("user_to_role")
export class UserToRole extends ModelBase<UserToRole>
{
    @Uuid()
    @Primary()
    public Id: string;

    /**
     * Relation field
     */
    public user_id: Buffer;

    /**
     * Relation field
     */
    public role_id: Buffer;
}
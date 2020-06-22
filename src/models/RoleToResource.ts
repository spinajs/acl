import { ModelBase, Primary, Connection, Model, Set } from "@spinajs/orm";
import { ResourcePermission } from "../interfaces";

/**
 * Role resources junction model. Roles can have many resources & resources can belongs to many roles
 */
@Connection("default")
@Model("role_to_resource")
export class RoleToResource extends ModelBase<RoleToResource>
{
    @Primary()
    public Id: string;

    @Set()
    public Permissions: ResourcePermission[];

}

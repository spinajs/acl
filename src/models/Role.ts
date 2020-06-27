import { ModelBase, Primary, Connection, Model, HasManyToMany, BelongsTo, Recursive, Relation} from "@spinajs/orm";
import { Resource } from "./Resource";
import { RoleToResource } from "./RoleToResource";

/**
 * User role eg. admin, user, guest
 */
@Connection("default")
@Model("roles")
export class Role extends ModelBase<Role>
{
    @Primary()
    public Id: number;

    /**
     * role slug used in app
     */
    public Slug: string;

    /**
     * User friendly name
     */
    public Name: string;

    /**
     * User friendly description
     */
    public Description: string;

    /**
     * Parent role eg. super admin have all admin roles with additional permissions
     */
    @Recursive()
    @BelongsTo()
    public Parent: Role;

    /**
     * relation field
     */
    public parent_id: number;

    @HasManyToMany(RoleToResource, Resource)
    public Resources: Relation<Resource>;
}

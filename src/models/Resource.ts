import {ModelBase, Primary, Connection, Model, JunctionTable, Uuid } from "@spinajs/orm";
import { RoleToResource } from "./RoleToResource";

@Connection("default")
@Model("resources")
export class Resource extends ModelBase<Resource>{

    @Primary()
    @Uuid()
    public Id : string;

    public Slug : string;

    public Name : string;

    public Description : string;

    /**
     * Juntion table data for role-resources many-to-many relation.
     * Contains permission for this resource and owner role
     */
    @JunctionTable()
    public Permission : RoleToResource;
}
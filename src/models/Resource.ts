import {ModelBase, Primary, Connection, Model, Unique, JunctionTable } from "@spinajs/orm";
import { RoleToResource } from "./RoleToResource";

@Connection("default")
@Model("resources")
export class Resource extends ModelBase<Resource>{

    @Primary()
    public Id : number;

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
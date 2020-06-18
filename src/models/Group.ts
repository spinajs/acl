import { GroupMetadata } from './GroupMetadata';
import {ModelBase, Primary, Connection, Model, Unique, HasMany, Relation } from "@spinajs/orm";

@Connection("default")
@Model("groups")
export class Group extends ModelBase<Group>{

    @Primary()
    public Id : number;

    @Unique()
    public Slug : string;

    public Name : string;

    public Description : string;

    /**
     * Group additional information. Can be anything
     */
    @HasMany(GroupMetadata)
    public Metadata: Relation<GroupMetadata>;

}
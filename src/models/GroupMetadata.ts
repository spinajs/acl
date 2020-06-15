import { ModelBase, Primary, Connection, Model, BelongsTo } from "@spinajs/orm";
import { Group } from "./Group";

@Connection("default")
@Model("group_metadatas")
export class GroupMetadata extends ModelBase<GroupMetadata>
{
    @Primary()
    public Id: number;

    public Key: string;

    public Value: string;

    @BelongsTo()
    public Owner: Group;
} 
import { ModelBase, Primary, Connection, Model, BelongsTo } from "@spinajs/orm";
import { User } from "./User";

@Connection("default")
@Model("user_metadatas")
export class UserMetadata extends ModelBase<UserMetadata>
{
    @Primary()
    public Id: string;

    public Key: string;

    public Value: string;

    @BelongsTo()
    public Owner: User;
} 
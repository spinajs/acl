import { ModelBase, Primary, Connection, Model } from "@spinajs/orm";

@Connection("default")
@Model("user_metadatas")
export class UserMetadata extends ModelBase<UserMetadata>
{
    @Primary()
    public Id: string;

    public Key: string;

    public Value: string;
} 
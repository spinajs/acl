import { Migration, OrmDriver, OrmMigration } from "@spinajs/orm";


@Migration("default")
// @ts-ignore
export class AclInitialMigration extends OrmMigration {

    // tslint:disable-next-line: no-empty
    public async up(connection: OrmDriver): Promise<void> {

        await connection.schema().createTable("users", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Login", 64).unique().notNull();
            table.string("Email", 64).unique().notNull();
            table.string("Password", 128).notNull();
            table.string("NiceName", 64).notNull();
            table.dateTime("RegisteredAt").default("0000-00-00 00:00:00");
            table.dateTime("CreatedAt").notNull();
            table.dateTime("DeletedAt").default("0000-00-00 00:00:00");
        });

        await connection.schema().createTable("user_metadatas", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Key", 255).notNull();
            table.text("Value").notNull();
            table.int("user_id").notNull();
            table.foreignKey("user_id").references("users", "Id").cascade();
        });

        await connection.schema().createTable("roles", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Slug", 32).unique().notNull();
            table.string("Name", 128).notNull();
            table.text("Description");
            table.string("parent_slug");
        });

        await connection.schema().createTable("user_to_role", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.int("user_id").notNull();
            table.int("role_id").notNull();

            table.foreignKey("user_id").references("users", "id").cascade();
            table.foreignKey("role_id").references("roles", "id").cascade();
        });

        await connection.schema().createTable("resources", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Slug", 32).unique().notNull();
            table.string("Name", 128).notNull();
            table.text("Description");
        });

        await connection.schema().createTable("role_to_resource", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.int("resource_id").notNull();
            table.int("role_id").notNull();
            table.set("Permissions", ["put", "delete", "get"]);

            table.foreignKey("resource_id").references("resources", "id").cascade();
            table.foreignKey("role_id").references("roles", "id").cascade();
        });


        await connection.index()
            .unique()
            .table("users")
            .name("users_email_idx")
            .columns(["Email"]);

        await connection.index()
            .unique()
            .table("user_metadatas")
            .name("owner_user_meta_key_idx")
            .columns(["user_id", "Key"]);

        await connection.index()
            .unique()
            .table("roles")
            .name("role_slug_idx")
            .columns(["Slug"]);

        await connection.index()
            .unique()
            .table("roles")
            .name("role_parent_idx")
            .columns(["parent_slug"]);

        await connection.index()
            .unique()
            .table("resources")
            .name("resources_slug_idx")
            .columns(["Slug"]);

        await connection.index()
            .unique()
            .table("role_to_resource")
            .name("role_resource_idx")
            .columns(["role_id", "resource_id"]);

        await connection.index()
            .unique()
            .table("user_to_role")
            .name("user_role_idx")
            .columns(["role_id", "user_id"]);

        await this.fillUp(connection);

    }

    // tslint:disable-next-line: no-empty
    public async down(_connection: OrmDriver): Promise<void> {

    }

    private async fillUp(connection: OrmDriver) {
        const roles = [
            {
                Slug: "admin.users",
                Name: "User management",
                Description: "User administration privliges ( add, delete, update users )",
                Resources: [{
                    Slug: "users",
                    Name: "Users in system",
                    Permissions: ["put", "delete", "get"]
                }]
            },
            {
                Slug: "guest",
                Name: "Guest account",
                Description: "Simple guest account with no privliges",
                Resources: []
            }
        ];

        for (const role of roles) {

            const roleId = await connection.insert().into("roles").values({
                Slug: role.Slug,
                Name: role.Name,
                Description: role.Description
            });

            for (const resource of role.Resources) {

                const resourceId = await connection.insert().into("resources").values({
                    Slug: resource.Slug,
                    Name: resource.Name
                }).ignore();

                await connection.insert().into("role_to_resource").values({
                    role_id: roleId,
                    resource_id: resourceId,
                    Permissions: resource.Permissions.join(",")
                });
            }
        }
    }
}
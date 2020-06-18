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
            table.string("Password", 64).notNull();
            table.string("NiceName", 64).notNull();
            table.dateTime("RegisteredAt").default("0000-00-00 00:00:00");
            table.dateTime("CreatedAt").notNull();
            table.dateTime("DeletedAt").default("0000-00-00 00:00:00");
        });

        await connection.schema().createTable("user_metadatas", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Key", 255).notNull();
            table.text("Value").notNull();
            table.int("owner_id").notNull();

            table.foreignKey("owner_id").references("users", "id").cascade();
        });

        await connection.schema().createTable("roles", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Slug", 32).unique().notNull();
            table.string("Name", 128).notNull();
            table.text("Description");
            table.string("parent_slug");
        });

        await connection.schema().createTable("groups", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Slug", 32).unique().notNull();
            table.string("Name", 128).notNull();
            table.text("Description");
        });

        await connection.schema().createTable("group_metadatas", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.string("Key", 255).notNull();
            table.text("Value").notNull();
            table.int("owner_id").notNull();

            table.foreignKey("owner_id").references("group", "Id").cascade();
        });


        await connection.schema().createTable("groups_to_users", (table) => {
            table.int("Id").autoIncrement().primaryKey();
            table.int("user_id").notNull();
            table.int("group_id").notNull();

            table.foreignKey("user_id").references("users", "Id").cascade();
            table.foreignKey("group_id").references("groups", "Id").cascade();
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
            .columns(["owner_id", "Key"]);

        await connection.index()
            .unique()
            .table("group_metadatas")
            .name("owner_group_meta_key_idx")
            .columns(["owner_id", "Key"]);


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
            .table("groups_to_users")
            .name("group_to_user_idx")
            .columns(["user_id", "group_id"]);

        await connection.index()
            .unique()
            .table("user_to_role")
            .name("user_role_idx")
            .columns(["role_id", "user_id"]);

    }

    // tslint:disable-next-line: no-empty
    public async down(_connection: OrmDriver): Promise<void> {

    }
}
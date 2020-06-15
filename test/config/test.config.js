const  path = require('path');
function dir(p) {
    return path.resolve(path.normalize(path.join(__dirname, p)));
}

module.exports =
{
    system: {
        dirs: {
            migrations: [dir("./../../src/migrations")],
            models: [dir("./../../src/models")],
            commands: [dir("./../../src/cli")]
        }
    },
    acl: {

        // default roles to manage users & guest account
        roles: [
            {
                Slug: "admin.user",
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
        ],
        defaultRole: "guest",
        session: {
            
            // 10 minutes session expiration  time
            expiration: 10 * 60
        }
    },
    db: {
        DefaultConnection: "sqlite",
        MigrateOnStartup: true,
        Connections: [
            {
                Debug: {
                    Queries: true
                },
                Driver: "orm-driver-sqlite",
                Filename: "D:\\acl.sqlite",
                Name: "sqlite",
                Migration: {
                    Table: "orm_migrations"
                }
            }
        ]
    }
}
import { join, normalize, resolve } from 'path';

function dir(path: string) {
    return resolve(normalize(join(__dirname, path)));
}

module.exports = {
    system: {
        dirs: {
            migrations: [dir("./../migrations")],
            models: [dir("./../models")],
            commands: [dir("./../cli")]
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
}
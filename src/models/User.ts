import { GroupToUser } from './GroupToUser';
import { ModelBase, Primary, Connection, Model, Unique, CreatedAt, SoftDelete, HasMany, HasManyToMany , Relation} from "@spinajs/orm";
import { UserMetadata } from "./UserMetadata";
import { UserToRole } from "./UserToRole";
import { Role } from "./Role";
import { Resource } from "./Resource";
import _ = require("lodash");
import { ResourcePermission } from "../interfaces";
import { Group } from './Group';


/**
 * Base modele for users used by ACL
 * 
 * To add / extend fields simply extend this model and register as default user model in ACL service
 */
@Connection("default")
@Model("users")
export class User extends ModelBase<User>  {
    @Primary()
    public Id: number;

    @Unique()
    public Email: string;

    @Unique()
    public Login: string;

    /**
     * Hashed password for user
     */
    public Password: string;

    /**
     * Registration date. User is registered when clicked confirmation link sended to provided email.
     */
    public RegisteredAt: Date;

    /**
     * Displayed name ( for others to see )
     */
    public NiceName: string;

    /**
     * User creation date
     */
    @CreatedAt()
    public CreatedAt: Date;

    /**
     * User deletion date
     */
    @SoftDelete()
    public DeletedAt: Date;

    /**
     * User additional information. Can be anything
     */
    @HasMany(UserMetadata)
    public Metadata: Relation<UserMetadata>;

    /**
     * User roles eg. admin, guest etc.
     */
    @HasManyToMany(UserToRole, Role)
    public Roles: Relation<Role>;

    /**
     * Assigned groups to user
     */
    @HasManyToMany(GroupToUser, Group)
    public Groups: Relation<Group>;

    /**
     * Fast resource lookup for access checking
     */
    private _cachedResources: Map<string, string[]> = new Map<string, string[]>();

    /**
     * add role to user
     * 
     * @param role role assigned for user
     */
    public async addRole(role: Role): Promise<void> {

        const userToRole = new UserToRole();
        userToRole.role_id = role.Id;
        userToRole.user_id = this.Id;

        await userToRole.save();

        this.Roles.push(role);
    }

    /**
     * removes role from user
     * 
     * @param role role to delete from user
     */
    public async  removeRole(role: Role): Promise<void> {
        const index = this.Roles.findIndex(r => r.Id === role.Id);
        if (index !== -1) {
            this.Roles.splice(index, 1);

            await this.Roles.remove(role);
        }
    }

    /**
     * 
     * Checks if user have permission for given resource
     * 
     * @param resource what resousrce we check
     * @param permission permission to check
     */
    public async isAllowed(resource: Resource | string, permission: string | ResourcePermission): Promise<boolean> {

        if (this.Roles.length === 0) {
            await this.Roles.populate(function () {
                this.populate("Parent");
                this.populate("Resources");
            });
        }

        if (this._cachedResources.size === 0) {
            this.rebuildCachedResources();
        }

        const resName = (resource instanceof Resource) ? resource.Slug : resource;

        if (!this._cachedResources.has(resName)) {
            return false;
        }   

        if (this._cachedResources.has(resName) && permission ===  ResourcePermission.Any) {
            return false;
        }

        return this._cachedResources.get(resName).indexOf(permission) !== -1;
    }

    private rebuildCachedResources() {

        const roles: Role[] = [];

        // flatten all parent roles to array
        for (const r of this.Roles) {
            extractParents(r);
        }

        const resources = roles.reduce((prev, current) => {
            return prev.concat(current.Resources)
        }, [] as Resource[]);

        resources.forEach(r => {
            if (this._cachedResources.has(r.Slug)) {
                this._cachedResources.set(r.Slug, _.union(this._cachedResources.get(r.Slug), r.Permission.Permissions));
            } else {
                this._cachedResources.set(r.Slug, r.Permission.Permissions);
            }

        })

        function extractParents(role: Role): void {

            if (role === null) {
                return;
            }

            roles.push(role);

            if (role.Parent) {
                extractParents(role.Parent);
            }
        }
    }
}

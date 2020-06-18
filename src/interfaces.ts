import { User } from "./models/User";

/**
 * Permissions given to resources
 */
export enum ResourcePermission
{
    /**
     * Allows read resources
     */
    Get  = "get",

    /**
     * Allows to edit & insert new resources
     */
    Put = "put",

    /**
     * Allows to delete resource
     */
    Delete = "delete",

    /**
     * Permission is granted when resource is assigned to role / user. Dont care about read/write/other
     */
    Any = "*"
}
 
export interface ISession {

    /**
     * Session identifier
     */
    SessionId: string;

    /**
     * Expiration date. After that date session is invalid
     */
    Expiration: Date;

    /**
     * Data holds by session
     */
    Data: any;
}


/**
 * Service used for generating random password & for hash raw string
 */
export abstract class PasswordProvider {


    /**
     * 
     * Checks if hash is valid for given password
     * 
     * @param hash hasth to validate
     * @param password password to validate
     */
    public async abstract verify(hash: string, password: string): Promise<boolean>;

    /**
     * 
     * Generate hashed string from user password
     * 
     * @param input string to hash
     */
    public async abstract hash(input: string): Promise<string>;

    /**
     * Generates random user password
     */
    public abstract generate(): string;
}

export abstract class AuthProvider<U = User>
{
    public abstract exists(user: U): Promise<boolean>;

    public abstract authenticate(login: string, password: string): Promise<U>;
}

export abstract class SessionProvider<T = ISession>
{
    /**
     * 
     * Load session from store. If not exists or expired returns null
     * 
     * @param sessionId session identifier
     */
    public abstract restoreSession(sessionId: string): Promise<T>;

    /**
     * 
     * Deletes session from store
     * 
     * @param sessionId session to delete
     */
    public abstract deleteSession(sessionId: string): Promise<void>;

    /**
     * 
     * Adds or updates session in store
     * 
     * @param session session to update / insert
     */
    public abstract updateSession(session: ISession): Promise<void>;

    /**
     * 
     * Extends session expiration time. Extension is set in acl.session.expiration (in seconds)
     * 
     * @param sessionId session to refres
     */
    public abstract refreshSession(sessionId: string): Promise<void>;
}

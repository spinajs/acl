import { SessionProvider, ISession } from "./interfaces";
import { Autoinject, IContainer } from "@spinajs/di";
import { Configuration } from "@spinajs/configuration";
import { v4 as uuidv4 } from 'uuid';

/**
 * Session base class
 */
export class Session implements ISession {

    public SessionId : string;

    public Expiration: Date;

    public Data: any;

    public Creation : Date;

    constructor(data: any) {

        if (data) {
            Object.assign(this, data);
        }

        if (!this.SessionId) {
            this.SessionId = uuidv4();
        }

        if (!this.Expiration) {
            this.Expiration = new Date();
            this.Expiration.setMinutes(this.Expiration.getMinutes() + 60);
        }

        if(!this.Creation){
            this.Creation = new Date();
        }
    }


    /**
     * Extends lifetime of session
     * 
     * @param minutes hom mutch to extend
     */
    public extend(minutes: number) {
        this.Expiration.setMinutes(this.Expiration.getMinutes() + minutes);
    }
}

/**
 * Simple session storage in memory
 */
export class MemorySessionProvider<T = ISession> extends SessionProvider<T> {

    @Autoinject()
    protected Configuration: Configuration;

    protected Sessions: Map<string, ISession> = new Map<string, ISession>();

    public async restoreSession(sessionId: string): Promise<T> {

        if (this.Sessions.has(sessionId)) {
            const session = this.Sessions.get(sessionId);

            if (session.Expiration <= new Date()) {
                this.deleteSession(session.SessionId);
                return null;
            }

            return session as any;
        }

        return null;
    }

    // tslint:disable-next-line: no-empty
    public async resolveAsync(_container: IContainer) {

    }

    public async deleteSession(sessionId: string): Promise<void> {
        if (this.Sessions.has(sessionId)) {
            this.Sessions.delete(sessionId);
        }
    }

    public async updateSession(session: ISession): Promise<void> {
        this.Sessions.set(session.SessionId, session);
    }

    public async refreshSession(sessionId: string): Promise<void> {
        if (this.Sessions.has(sessionId)) {
            const session = this.Sessions.get(sessionId);

            session.extend(this.Configuration.get<number>("acl.session.expiration", 10));

        }
    }

}
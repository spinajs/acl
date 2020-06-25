import { SessionProvider, ISession } from "./interfaces";
import { Autoinject, IContainer } from "@spinajs/di";
import { Configuration } from "@spinajs/configuration";
import { v4 as uuidv4 } from 'uuid';

/**
 * Session base class
 */
export class Session implements ISession {

    public get SessionId(): string {
        return this._sessionId;
    }

    public Expiration: Date;

    public Data: any;

    private _sessionId: string;

    constructor(data: any) {

        if (data) {
            Object.assign(this, data);
        } else {
            this._sessionId = uuidv4();
        }
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

        session.Expiration = this._getExpirationTime();
    }

    public async refreshSession(sessionId: string): Promise<void> {
        if (this.Sessions.has(sessionId)) {
            const session = this.Sessions.get(sessionId);

            session.Expiration = this._getExpirationTime();
        }
    }

    private _getExpirationTime() {
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + this.Configuration.get(["acl", "session", "expiration"], 10 * 60));
        return expirationDate;
    }
}
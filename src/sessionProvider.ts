import { SessionProvider, ISession } from "./interfaces";
import { Autoinject } from "@spinajs/di";
import { Configuration } from "@spinajs/configuration";

// tslint:disable-next-line: no-var-requires
const { Random, charset64 } = require("entropy-string");


/**
 * Session base class
 */
export class Session implements ISession {

    public get SessionId(): string {
        return this._sessionId;
    }

    public Expiration: Date;

    private _sessionId: string;

    constructor() {

        // generate session id with high entropy for security reasons
        const random = new Random(charset64);
        this._sessionId = random.string(256);
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
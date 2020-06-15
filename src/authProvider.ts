import { AuthProvider, ICredentials, PasswordProvider } from "./interfaces";
import { User } from "./models/User";
import { Autoinject, IContainer } from "@spinajs/di";



export class SimpleDbAuthProvider implements AuthProvider<User> {

    @Autoinject()
    protected Container: IContainer;

    public async exists(user: User): Promise<boolean> {

        const result = await User.where("Email", user.Email).first();
        if (!result) {
            return true;
        }

        return false;
    }

    public async authenticate(credentials: ICredentials): Promise<User> {

        const pwd = this.Container.resolve<PasswordProvider>(PasswordProvider);
        const result = await User.where({
            Email: credentials.getLogin()
        }).first<User>();

        if (!result) {
            return null;
        }

        const valid = await pwd.verify(result.Password, credentials.getPassword());
        if (valid) {
            return result;
        }

        return null;
    }
}
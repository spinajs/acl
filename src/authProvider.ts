import { AuthProvider, PasswordProvider } from "./interfaces";
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

    public async authenticate(login: string, password: string): Promise<User> {

        const pwd = this.Container.resolve<PasswordProvider>(PasswordProvider);
        const result = await User.where({
            Login: login
        })
            .populate("Metadata")
            .populate("Groups")
            .populate("Roles")
            .first<User>();

        if (!result) {
            return null;
        }

        const valid = await pwd.verify(result.Password, password);
        if (valid) {
            return result;
        }

        return null;
    }
}
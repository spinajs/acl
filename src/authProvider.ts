import { AuthProvider, PasswordProvider } from "./interfaces";
import { User } from "./models/User";
import { Autoinject, Container } from "@spinajs/di";



export class SimpleDbAuthProvider implements AuthProvider<User> {

    @Autoinject()
    protected Container : Container;

    public async exists(user: User | string): Promise<boolean> {
        const result = await User.where("Email", (user instanceof User) ? user.Email : user).first();
        if (result) {
            return true;
        }

        return false;
    }

    public async authenticate(email: string, password: string): Promise<User> {

        const pwd = this.Container.resolve<PasswordProvider>(PasswordProvider);
        const result = await User.where({
            Email: email
        }).first<User>();

        if (!result) {
            return null;
        }

        const valid = await pwd.verify(result.Password, password);
        if (valid) {

            await result.Metadata.populate();
            await result.Roles.populate();

            return result;
        }

        return null;
    }
}
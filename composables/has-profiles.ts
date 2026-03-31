import { User } from "~~/models/auth/user.model";
import { IUser } from "~~/schemas/auth/user.schema";

export default (profils?: string | string[]): boolean => {
    const { data: sessionData, getSession } = useAuth();
    const user = new User(sessionData.value?.user as IUser);
    if (!user || !user.role) return false;

    return user.role?.hasProfile(profils).success;
};
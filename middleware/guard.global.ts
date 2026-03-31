import { User } from "~/models/auth/user.model";
import { Forbidden } from "~/models/core/errors.model";
import { IUser } from "~/schemas/auth/user.schema";

export default defineNuxtRouteMiddleware( (to, from) => {
   
    const { data } = useAuth();
    const localePath = useLocalePath()


    if (to.meta.auth && !data.value?.user) {
        return navigateTo(`${localePath('auth-login')}?cb_url=${from.fullPath}`);
    } else if (!data.value?.user) {
        return true;
    }

    const logged = new User(data.value?.user as IUser);
    if (logged && !logged?.profil?.lastname && localePath('auth-profile') !== to.path) {
        return navigateTo(localePath('auth-profile'));
    }

    if(to.meta.profiles) {
        if(!(to.meta.profiles as []).some(element => logged?.role?.hasProfile(element))) {
            throw new Forbidden('error._no_permission');
        }
    }

    if(!isServer()) window.scrollTo({ top: 0, behavior: 'smooth' });
})
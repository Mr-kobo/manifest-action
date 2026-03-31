import { User } from "~~/models/auth/user.model";
import { IUser } from "~~/schemas/auth/user.schema";

export default () => {
    const { error: snackError } = useAlert();
    const { setLocale } = useI18n();
    const { data: sessionData, getSession } = useAuth();
    const { errorToText } = useFrontValidation(undefined);
    const { save } = useAPI();

    const getLogged = () => {
        if (!sessionData.value?.user) return undefined;
        return new User(sessionData.value?.user as IUser);
    };

    const getLoggedId = () => {
        return getLogged()?._id;
    };

    const getLoggedIdentifier = () => {
        return getLogged()?.identifier;
    };

    const getLoggedInitial = () => {
        return getLogged()?.initials;
    };

    const getLoggedFullname = () => {
        return getLogged()?.fullname;
    };

    const getLoggedAvatar = () => {
        return getLogged()?.profil.avatar;
    };

    const getLoggedPreferences = () => {
        return getLogged()?.preferences;
    };

    const getLoggedProfil = () => {
        return getLogged()?.profil;
    };

    const setAvatar = async (avatar: string) => {
        const logged = getLogged();
        if (!logged) return logged;
        const { entity: user } = await save(logged.patch({
            profil: {
                ...getLoggedProfil(),
                avatar
            } as any
        }), { await: true });
        return user;
    };

    const setLang = async (locale: string) => {
        const logged = getLogged();
        if (!logged) return logged;
        const { entity: user } = await save(logged.patch({
            preferences: {
                ...getLoggedPreferences(),
                locale
            } as any
        }), { await: true });
        setLocale(locale);
        return user;
    };

    const setProfil = async (profil: any) => {
        const logged = getLogged();
        if (!logged) return logged;
        const { entity: user } = await save(logged.patch({ profil }), { await: true });
        return user;
    };

    const refreshLogged = async () => {
        await getSession();
    };

    const hasProfile = (profils?: string | string[], withSnack: boolean = false): boolean => {
        if (getLogged()?.role?.profiles.includes('superadmin')) return true;
        const checkHasProfile = getLogged()?.role?.hasProfile(profils);
        if (!checkHasProfile?.success) {
            if (withSnack) snackError(errorToText(checkHasProfile?.message as string));
            return false;
        }
        return true;
    };

    const hasEnoughPower = (power: number, withSnack: boolean = false) => {
        if (getLogged()?.role?.profiles.includes('superadmin')) return true;
        const hasEnoughPower = getLogged()?.role?.hasPower(power);
        if (!hasEnoughPower?.success) {
            if (withSnack) snackError(errorToText(hasEnoughPower?.message as string));
            return false;
        }
        return true;
    };

    const hasPowerAndProfile = (power: number, profil: string, withSnack: boolean = false) => {
        if (getLogged()?.role?.profiles.includes('superadmin')) return true;
        const checkHasPowerAndProfile = getLogged()?.role?.hasPowerAndProfile(power, profil);
        if (!checkHasPowerAndProfile?.success) {
            if (withSnack) snackError(errorToText(checkHasPowerAndProfile?.message as string));
            return false;
        }
        return true;
    };

    return {
        logged: getLogged(),
        refreshLogged,
        getLogged,
        getLoggedId,
        getLoggedInitial,
        getLoggedFullname,
        getLoggedAvatar,
        getLoggedProfil,
        getLoggedPreferences,
        getLoggedIdentifier,
        setAvatar,
        setProfil,
        setLang,
        hasProfile,
        hasEnoughPower,
        hasPowerAndProfile
    };
};
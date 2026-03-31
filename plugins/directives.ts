import { defineNuxtPlugin } from '#app';
import { AppPermissions } from '~/app.config';
import _ from 'lodash';
import { User } from '~~/models/auth/user.model';
import { IUser } from '~~/schemas/auth/user.schema';



/**
 * 
*/
export default defineNuxtPlugin((nuxtApp) => {
    const { data: sessionData, getSession } = useAuth();
    const user = new User(sessionData.value?.user as IUser);

    nuxtApp.vueApp.directive('profile', {
        mounted(el, bindings) {
            const profiles: AppPermissions | AppPermissions[] | undefined = bindings.value;
            if (!hasProfiles(profiles)) {
                el.parentNode.removeChild(el);
            }
        },
        updated(el, bindings) {
            if (bindings.value !== bindings.oldValue) {
                const profiles: AppPermissions | AppPermissions[] | undefined = bindings.value;
                if (!hasProfiles(profiles)) {
                    el.parentNode.removeChild(el);
                }
            }
        },
        // getSSRProps(binding, vnode) {
        //     // you can provide SSR-specific props here
        //     console.log('SSR KOUKOU', binding, vnode);
        //     return {};
        // }
    });

    nuxtApp.vueApp.directive('not-profile', {
        mounted(el, bindings) {
            const profiles: AppPermissions | AppPermissions[] | undefined = bindings.value;
            if (hasProfiles(profiles)) {
                el.parentNode.removeChild(el);
            }
        },
        updated(el, bindings) {
            if (bindings.value !== bindings.oldValue) {
                const profiles: AppPermissions | AppPermissions[] | undefined = bindings.value;
                if (hasProfiles(profiles)) {
                    el.parentNode.removeChild(el);
                }
            }
        },
        // getSSRProps(binding, vnode) {
        //     // you can provide SSR-specific props here
        //     console.log('SSR KOUKOU', binding, vnode);
        //     return {};
        // }
    });
});

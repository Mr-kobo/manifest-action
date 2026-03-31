import { IAppParams } from "models/core/common.model";
import { UnwrapNestedRefs } from "nuxt/dist/app/compat/capi";
import { GeneralError } from "~/models/core/errors.model";


export default () => {

    const init = () => {
        const appParams: IAppParams = reactive<IAppParams>({
            // events: eventBus,
            inProgressAuth: "",
            navbar: null,
            topbar: {
                show: false,
                title: "",
                back: false
            }
        });
        provide('app-params', appParams);
        return appParams as UnwrapNestedRefs<IAppParams>;
    }

    const get = (): UnwrapNestedRefs<IAppParams> => {
        const params: UnwrapNestedRefs<IAppParams> | null = inject('app-params', null);
        if (!params) {
            throw new GeneralError({ message: "APP Params haven't been initialized. Call init before using it." })
        }
        return params as UnwrapNestedRefs<IAppParams>;
    }

    return {
        init,
        get
    }
}
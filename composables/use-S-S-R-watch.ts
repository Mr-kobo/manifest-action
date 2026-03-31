import _ from "lodash";
import { UnwrapNestedRefs } from "nuxt/dist/app/compat/capi";


export default async <T = any>(ref: Ref<T> | UnwrapNestedRefs<T>, cb: (value: any) => Promise<void> | void, execute?: () => Promise<any>) => {
  if (isServer() && execute) await execute();
  else if (execute) execute();

  if (isReactive(ref)) {
    const reactive: UnwrapNestedRefs<T> = ref as UnwrapNestedRefs<T>;
    if (isServer()) {
      await cb(reactive);
    } else {
      watch(reactive, cb, { immediate: !_.isEmpty(reactive) });
    }
  } else {
    const reference: Ref<T> = ref as Ref<T>;
    if (isServer()) {
      const value = reference.value;
      await cb(value);
    } else {
      watch(reference, cb, { immediate: !!reference.value });
    }
  }


};
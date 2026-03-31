<template>
    <div class="space-y-8">
        <u-form :schema="registerPasswordless" :state="userLogin" class="flex flex-col space-y-4" ref="loginForm" @submit="onSubmit">
            <u-form-field :label="$t('identifier')" name="identifier">
                <common-identifier v-model="userLogin.identifier" :autofocus="true" />
            </u-form-field>
            <div class="flex flex-row items-center w-full" v-if="rgpd">
                <u-form-field name="rgpd">
                    <u-checkbox v-model="userLogin.rgpd">
                        <template #label>
                            <p ref="rgpdBlocText" class="text-sm ml-2">
                                <span>{{ $t('auth.rgpd') }}</span>
                                <a href="/cgv" target="_blank" class="font-bold cursor-pointer">{{ $t('auth.rgpdlink1') }}</a>, 
                                <a href="/cgv/rules" target="_blank" class="font-bold cursor-pointer">{{ $t('auth.rgpdlink2') }}</a>
                            </p>
                        </template>
                    </u-checkbox>
                </u-form-field>
            </div>
            <u-button type="submit" :loading="loading" class="ml-auto"> {{ $t(register ? "auth.valid_register" : "auth.valid_login") }} </u-button>
        </u-form>
    </div>
</template>
<script setup lang="ts">
import { IRegisterPasswordless, registerPasswordless } from "../../schemas/validators/login.schema";
import type { Form, FormSubmitEvent } from '#ui/types'
const { t } = useI18n();


const props = defineProps({
    register: {
        type: Boolean,
        default: false
    },
    rgpd: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['close']);

const loginForm = ref<Form<IRegisterPasswordless>>();
const userLogin = reactive({ identifier: '', rgpd: props.rgpd? false : undefined });
const loading = ref(false);

const route = useRoute();
const redirection = route.query['callbackUrl']?.toString();

const onSubmit = async (event: FormSubmitEvent<IRegisterPasswordless>) => {
    if(props.rgpd && !event.data.rgpd) {
        loginForm.value?.setErrors([{ name: 'rgpd', message: t('error.rgpd') }], 'rgpd');
        return;
    }

    if (await loginForm.value!.validate() && event.data.identifier) {
        loading.value = true;
        await usePasswordless(event.data.identifier, redirection || usePath('index'));
        emit('close');
        loading.value = false;
    }
};
</script>

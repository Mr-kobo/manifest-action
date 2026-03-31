<template>
    <div class="space-y-8 p-2">
        <u-form :schema="userRegisterValidator" :state="userRegister" :validate="validate" class="flex flex-col space-y-4" ref="registerForm" @submit="onSubmit">
            <u-form-field :label="$t('identifier')" name="identifier">
                <common-identifier v-model="userRegister.identifier" />
            </u-form-field>
            <common-strong-password v-model="userRegister.password" v-model:confirm_password="userRegister.confirm_password" :is-new="true" />
            <div class="flex flex-row items-center w-full">
                <u-form-field name="rgpd">
                    <u-checkbox v-model="userRegister.rgpd">
                        <template #label>
                            <p class="text-sm ml-2">
                                <span>{{ $t('auth.rgpd') }}</span>
                                <a href="/cgv" target="_blank" class="font-bold cursor-pointer">{{ $t('auth.rgpdlink1') }}</a>, 
                                <a href="/cgv/rules" target="_blank" class="font-bold cursor-pointer">{{ $t('auth.rgpdlink2') }}</a>
                            </p>
                        </template>
                    </u-checkbox>
                </u-form-field>
            </div>
            <div v-if="backendErrors['form']" class="text-red-500"> {{ backendErrors['form'] }} </div>
            <div class="w-full text-center">
                <u-button type="submit" :loading="loading"> {{ $t('auth.valid_register') }} </u-button>
            </div>
        </u-form>
    </div>
</template>
<script setup lang="ts">
import { userRegisterValidator } from '../../schemas/auth/user.schema';
import { User } from '~~/models/auth/user.model';
import type { FormError } from '#ui/types';
const { t } = useI18n();
const { signIn } = useAuth();
const registerForm = ref();
const backendErrors = reactive({ form: null, identifier: null, password: null, rgpd: undefined });
const { checkBackendReturn } = useFrontValidation(userRegisterValidator);

const userRegister = reactive({
    identifier: '',
    password: '',
    confirm_password: '',
    rgpd: false
});

const validate = (state: any): FormError[] => {
    const errors = [];
    if (state.password !== state.confirm_password) {
        errors.push({ name: 'confirm_password', message: t('zod.errors.password_mismatch') });
    }
    return errors;
};

const loading = ref<boolean>(false);
const { save } = useAPI();

const onSubmit = async () => {
    if (await registerForm.value.validate()) {
        loading.value = true;
        const user = new User(userRegister);
        const { data: postData, error } = await save(user);
        if (error.value || (postData.value as any)?.errors) {
            const formattedErrors = checkBackendReturn(error.value ? error.value?.data.message : (postData.value as any)?.errors);
            Object.assign(backendErrors, formattedErrors);
        } else {
            await signIn("credentials", { ...user.toJSON(), callbackUrl: usePath('index') });
        }
        loading.value = false;
    };
};
</script>
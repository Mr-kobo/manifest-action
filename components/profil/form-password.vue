<template>
    <u-form :schema="userUpdatePasswordValidator" :state="updatePassword" :validate="validate" class="flex flex-col space-y-4" ref="form" @submit="onSubmit">
        <common-strong-password v-model="updatePassword.password" v-model:confirm_password="updatePassword.confirm_password"  :isNew=true />
        <div class="flex mt-6 justify-center space-x-4">
            <u-button type="submit"> {{ $t("valid") }} </u-button>
        </div>
    </u-form>
</template>
<script setup lang="ts">
import { FormError } from '@nuxt/ui';
import { userUpdatePasswordValidator } from '~/schemas/auth/user.schema';
const { t } = useI18n();

const updatePassword = reactive({
    password: '',
    confirm_password: ''
});

const form = ref();
const emit = defineEmits(["ok"]);
const onSubmit = async () => {
    if (await form.value.validate()) {
        emit('ok', updatePassword.password);
    }
};

const validate = (state: any): FormError[] => {
    const errors = [];
    if (state.password !== state.confirm_password) {
        errors.push({ name: 'confirm_password', message: t('zod.errors.password_mismatch') });
    }
    return errors;
};
</script>
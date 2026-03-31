<template>
    <div class="space-y-8 p-2">
        <u-form :schema="registerPasswordless" :state="userLogin" class="flex flex-col space-y-4" ref="loginForm" @submit="onSubmit">
            <u-form-field :label="$t('identifier')" name="identifier">
                <common-identifier v-model="userLogin.identifier" :autofocus="true" />
            </u-form-field>
            <u-button type="submit" :loading="loading" class="ml-auto"> {{  $t('auth.valid_recovery') }} </u-button>
        </u-form>
    </div>
</template>
<script setup lang="ts">
import { registerPasswordless } from "../../schemas/validators/login.schema";
const loginForm = ref();
const userLogin = reactive({ identifier: '' });
const loading = ref(false);

const onSubmit = async () => {
    if (await loginForm.value.validate()) {
        loading.value = true;
        await usePasswordless(userLogin.identifier);
        loading.value = false;
    }
};
</script>
<template>
    <div class="max-w-md m-auto mt-[5%] w-full p-4 md:p-0 flex flex-col gap-4">
        <auth-register-stepper :current="0" />
        <common-title-page :title="$t('register')" />
        <template v-if="isProviderIncluded(ConfigAuthProvider.GOOGLE)">
            <!-- SOCIALS -->
            <auth-form-social />
            <u-separator :label="$t('OR')" />
        </template>
        <template v-if="isProviderIncluded(ConfigAuthProvider.CREDENTIALS)">
            <!-- CREDENTIALS -->
            <auth-form-register />
            <u-separator :label="$t('OR')" />
        </template>
        <template v-if="isProviderIncluded(ConfigAuthProvider.PASSWORDLESS)">
            <!-- PASSWORDLESS -->
            <auth-form-pwdless :register="true" :rgpd="true" />
        </template>
        <!-- LOGIN -->
        <div class="w-full text-right my-4 max-w-xl text-sm"> 
            <span>{{ $t("auth.have_account") }} : </span> 
            <nuxt-link-locale :to="'auth-login'" class="font-semibold text-sm"> {{ $t('auth.have_account_login') }} </nuxt-link-locale>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ConfigAuthProvider } from "~/app.config";
definePageMeta({ auth: false });
const app_config = useAppConfig();
const isProviderIncluded = (provider: ConfigAuthProvider) => app_config.auth.providers.includes(provider);
defineI18nRoute({
    paths: {
        en: '/auth/register',
        fr: '/auth/inscription',
    }
});
</script>
<template>
    <div class="max-w-md m-auto mt-[5%] w-full p-4 md:p-0 flex flex-col gap-8">
        <common-title-page :title="$t('login')" />
        <!-- SOCIALS -->
        <template v-if="isProviderIncluded(ConfigAuthProvider.GOOGLE) || isProviderIncluded(ConfigAuthProvider.AZURE)">
            <auth-form-social />
            <!-- <u-separator :label="$t('OR')" /> -->
        </template>
        <template v-if="isProviderIncluded(ConfigAuthProvider.CREDENTIALS)">
            <!-- CREDENTIALS -->
            <auth-form-login />
            <u-separator :label="$t('OR')" />
        </template>
        <template v-if="isProviderIncluded(ConfigAuthProvider.PASSWORDLESS)">
            <!-- PASSWORDLESS -->
            <auth-form-pwdless />
        </template>
        <!-- REGISTER -->
        <div class="w-full text-right my-4 max-w-xl text-sm" v-if="app_config.auth.register">
            <span>{{ $t("auth.not_have_account") }} : </span>
            <nuxt-link-locale :to="'auth-register'" class="font-bold text-sm" @click.prevent> {{ $t("auth.not_have_account_register") }} </nuxt-link-locale>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ConfigAuthProvider } from '~/app.config';
const app_config = useAppConfig();
definePageMeta({ auth: false });
const isProviderIncluded = (provider: ConfigAuthProvider) => app_config.auth.providers.includes(provider);
defineI18nRoute({
    paths: {
        en: '/auth/login',
        fr: '/auth/login',
    }
});
const localePath = useLocalePath();
const { status } = useAuth();
if (status.value === "authenticated") {
	await navigateTo(localePath('index'));
}
</script>
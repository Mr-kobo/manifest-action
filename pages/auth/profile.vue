<template>
    <div class="max-w-md m-auto w-full h-full p-4 flex flex-col justify-between">
        <div class="flex flex-col gap-8">
            <common-title-page :title="$t('info_perso')" />
            <profil-form-infos :registerStep="true" />
            <u-separator />
            <profil-password /> 
            <u-separator />
            <profil-interface-lang />   
            <profil-2FA-switcher />
        </div>
        <nuxt-link to="/" class="flex justify-center">
            <u-button leading-icon="mdi-arrow-left" size="xl">{{ $t('return') }}</u-button>
        </nuxt-link>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ auth: true, layout: "logged" });
defineI18nRoute({
    paths: {
        en: '/auth/profile',
        fr: '/auth/profil',
    }
})

const { query } = useRoute();
const { t } = useI18n();

onMounted(() => {
    if (query['status'] && query['status'] === 'ok') {
        useAlert().success(t('profil.edited'));
    } else if(query['status'] && query['status'] === 'nok') {
        useAlert().error(t('error.profil_notedited'));
    }
});
</script>

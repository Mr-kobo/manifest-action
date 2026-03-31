<template>
    <u-select
        :label="$t('profil.interface_lang')"
        v-model="lang"
        :items="options"
        track-by="value"
    />
</template>

<script setup lang="ts">
    const app_config = useAppConfig();  
    const { refreshLogged } = useLogged();
    const { success, error } = useAlert();
    const { setLang } = useLogged();
    const { t, locale } = useI18n();
    const options = app_config.langs.map(item => { return { label: t(`langs.${item}`), value: item } });
    const lang = ref(locale.value);

    watch(lang, async () => {
        try {
            await setLang(lang.value);
            await refreshLogged();
            success(t('profil.lang_edited'));
        } catch(err) {
            // console.log(err);
            error(t('error.lang_not_edited'));
        }
    });
</script>
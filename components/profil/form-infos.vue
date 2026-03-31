<template>
    <u-form :schema="userProfilValidator" :state="profil" class="flex flex-col w-full justify-center items-center space-y-8 max-w-xl" ref="profilForm" @submit="onSubmit">
        <profil-avatar v-model="profil.avatar" />
        <profil-form-infos-fields v-model="profil"/>
        <u-button type="submit" :loading="loading">
            {{ $t("valid") }}
        </u-button>
    </u-form>
</template>

<script setup lang="ts">
    import { userProfilValidator } from "~~/schemas/auth/user.schema";
    const { t } = useI18n();
    const { refreshLogged, getLoggedProfil, setProfil } = useLogged();

    const { success } = useAlert();
    const profilForm = ref();
    const profil = reactive({firstname:"", lastname:"", avatar:"", position: ""});
    const loading = ref<boolean>(false);

    const onSubmit = async () => {
        if (await profilForm.value.validate()) {
            loading.value = true;
            await setProfil({...profil, avatar: getLoggedProfil()?.avatar});
            await refreshLogged();
            success(t('profil.edited'));
            loading.value = false;
        }
    }

    onMounted(async ()=>{
        Object.assign(profil, getLoggedProfil());
    })
</script>
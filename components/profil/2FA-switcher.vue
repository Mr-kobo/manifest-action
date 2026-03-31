<template>
    <u-modal ref="modal" :title="$t('auth.2FA.disable2fa')" :description="$t('are_you_sure')" :close="true" v-model:open="showConfirm">
        <template #footer>
            <UButton :label="$t('Ok')" @click="onOk()" />
        </template>
    </u-modal>
    <u-switch v-model="enable2FA" :label="$t('auth.2FA.2FA_enabled')" color="success" size="sm" class="custom-switch mb-6" />
</template>
<script setup lang="ts">
import { NotAuthenticated } from '~/models/core/errors.model';
const { success } = useAlert();
const { t } = useI18n();
const router = useRouter();

const showConfirm = ref<boolean>(false);
const { getLoggedId, getLoggedIdentifier, getLoggedPreferences, refreshLogged } = useLogged();
const enable2FA = ref<boolean>(getLoggedPreferences()?.enable2FA || false);
const { fetch } = useAPI();

if (!getLoggedId()) {
    throw new NotAuthenticated();
}

watch(enable2FA, (newVal) => {
    console.log(enable2FA.value, getLoggedPreferences());
    if (enable2FA.value) {
        router.push("/auth/2FA");
    }
    else {
        enable2FA.value = true;
        showConfirm.value = true;
    }
});



const onOk = async () => {
    await fetch(`/api/2FA/update`, {
        method: "POST",
        body: {
            identifier: getLoggedIdentifier(),
            enabled: false,
        },
    }, { await: true });
    success(t('auth.2FA.disabledSuccess'));
    enable2FA.value = false;
    await refreshLogged();
};

const onCancel = () => {
    enable2FA.value = true;
};
</script>

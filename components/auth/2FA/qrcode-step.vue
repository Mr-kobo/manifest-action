<template>
    <div class="w-[40rem] m-auto flex flex-col gap-4 justify-center items-center">
        <u-alert class="" :title="$t('auth.2FA.invalid_qrcode')" color="error" icon="mdi-error" v-if="validationError" />
        <u-alert :title="$t('auth.2FA.note_the_recovery_code')" :description="twoFARecovery" color="warning" icon="mdi-warning" v-if="twoFARecovery !== ''" />
        <div class="flex flex-col gap-2 justify-center items-center w-full bg-slate-300 rounded-lg p-8">
            <p class="mb-4">{{ $t('auth.2FA.your_qrcode') }}</p>
            <img class="w-64" :src="twoFAQr" alt="QRCode for 2FA" />
        </div>
        <u-button @click="onStepDone" trailing-icon="mdi-arrow-forward"> {{ $t("next") }} </u-button>
    </div>
</template>
<script setup lang="ts">
const router = useRouter();
const validationError: Ref<boolean> = ref(false);
const twoFAQr: Ref<string> = ref("");
const twoFARecovery: Ref<string> = ref("");
const props = defineProps({
    identifier: { type: String, required: true }
});
const emit = defineEmits(["goStep2"]);
const { fetch } = useAPI();

onMounted(async () => {
    const { data, error } = await fetch<{ isNew: boolean; identifier: string; recovery?: string; qrcode: string; hasBeenValidated: boolean; }>(
        `/api/2FA/${props.identifier}`, {}, { await: true });
    if (error.value) {
        validationError.value = true;
        return;
    }
    twoFAQr.value = data.value?.qrcode || "";
    twoFARecovery.value = data.value?.recovery || "";

    if (data.value?.hasBeenValidated) {
        router.replace(usePath('profil'));
    }
});

const onStepDone = async () => {
    emit('goStep2');
};
</script>

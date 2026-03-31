<template>
    <div class="flex w-full gap-2">
        <common-countries-select v-if="isPhoneIdentifier" v-model="selectedCountry" />
        <u-input class="flex-grow" :required="true" :placeholder="label" v-model="identifier" :type="isPhoneIdentifier ? 'number' : 'text'" :disabled="disabled" :autofocus="autofocus" />
    </div>
</template>
<script setup lang="ts">
import { ConfigIdentifier } from "~/app.config";

const app_config = useAppConfig();
const identifier = defineModel<string>({
    required: true,
    default: "",
    set(v) {
        return isPhoneIdentifier.value ? prefixe.value + v : v;
    },
});
const props = defineProps({
    disabled: { type: Boolean },
    autofocus: { type: Boolean, default: false }
});
// const { validField } = useFrontValidation(loginValidator);
const { t } = useI18n();
const identifierType = app_config.auth.identifier;
const isPhoneIdentifier = computed(() => identifierType === ConfigIdentifier.PHONE || (identifierType === ConfigIdentifier.BOTH && !isNaN(identifier.value.charAt(0) as any) && identifier.value !== ""));
const label = computed(() => identifierType === ConfigIdentifier.BOTH ? t('phone_or_email') : (isPhoneIdentifier.value ? t('phone') : t('email')));
const selectedCountry = ref<any>({
    code: "FR",
    flag: "https:\/\/cdn.jsdelivr.net\/npm\/country-flag-emoji-json@2.0.0\/dist\/images\/FR.svg",
    text: "France",
    value: "FR",
    textBy: "+33"
});
const prefixe = computed(() => {
    return selectedCountry.value?.textBy;
});

</script>
<template>
    <u-form-field :label="(isNew ? $t('new') + ' ' : '') + $t('password')" name="password">
        <common-password v-model="password"/>
    </u-form-field>
    <u-form-field :label="$t('auth.confirm_password')" name="confirm_password">
        <common-password v-model="confirm_password"/>
    </u-form-field>
</template>
<script setup lang="ts">
const { t } = useI18n();
const password = defineModel<string>();
const confirm_password = defineModel<string>('confirm_password');

const props = defineProps({
    isNew: {
        type: Boolean,
        default: false
    }
});
const inputEmits = defineEmits(["onInputChange"]);
const updateValue = (value: any) => {
    inputEmits("onInputChange", value);
};
</script>

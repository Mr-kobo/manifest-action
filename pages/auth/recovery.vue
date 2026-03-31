<template>
    <div class="max-w-xl m-auto">
        <common-title-page title="Recovery Page" />
        <p class="p-2">{{ $t('auth.recovery_help_step1') }}</p>
        <auth-form-recovery />
    </div>
</template>
<script setup lang="ts">
definePageMeta({ auth: false });
defineI18nRoute({
    paths: {
        en: '/auth/recovery',
        fr: '/auth/recuperation',
    }
});
</script>
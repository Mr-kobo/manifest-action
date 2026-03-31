<template>
    <div class="flex flex-col items-center gap-8">
        <common-title-page :title="$t('error.title')" />
        <div v-if="error" class="w-96 flex flex-col justify-center items-center gap-4 border-error border-dashed border-2 p-8">
            <u-icon class="size-10 text-error" name="mdi-error" />
            <span>{{ $t(error) }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ auth: false });
defineI18nRoute({
    paths: {
        en: '/error',
        fr: '/error',
    }
});
const { query } = useRoute();
const error = computed(() => `error.${(query.error as string)?.toLowerCase() || 'default'}`);
</script>
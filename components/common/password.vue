<template>
    <div class="flex w-full gap-2">
        <u-input class="flex-grow" :required="true" :placeholder="placeholder" v-model="password" :type="isReadable ? 'text' : 'password'" :disabled="disabled" :autofocus="autofocus">
            <template #trailing>
                <u-button @click="isReadable = !isReadable" :icon="isReadable ? 'mdi-visibility-off' : 'mdi-visibility'" color="neutral" variant="link" aria-label="Clear input" size="sm" />
            </template>
        </u-input>
    </div>
</template>
<script setup lang="ts">
const password = defineModel<string>({
    default: "",
});
const isReadable = ref(false);
const props = defineProps({
    placeholder: { type: String, default: "Password" },
    disabled: { type: Boolean },
    autofocus: { type: Boolean, default: false },
});
</script>
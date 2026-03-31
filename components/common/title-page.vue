<template>
    <h1 class="text-xl text-left pb-8">
        {{ title }}
    </h1>
</template>
<script setup lang="ts">
    const props = defineProps({
        title: {
            type: String,
            required: true,
        }
    });
</script>
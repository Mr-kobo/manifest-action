<template>
  <div v-if="progress" class="flex flex-col gap-4 items-end w-full">
    <u-progress v-model="progress.value" status />
    <p>{{ progress.message }}</p>
  </div>
</template>

<script setup lang="ts">
import { IProgress } from '~/composables/use-A-P-I';

const progress: Ref<IProgress | null> = defineModel<IProgress | null>({
  default: null,
});
</script>

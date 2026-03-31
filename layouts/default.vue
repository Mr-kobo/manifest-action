<template>
	<div class="flex w-screen h-screen item-center justify-center">
		<div class="flex max-w-8xl w-full rounded-xl m-8">
			<div class="w-1/2 rounded-xl overflow-hidden hidden md:block">
				<img src="https://picsum.photos/800/800" class="object-cover max-w-fit h-full" />
			</div>
			<div class="w-full md:w-1/2 p-8">
				<u-alert v-if="error" :description="$t(error)" color="error" icon="mdi-error" class="m-auto mb-10" />
				<slot />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router";
const error = computed(() => useRouteQuery("error").value ? `error.${useRouteQuery("error").value?.toString()?.toLowerCase()}` : null);
</script>
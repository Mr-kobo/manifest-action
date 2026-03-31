<template>
	<div class="flex flex-col overflow-hidden gap-8 p-8">
	</div>
</template>

<script setup lang="ts">
import { User } from '~/models/auth/user.model';
definePageMeta({ auth: true, layout: "logged" });
defineI18nRoute({
	paths: {
		en: '/',
		fr: '/',
	}
})

const { list } = useAPI();
const { data } = await list(User, {});
</script>
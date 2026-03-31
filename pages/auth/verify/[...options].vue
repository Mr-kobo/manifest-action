<template>
    <div class="max-w-md m-auto mt-[5%] w-full p-4 md:p-0" v-if="action !=='send'">
		<auth-form-pincode :type="type" :cells="6" :identifier="identifier" />
	</div>
</template>

<script setup lang="ts">
	import { ValidationType } from '~~/schemas/validators/login.schema';
	definePageMeta({ auth: false });
	defineI18nRoute({
		paths: {
			en: '/auth/verify/[...options]',
			fr: '/auth/verify/[...options]',
		}
	});

	const route = useRoute();
	const options = route.params['options'];
	const type: ValidationType = options[0] as ValidationType;
	const identifier = options[1];
	const action = options[2]
	const redirection = route.query['callbackUrl']?.toString();

	onMounted(async () => {
		if (action === 'send') {
			await usePasswordless(identifier, redirection);
		}
	});
</script>

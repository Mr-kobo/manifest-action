<template>
	<div class="max-w-8xl m-auto">
		<common-title-page title="2FA" />
		<auth-2FA-qrcode-step :identifier="getLogged()!.identifier" v-if="step===1" @goStep2="step=2"/>
		<auth-form-pincode :cells="6" type="2FAQR" :identifier="getLogged()!.identifier" v-if="step===2"/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({ auth: true, layout: "logged" });
	defineI18nRoute({
		paths: {
			en: '/auth/verify/2FA',
			fr: '/auth/verify/2FA',
		}
	});
	
	const { getLogged } = useLogged();
	const step = ref<number>(1);
</script>

<template>
	<div >
		<u-form :schema="loginValidator" :state="userLogin" class="flex flex-col space-y-4" ref="loginForm" @submit="onSubmit">
			<u-form-field :label="$t('identifier')" name="identifier">
				<common-identifier v-model="userLogin.identifier" />
			</u-form-field>
			<u-form-field :label="$t('password')" name="password">
				<common-password v-model="userLogin.password" />
			</u-form-field>
			<div class="flex justify-between">
				<div class="text-left text-sm cursor-pointer">
					<u-checkbox v-model="userLogin.stayLog" :label="$t('auth.stay_log')" left-label></u-checkbox>
				</div>
				<div class="text-right text-sm cursor-pointer">
					<nuxt-link-locale to="auth-recovery"> {{ $t("auth.pass_forgot") }} </nuxt-link-locale>
				</div>
			</div>
			<div v-if="pageError" class="text-red-500"> {{ $t(`error.badcredential`) }} </div>
			<u-button type="submit" :loading="loading" size="md" class="ml-auto"> {{ $t("auth.valid_login") }} </u-button>
		</u-form>
	</div>
</template>
<script setup lang="ts">
import { loginValidator } from "../../schemas/validators/login.schema";
const loginForm = ref();
const pageError = ref(false);
const { signIn } = useAuth();
const userLogin = reactive({ identifier: "", password: "", stayLog: true });
const loading = ref(false);

const route = useRoute();
const redirection = route.query['callbackUrl']?.toString();

const onSubmit = async () => {
	if (await loginForm.value.validate()) {
		loading.value = true;
		const sign = await signIn("credentials", { ...userLogin, callbackUrl: redirection || usePath('index') });
		loading.value = false;
	}
};
</script>

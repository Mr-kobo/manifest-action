<template>
    <form class="flex flex-col w-full">
        <common-title-page :title="$t('verif_code')" />
        <u-form :schema="tokenValidator" :state="state" class="flex flex-col gap-8" ref="pincodeForm">
            <p class="text-sm" v-html="title"></p>
            <u-form-field v-if="!identifier" :label="$t('identifier')" name="identifier">
                <common-identifier v-model="definedIdentifier" />
            </u-form-field>
            <!-- <u-input  v-model="definedIdentifier" :label="$t('identifier')" :placeholder="$t('identifier')" :rules="[() => validField('identifier', { identifier: definedIdentifier })]" /> -->
            <u-form-field class="text-center">
                <common-pincode :cells="cells" :isDisabled="disabledCode" @onCodeChange="onCodeChange" class="" />
            </u-form-field>
            <u-progress v-if="disabledCode" class="m-auto" animation="carousel" />
            <div class="flex justify-end w-full">
                <u-button type="button" size="sm" v-if="(props.type === ValidationType.EMAIL || props.type === ValidationType.SMS) && props.identifier && !resent" @click="resend()"> {{ $t('auth.resend_code') }} </u-button>
            </div>
        </u-form>
        <div v-if="errors" class="text-red-500"> {{ $t('auth.pincode_error') }} </div>
    </form>
</template>
<script setup lang="ts">
import { ITokenValidator, tokenValidator, ValidationType } from '~~/schemas/validators/login.schema';

const props = defineProps({
    cells: { type: Number, default: 6 },
    type: { type: String, required: true },
    identifier: { type: String }
});
const emit = defineEmits(["onSuccess", "onFailure"]);

const state = reactive<ITokenValidator>({
    identifier: '',
    token: ''
});


const { t } = useI18n();
const { refreshLogged } = useLogged();
const { signIn } = useAuth();
const router = useRouter();
const { success } = useAlert();
const definedIdentifier = ref('');
const title = ref('');
const redirection = usePath('profil');
const resent = ref(false);
const { fetch } = useAPI();

// titles
const titles: { [key: string]: string; } = {
    [ValidationType.TWOFA]: t('auth.2FA.2FA_enabled'),
    [ValidationType.EMAIL]: t('auth.pincode_help') + '<br/>' + t('auth.pincode_help2'),
    [ValidationType.TWOQR]: t('auth.2FA.activate_2fa_by_validating_code'),
    [ValidationType.CONFIRM]: t('auth.pincode_help_editpassword', { identifier: props.identifier })
};

title.value = titles[props.type];
const disabledCode = ref<boolean>(false);
const errors = ref<boolean>(false);

const onCodeChange = async (newCode: string) => {
    if (newCode.length === props.cells) {
        const userToken: ITokenValidator = {
            identifier: props.identifier || definedIdentifier.value,
            token: newCode
        };
        disabledCode.value = true;
        errors.value = false;

        if (tokenValidator.safeParse(userToken).success) {
            switch (props.type) {
                case ValidationType.TWOQR:
                    testCode2faQrcode(userToken);
                    break;
                case ValidationType.EMAIL:
                    emailValidation(userToken);
                    break;
                case ValidationType.SMS:
                    smsValidation(userToken);
                    break;
                case ValidationType.TWOFA:
                    testCode2fa(userToken);
                    break;
                case ValidationType.CONFIRM:
                    confirmModification(userToken);
                    break;
            }
        }
    }
};

const testCode2faQrcode = async (creds: ITokenValidator) => {
    const { data, error } = await fetch("/api/2FA/validate", {
        method: "POST",
        body: {
            token: creds.token,
            identifier: creds.identifier
        }
    });
    if (error.value || data.value === false) {
        disabledCode.value = false;
        return errors.value = true;
    }
    refreshLogged();
    success(t('auth.2FA.enabledSuccess'));
    router.replace(usePath('profil'));
};

const confirmModification = async (creds: ITokenValidator) => {
    console.log('confirmation modification');
    const { data, error } = await fetch(`/api/confirm?identifier=${creds.identifier}&token=${creds.token}`, {}, { await: true });
    if (data && data.value) {
        console.log('confirm', data.value);
        emit('onSuccess', data.value);
    } else
        if (error && error.value) {
            console.log('error', data.value);
            emit('onFailure', error.value);
        }
};

const testCode2fa = async (creds: ITokenValidator) => {
    await signIn(props.type, { ...creds, callbackUrl: redirection || usePath('index') });
};

const emailValidation = async (creds: ITokenValidator) => {
    console.log('email validation');
    document.location.href = `/api/auth/callback/email?email=${creds.identifier}&token=${creds.token}${redirection ? '&callbackUrl=' + redirection : ''}`;
};

const smsValidation = async (creds: ITokenValidator) => {
    console.log('sms validation');
    document.location.href = `/api/auth/callback/sms?email=${creds.identifier}&token=${creds.token}${redirection ? '&callbackUrl=' + redirection : ''}`;
};

const resend = async () => {
    if (props.identifier && (props.type === ValidationType.EMAIL || props.type === ValidationType.SMS)) {
        resent.value = true;
        await usePasswordless(props.identifier, usePath('index'));
    }
};
</script>

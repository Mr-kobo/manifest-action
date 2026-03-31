<template>
    <!-- @close="() => step = 1" -->
    <u-modal :title="$t('auth.edit_password')" v-model:open="open" :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }">
        <div class="flex flex-col gap-4">
            <u-input disabled :label="$t('password')" placeholder="**********" />
            <u-button class="m-auto"> {{ $t("auth.edit_password") }} </u-button>
        </div>
        <!-- MODAL -->
        <template #body>
            <div class="p-4">
                <profil-form-password v-if="step === 1" @ok="onOkPassword" />
                <auth-form-pincode v-if="step === 2" :identifier="getLoggedIdentifier()" :type="ValidationType.CONFIRM" @onSuccess="onSuccess" @onFailure="onFailure" />
            </div>
        </template>
    </u-modal>
</template>
<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router';
import { User } from '~~/models/auth/user.model';
import { ValidationType } from '~~/schemas/validators/login.schema';

const { getLoggedIdentifier, getLoggedId } = useLogged();
const { t } = useI18n();
const { success, error } = useAlert();
const { save } = useAPI();

const open = ref(false);
const password = ref();
const step = ref(1);

const onOkPassword = async (passwd: string) => {
    step.value = 2;
    password.value = passwd;
    const user = new User({ _id: getLoggedId() });
    user.password = passwd;
    await save(user);
};

const onSuccess = (result: any) => {
    open.value = false;
    success(t('auth.password_edited'));
    step.value = 1;
};

const onFailure = (err: any) => {
    open.value = false;
    error(t('error.password_notedited'));
    step.value = 1;
};

const status = useRouteQuery('status');
if (status.value === 'ok') {
    onSuccess({});
} else if (status.value === 'nok') {
    const message = useRouteQuery('message');
    onFailure(message.value);
}

</script>
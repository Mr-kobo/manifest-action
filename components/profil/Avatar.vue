<template>
    <div class="relative text-center w-12/12">
        <input type="file" ref="avatarFile" class="hidden" accept=".jpg,.jpeg,.png" v-on:change="onChangeFileUpload()" />
        <u-avatar v-if="getLoggedAvatar()" :src="getLoggedAvatar()" :text="getLoggedInitial()?.toUpperCase()" class="size-[5rem] border" />
        <u-avatar v-else class="size-[5rem]" :text="getLoggedInitial()?.toUpperCase()" />
        <div class="relative ml-12 -top-6">
            <u-popover mode="hover">
                <div class="relative left-2 top-0">
                    <u-button icon="mdi-upload" variant="subtle" color="neutral" class="rounded-2xl" :disabled="isLoading" :loading="isLoading" @click="onClickEdit" />
                </div>
                <template #content>
                    <div class="p-4">
                        <p class="text-sm">{{ $t('profil.avatar_upload') }}</p>
                    </div>
                </template>
            </u-popover>
        </div>
        <div class="absolute left-1/2 -top-1 ml-4" v-if="getLoggedAvatar()">
            <u-button icon="mdi-close" class="rounded-2xl" :loading="isLoading" :disabled="isLoading" color="error" size="sm" @click="onClickRemove" variant="solid" />
        </div>
    </div>
</template>
<script setup lang="ts">
import useFrontValidation from '~/composables/use-front-validation';
const { t } = useI18n();
const { success, error: snackError } = useAlert();
const { getLoggedInitial, getLoggedAvatar, refreshLogged, setAvatar } = useLogged();
const { errorToText } = useFrontValidation(undefined);
const isLoading = ref(false);
const avatarFile = ref<HTMLElement>();
const { fetch } = useAPI();

const onClickEdit = () => {
    avatarFile.value?.click();
};

const onClickRemove = async () => {
    try {
        await setAvatar("");
        await refreshLogged();
        success(t('profil.avatar_upload_success'));
    } catch (err) {
        snackError(t('profil.avatar_upload_error'));
    }
};

const onChangeFileUpload = async () => {
    const selectedFile = avatarFile.value?.files[0];
    if (selectedFile) {
        isLoading.value = true;
        const formData = new FormData();
        formData.append('files', selectedFile);
        // formData.append('preset', JSON.stringify({resize:{width: 100,height: 100,fit: 'fill'}}));
        formData.append('preset', JSON.stringify(['images', 'avatar']));
        formData.append('type', 'avatar');
        formData.append('thumb', '20'); // thumb with max height or with 20
        const { data, error } = await fetch(`/api/files/upload`, {
            method: 'POST',
            body: formData,
        }, { await: true });
        if (!error.value && data.value?.file[0].uri) {
            await setAvatar(data.value.file[0].uri);
            await refreshLogged();
            success(t('profil.avatar_upload_success'));
        } else {
            snackError(t('profil.avatar_upload_error') + ': ' + errorToText(error.value?.message || error.value?.statusMessage as string));
        }
        isLoading.value = false;
    }
};
</script>
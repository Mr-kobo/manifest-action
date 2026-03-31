<template>
    <UApp>
        <NuxtLayout>
            <common-loader :global="true" :loading="isLoading">
                <NuxtPage />
            </common-loader>
        </NuxtLayout>
    </UApp>
</template>
<script setup lang="ts">
import moment from "moment-timezone";
const router = useRouter();
moment.tz.setDefault("Europe/Paris");
moment.locale("fr");
const { isLoading } = useLoadingIndicator();
</script>

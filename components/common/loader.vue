<template>
    <div class="relative">
        <div :class="{ 'blur': loading }">
            <slot></slot>
        </div>
        <div v-if="loading" :class="global ? 'global-loader' : 'local-loader'" class="w-full h-full">
            <client-only>
                <div class="w-full h-full flex justify-center items-center">
                    <div class="max-w-40 max-h-40 z-50">
                        <vue-lottie :animationData="loaderJSON"></vue-lottie>
                    </div>
                </div>
            </client-only>
        </div>
    </div>
</template>
<script setup lang="ts">
import loaderJSON from '~/assets/loader.json';
defineProps({
    loading: { type: Boolean, default: false },
    global: { type: Boolean, default: false },
});
</script>
<style scoped>
.global-loader {
    /* @apply fixed top-0 left-0 bg-white opacity-50 z-50; */
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    opacity: 0.5;
    z-index: 50;
}

.local-loader {
    /* @apply bg-white opacity-50 z-50; */
    opacity: 0.5;
    z-index: 50;
    position: absolute;
    top:0;
    left:0;
}
</style>
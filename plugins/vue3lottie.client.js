import { Vue3Lottie } from 'vue3-lottie';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Vue3Lottie)
    nuxtApp.vueApp.component('vue-lottie', Vue3Lottie);
})

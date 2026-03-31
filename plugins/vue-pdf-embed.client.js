import VuePdfEmbed from 'vue-pdf-embed';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VuePdfEmbed)
    nuxtApp.vueApp.component('VuePdfEmbed', VuePdfEmbed);
})
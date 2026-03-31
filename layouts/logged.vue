<template>
    <div class="flex flex-col items-center">
        <u-navigation-menu :items="menu">
            <template #item-label="{ item }"> {{ item.label }} </template>
        </u-navigation-menu>
        <div class="max-w-7xl m-auto w-full">
            <u-alert :description="loggedUser" color="info" icon="mdi-account" class="m-auto mb-10" />
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
import { NavigationMenuItem } from '@nuxt/ui';

const { locale, t } = useI18n();
const { refreshLogged, getLogged } = useLogged();
const localePath = useLocalePath();

await refreshLogged();
const loggedUser: ComputedRef<string | undefined> = computed(() => JSON.stringify(getLogged()));

const menu: Ref<NavigationMenuItem[]> = ref([
    {
        label: t('home'),
        icon: 'i-lucide-book-open',
        to: localePath('index'),
    },
    {
        label: t('products.title'),
        icon: 'i-lucide-inbox',
        to: localePath('products'),
    },
    {
        label: t('profil.title'),
        icon: 'i-lucide-user',
        to: localePath('auth-profile'),
    },
    {
        label: t('logout'),
        icon: 'i-lucide-power',
        to: localePath('auth-logout'),
    }
]);
</script>

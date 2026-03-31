<template>
    <div class="flex flex-col my-4 gap-4">
        <u-button :icon="'i-lucide-arrow-left'" @click="navigateTo($localePath('products'))">{{ $t('products.title') }}</u-button>
        <h1>{{ pageTitle }}</h1>
    </div>
    <u-form :schema="productValidator" :state="state" class="space-y-4" @submit="onSubmit">
        <u-form-field label="Name" name="name">
            <u-input v-model="state.name" />
        </u-form-field>
        <u-form-field label="Price" name="price">
            <u-input v-model="state.price" type="number" />
        </u-form-field>
        <products-details v-model="state.details" />
        <UButton type="submit" color="primary">Save</UButton>
    </u-form>
</template>
<script setup lang="ts">
import { Product } from '~/models/business/product.model';
import { IProduct, productValidator } from '~/schemas/business/product.schema';

definePageMeta({ auth: true, layout: "logged" });
defineI18nRoute({
    paths: {
        en: '/products/[id]',
        fr: '/produits/[id]',
    }
});

const route = useRoute();
const params = route.params;
const localePath = useLocalePath();
const { t } = useI18n();

const isEditing = computed(() => params.id && params.id !== t('new'));
const pageTitle = computed(() => isEditing.value ? 'Modifier Produit' : 'Ajouter Produit');

const state = reactive<IProduct>({
    name: '',
    price: 0,
    details: {
        description: '',
        manufacturer: '',
        warrantyPeriod: 0,
        stock: 0,
    }
});

const { save, retrieve } = useAPI();

onMounted(async () => {
    if (isEditing.value) {
        const { data } = await retrieve(new Product({ _id: params.id as string }), {}, {
            await: true,
            onError: () => { navigateTo(localePath('products')); }
        });
        Object.assign(state, data.value);
    }
});

async function onSubmit() {
    const product = new Product(state);
    await save<Product>(product, {
        snack: {
            success: 'Product saved successfully',
            error: 'Error saving product',
        },
    });
}
</script>
<style scoped></style>
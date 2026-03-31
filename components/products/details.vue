<template>
    <UForm :schema="productDetailsValidator" :state="model" class="space-y-4">
        <UFormField label="Description" name="description">
            <UInput v-model="model.description" />
        </UFormField>
        <UFormField label="Manufacturer" name="manufacturer">
            <UInput v-model="model.manufacturer" />
        </UFormField>
        <UFormField label="Warranty Period (months)" name="warrantyPeriod">
            <UInput v-model="model.warrantyPeriod" type="number" />
        </UFormField>
        <UFormField label="Stock" name="stock">
            <UInput v-model="model.stock" type="number" />
        </UFormField>
    </UForm>
</template>
<script setup lang="ts">
import { IProductDetails } from '~/schemas/business/product.schema';
import { productDetailsValidator } from '~/schemas/business/product.schema';


const model = defineModel<IProductDetails>({
    required: true,
});

</script>
<style scoped></style>
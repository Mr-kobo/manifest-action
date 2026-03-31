<template>
  <div>
    <div class="flex justify-between gap-4 my-4">
      <div>
        <h1>Product Page</h1>
        <p>Welcome to the product page!</p>
      </div>
      <u-button :icon="'i-lucide-plus'" @click="navigateTo(`${$localePath('products')}/${$t('new')}`)">{{ $t('products.new') }}</u-button>
    </div>
    <UTable :data="products || []" :columns="columns" class="w-full" />
  </div>
</template>
<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table';
import { Product } from '~/models/business/product.model';
import useAPI from '~/composables/use-A-P-I';

definePageMeta({ auth: true, layout: "logged" });
defineI18nRoute({
  paths: {
    en: '/products',
    fr: '/produits',
  }
});

const { list } = useAPI();
const { data: products } = await list(Product);
const localePath = useLocalePath();

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product Name',
    meta: {
      class: {
        th: 'text-left font-semibold',
        td: 'text-left font-semibold'
      }
    }
  },
  {
    accessorKey: 'price',
    header: 'Price',
    meta: {
      class: {
        th: 'text-right font-bold text-primary',
        td: 'text-right font-mono'
      }
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);

      return h(
        'span',
        {
          class: 'font-semibold text-success'
        },
        formatted
      );
    }
  },
  {
    accessorKey: 'details.description',
    header: 'Description',
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left'
      }
    },
    cell: ({ row }) => {
      const product = row.original as Product;
      return product.details?.description || 'N/A';
    }
  },
  {
    accessorKey: 'details.manufacturer',
    header: 'Manufacturer',
    meta: {
      class: {
        th: 'text-left',
        td: 'text-left'
      }
    },
    cell: ({ row }) => {
      const product = row.original as Product;
      return product.details?.manufacturer || 'N/A';
    }
  },
  {
    accessorKey: 'details.warrantyPeriod',
    header: 'Warranty',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center'
      }
    },
    cell: ({ row }) => {
      const product = row.original as Product;
      const warranty = product.details?.warrantyPeriod;
      return warranty ? `${warranty} months` : 'N/A';
    }
  },
  {
    accessorKey: 'details.stock',
    header: 'Stock',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center'
      }
    },
    cell: ({ row }) => {
      const product = row.original as Product;
      const stock = product.details?.stock || 0;
      const colorClass = stock > 10 ? 'text-success' : stock > 0 ? 'text-warning' : 'text-error';

      return h(
        'span',
        {
          class: `font-semibold ${colorClass}`
        },
        stock.toString()
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center'
      }
    },
    cell: ({ row }) => {
      const product = row.original as Product;
      return h(
        'div',
        {
          class: 'flex gap-2 justify-center'
        },
        [
          h(
            'u-button',
            {
              size: 'xs',
              variant: 'outline',
              icon: 'i-lucide-edit',
              onClick: () => navigateTo(`${localePath('products')}/${product._id}`)
            },
            'Edit'
          )
        ]
      );
    }
  }
];
</script>
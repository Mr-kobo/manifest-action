<template>
    <u-dropdown :items="items">
        <u-button color="white">
            <img :src="selectedCountry?.flag" class="size-5" /><u-icon name="mdi-chevron-down"></u-icon>
        </u-button>
    </u-dropdown>
</template>
<script setup lang="ts">
import _ from "lodash";
import countries from "assets/countries.json";

const props = defineProps({
    phone: { type: Boolean, default: false }
});

interface Country {
    code: string,
    flag: string,
    text: string,
    value: string,
    textBy: string;
}

const formattedCountries = _.values(_.mapValues(countries, (country, key, index) => { return { code: key, flag: country.image, text: `${country.name}${props.phone? '(' + country.phone[0] + ')' : ''}`, value: key, textBy: country.phone[0] }; }));
const selectedCountry = defineModel<Country>({
    required: true,
});

const items = computed(() => {
    return [formattedCountries.map(item => {
        return {
            label: item.text,
            avatar: {
                src: item.flag,
                alt: "Country flag"
            },
        };
    })];
});
</script>
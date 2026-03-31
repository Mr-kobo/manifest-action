<template>
    <u-form-field :label="$t('firstname')" name="firstname" class="w-full">
        <u-input v-model="profil.firstname" :required="true" :placeholder="$t('firstname')" class="w-full" />
    </u-form-field>
    <u-form-field :label="$t('lastname')" name="lastname" class="w-full">
        <u-input v-model="profil.lastname" :required="true" :placeholder="$t('lastname')" class="w-full"/>
    </u-form-field>
</template>
<script setup lang="ts">
import { IProfil } from "~~/schemas/auth/user.schema";
const profil = defineModel<IProfil>({
    required: true,
});
</script>
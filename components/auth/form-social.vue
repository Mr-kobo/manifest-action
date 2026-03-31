<template>
    <div class="flex flex-row justify-evenly">
        <div class="text-center">
            <u-button :label="$t('auth.signin_google')" color="accent" @click="SigninWithProvider('google')">
                <template #leading>
                    <img src="/google.svg" class="w-6 mr-3" />
                </template>
            </u-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { signIn } = useAuth();
    const SigninWithProvider = async (provider: string) => {
        await signIn(provider);
    }
</script>
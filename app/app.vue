<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt';
useHead({
    titleTemplate: 'aruCraftR - %s',
});
</script>

<template>
    <UApp
        :toaster="{ position: 'top-center' }"
        class="max-h-screen"
    >
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
    <SpeedInsights />
</template>

<style>
body {
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.page-enter-active,
.page-leave-active {
    transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(0.7rem);
}

.layout-enter-active,
.layout-leave-active {
    transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
    filter: grayscale(1);
}
</style>

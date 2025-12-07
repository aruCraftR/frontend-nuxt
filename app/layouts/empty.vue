<script setup lang="ts">
const route = useRoute()
useHead({
    meta: [{ property: 'og:title', content: `aruCraftR - ${route.meta.title}` }],
})
</script>

<template>
    <div class="h-[calc(100vh-var(--ui-header-height))]">
        <slot />
    </div>
</template>

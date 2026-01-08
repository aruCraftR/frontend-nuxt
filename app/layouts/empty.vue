<script setup lang="ts">
const route = useRoute()
useHead({
    meta: [{ property: 'og:title', content: `aruCraftR - ${route.meta.title}` }],
})
</script>

<template>
    <div>
        <slot />
        <UFooter>
            <template #left>
                <p class="text-muted text-sm">
                    Copyright © {{ new Date().getFullYear() }} aruCraftR
                </p>
            </template>

            <template #right>
                <UButton icon="i-simple-icons-qq" color="neutral" variant="ghost" to="https://re.arucraftr.org"
                    target="_blank" aria-label="QQ" />
                <UButton icon="i-simple-icons-statuspage" color="neutral" variant="ghost"
                    to="https://status.arucraftr.org" target="_blank" aria-label="Status Page" />
            </template>
        </UFooter>
    </div>
</template>

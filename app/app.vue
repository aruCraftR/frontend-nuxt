<script setup lang="ts">
useHead({
  titleTemplate: 'aruCraftR - %s',
})
</script>

<template>
  <UApp :toaster='{ position: "top-center" }' class="max-h-screen">
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }} aruCraftR
        </p>
      </template>

      <template #right>
        <UButton icon="i-simple-icons-qq" color="neutral" variant="ghost" to="https://re.arucraftr.org" target="_blank"
          aria-label="QQ" />
      </template>
    </UFooter>
  </UApp>
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

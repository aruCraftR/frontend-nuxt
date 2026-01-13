<script setup lang="ts">
const route = useRoute()
const { isSidebarCollapsed, toggleSidebar } = useUi()
const { user, userLogout } = useAuth()

const links = [
    { label: '导航页', icon: 'i-heroicons-map-pin', to: '/' },
    { label: '在线状态', icon: 'i-heroicons-server', to: '/online' },
    { label: '聊天', icon: 'i-heroicons-chat-bubble-left-right', to: '/chat' },
    { label: '玩家设置', icon: 'i-heroicons-user-circle', to: '/player' },
]

useHead({
    meta: [{ property: 'og:title', content: `aruCraftR - ${route.meta.title}` }],
})

</script>

<template>
    <div
        class="relative flex w-full overflow-hidden text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-950 max-h-screen">
        <aside class="z-20 flex flex-col border-r border-gray-200 dark:border-gray-800 transition-all duration-500">
            <!-- Logo -->
            <UContainer
                class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 shrink-0 p-0">
                <span v-if="!isSidebarCollapsed" class="font-bold text-primary-500 truncate px-2 text-lg tracking-wide">
                    aruCraftR
                </span>
                <UIcon v-else name="i-heroicons-cube-transparent" class="w-8 h-8 text-primary-500" />
            </UContainer>

            <!-- 菜单 -->
            <UContainer class="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                <UButton v-for="link in links" :key="link.to" :to="link.to" :icon="link.icon"
                    :label="isSidebarCollapsed ? '' : link.label" variant="ghost" color="neutral"
                    class="w-full justify-start transition-all" :class="{ 'justify-center px-0': isSidebarCollapsed }"
                    active-class="bg-primary-50 dark:bg-primary-900/10 text-primary-500" />
            </UContainer>

            <!-- 底部工具 -->
            <UContainer class="p-2 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2 shrink-0">
                <ClientOnly>
                    <UButton :icon="$colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
                        color="neutral" variant="ghost" block
                        @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'">
                        <span v-if="!isSidebarCollapsed">{{ $colorMode.value === 'dark' ? '深色模式' : '浅色模式' }}</span>
                    </UButton>
                </ClientOnly>

                <UButton
                    :icon="isSidebarCollapsed ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'"
                    color="neutral" variant="ghost" block @click="toggleSidebar" />
            </UContainer>
        </aside>

        <!-- 主内容 -->
        <div class="flex-1">
            <UMain
                class="flex-1 flex flex-col h-full relative z-10 transition-colors duration-300 h-[calc(100vh-var(--ui-header-height))]">
                <header
                    class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
                    <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        {{ route.meta.title || 'Player Panel' }}
                    </h1>

                    <div class="flex items-center gap-4">
                        <UPopover mode="click" arrow>
                            <UAvatar
                                :src="`https://avatars.cloudhaven.gg/avatars/${user?.uuid || '853c80ef3c3749fdaa49938b674adae6'}`"
                                alt="Avatar" size="sm"
                                class="rounded-xs cursor-pointer ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900" />
                            <template #content>
                                <div class="p-2 w-48">
                                    <UUser class="ml-1" :name="user?.player_id" :description="user?.qq_id" :avatar="{
                                        src: `https://avatars.cloudhaven.gg/avatars/${user?.uuid || '853c80ef3c3749fdaa49938b674adae6'}`
                                    }" size="sm" />
                                    <USeparator class="mt-2 mb-1" />
                                    <UButton to="/player" variant="ghost" color="neutral" icon="i-heroicons-user" block
                                        class="justify-start mb-1">玩家设置</UButton>
                                    <!-- red -> error -->
                                    <UButton variant="ghost" color="error" icon="i-heroicons-arrow-right-on-rectangle"
                                        block class="justify-start" @click="userLogout">退出登录
                                    </UButton>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </header>

                <div class="flex-1 overflow-auto p-5 relative">
                    <slot />
                </div>
            </UMain>
            <UFooter>
                <template #left>
                    <p class="text-muted text-sm">
                        Copyright © {{ new Date().getFullYear() }} aruCraftR
                    </p>
                </template>

                <template #right>
                    <UButton icon="i-simple-icons-qq" color="neutral" variant="ghost" to="https://re.arucraftr.org"
                        target="_blank" aria-label="QQ" />
                    <UButton icon="i-simple-icons-telegram" color="neutral" variant="ghost"
                        to="https://t.me/+DWY82Dp-zAw4NDRl" target="_blank" aria-label="Telegram" />
                    <UButton icon="i-simple-icons-statuspage" color="neutral" variant="ghost"
                        to="https://status.arucraftr.org" target="_blank" aria-label="Status Page" />
                </template>
            </UFooter>
        </div>
    </div>
</template>
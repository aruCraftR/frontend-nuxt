<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { AsideLink } from '~/types/misc'

interface Props {
    item?: AsideLink
    collapsed: boolean
    icon?: string
    label?: string
    color?: string
    onClick?: () => void
}

const props = defineProps<Props>()
const route = useRoute()

const finalLabel = computed(() => props.label || props.item?.label || '')
const finalIcon = computed(() => props.icon || props.item?.icon || '')
const finalColor = computed(() => props.color || props.item?.color || 'neutral')
const finalTo = computed(() => props.item?.to)

const isActive = computed(() => finalTo.value ? route.path === finalTo.value : false)

const themeStyles = computed(() => {
    const color = finalColor.value

    const map: Record<string, any> = {
        primary: {
            activeBg: 'bg-primary-50 dark:bg-primary-950/20',
            activeText: 'text-primary-600 dark:text-primary-400',
            activeIcon: 'text-primary-500',
            inactiveIcon: 'text-primary-500/60 dark:text-primary-400/50',
            bar: 'bg-primary-500',
            hoverIcon: 'group-hover:text-primary-600 dark:group-hover:text-primary-400'
        },
        success: {
            activeBg: 'bg-green-50 dark:bg-green-950/20',
            activeText: 'text-green-600 dark:text-green-400',
            activeIcon: 'text-green-500',
            inactiveIcon: 'text-green-500/60 dark:text-green-400/50',
            bar: 'bg-green-500',
            hoverIcon: 'group-hover:text-green-600 dark:group-hover:text-green-400'
        },
        warning: {
            activeBg: 'bg-orange-50 dark:bg-orange-950/20',
            activeText: 'text-orange-600 dark:text-orange-400',
            activeIcon: 'text-orange-500',
            inactiveIcon: 'text-orange-500/60 dark:text-orange-400/50',
            bar: 'bg-orange-500',
            hoverIcon: 'group-hover:text-orange-600 dark:group-hover:text-orange-400'
        },
        secondary: {
            activeBg: 'bg-indigo-50 dark:bg-indigo-950/20',
            activeText: 'text-indigo-600 dark:text-indigo-400',
            activeIcon: 'text-indigo-500',
            inactiveIcon: 'text-indigo-500/60 dark:text-indigo-400/50',
            bar: 'bg-indigo-500',
            hoverIcon: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
        },
        neutral: {
            activeBg: 'bg-gray-100 dark:bg-gray-800',
            activeText: 'text-gray-900 dark:text-white',
            activeIcon: 'text-gray-900 dark:text-white',
            inactiveIcon: 'text-gray-400 dark:text-gray-500',
            bar: 'bg-gray-600',
            hoverIcon: 'group-hover:text-gray-900 dark:group-hover:text-white'
        }
    }

    return map[color] || map.primary
})
</script>

<template>
    <UTooltip :text="collapsed ? finalLabel : ''" :popper="{ placement: 'right', offsetDistance: 12 }">
        <UButton :to="finalTo"
            class="group relative flex items-center mb-1 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] border-0 ring-0 overflow-hidden w-full justify-start px-0"
            :class="[
                isActive ? themeStyles.activeBg : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            ]" variant="ghost" :active-class="''" block @click="onClick">

            <!-- 激活状态条 -->
            <div v-if="finalTo" class="absolute left-0 w-1 rounded-r-md transition-all duration-300 ease-out z-20"
                :class="[
                    themeStyles.bar,
                    isActive ? 'h-5 opacity-100' : 'h-0 opacity-0'
                ]" />

            <div class="relative flex items-center justify-center h-10 shrink-0 z-10 transition-[width] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                :class="collapsed ? 'w-full' : 'w-11'">

                <UIcon :name="finalIcon" class="w-5 h-5 transition-all duration-300 ease-out" :class="[
                    isActive
                        ? themeStyles.activeIcon
                        : `group-hover:scale-105 ${themeStyles.hoverIcon} ${themeStyles.inactiveIcon}`
                ]" />
            </div>

            <div class="flex items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                :class="[
                    !collapsed
                        ? 'max-w-40 opacity-100 translate-x-0'
                        : 'max-w-0 opacity-0 -translate-x-2'
                ]">
                <span class="text-[0.925rem] transition-colors duration-200" :class="[
                    isActive
                        ? `${themeStyles.activeText} font-semibold`
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                ]">
                    {{ finalLabel }}
                </span>
            </div>
        </UButton>
    </UTooltip>
</template>
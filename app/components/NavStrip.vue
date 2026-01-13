<script setup lang="ts">
/**
 * NavStrip Component
 * 一个用于导航页的条状链接组件，包含图标、标题、链接描述和悬浮提示。
 */
type ColorVariant = 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';

interface Props {
    title: string;
    to: string;
    displayLink?: string;
    tooltip?: string;
    icon?: string;
    color?: ColorVariant;
    target?: '_blank' | '_self';
}

const props = withDefaults(defineProps<Props>(), {
    displayLink: '',
    tooltip: '',
    icon: 'i-heroicons-link',
    color: 'primary',
    target: undefined
});

const isExternal = computed(() => {
    return props.to.startsWith('http') || props.to.startsWith('//');
});

const finalTarget = computed(() => {
    if (props.target) return props.target;
    return isExternal.value ? '_blank' : '_self';
});

const actionIcon = computed(() => {
    return finalTarget.value === '_blank'
        ? 'i-heroicons-arrow-top-right-on-square'
        : 'i-heroicons-forward';
});

const formattedLink = computed(() => {
    if (props.displayLink) return props.displayLink;
    try {
        const url = new URL(props.to);
        return url.hostname + (url.pathname !== '/' ? url.pathname : '');
    } catch {
        return props.to;
    }
});

const colorStyles: Record<ColorVariant, { iconBox: string, icon: string, hoverBorder: string, hoverBg: string }> = {
    neutral: {
        iconBox: 'bg-gray-100 dark:bg-gray-800',
        icon: 'text-gray-500 dark:text-gray-400',
        hoverBorder: 'group-hover:border-gray-300 dark:group-hover:border-gray-600',
        hoverBg: 'group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50'
    },
    primary: {
        iconBox: 'bg-primary-50 dark:bg-primary-950/30',
        icon: 'text-primary-500 dark:text-primary-400',
        hoverBorder: 'group-hover:border-primary-200 dark:group-hover:border-primary-800',
        hoverBg: 'group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10'
    },
    secondary: {
        iconBox: 'bg-secondary-50 dark:bg-secondary-950/30',
        icon: 'text-secondary-500 dark:text-secondary-400',
        hoverBorder: 'group-hover:border-secondary-200 dark:group-hover:border-secondary-800',
        hoverBg: 'group-hover:bg-secondary-50/50 dark:group-hover:bg-secondary-900/10'
    },
    success: {
        iconBox: 'bg-emerald-50 dark:bg-emerald-950/30',
        icon: 'text-emerald-500 dark:text-emerald-400',
        hoverBorder: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
        hoverBg: 'group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/10'
    },
    info: {
        iconBox: 'bg-sky-50 dark:bg-sky-950/30',
        icon: 'text-sky-500 dark:text-sky-400',
        hoverBorder: 'group-hover:border-sky-200 dark:group-hover:border-sky-800',
        hoverBg: 'group-hover:bg-sky-50/50 dark:group-hover:bg-sky-900/10'
    },
    warning: {
        iconBox: 'bg-amber-50 dark:bg-amber-950/30',
        icon: 'text-amber-500 dark:text-amber-400',
        hoverBorder: 'group-hover:border-amber-200 dark:group-hover:border-amber-800',
        hoverBg: 'group-hover:bg-amber-50/50 dark:group-hover:bg-amber-900/10'
    },
    error: {
        iconBox: 'bg-red-50 dark:bg-red-950/30',
        icon: 'text-red-500 dark:text-red-400',
        hoverBorder: 'group-hover:border-red-200 dark:group-hover:border-red-800',
        hoverBg: 'group-hover:bg-red-50/50 dark:group-hover:bg-red-900/10'
    }
};

const currentStyle = computed(() => colorStyles[props.color]);
</script>

<template>
    <UTooltip :text="tooltip || title" :popper="{ placement: 'top', arrow: true }" class="w-full">
        <NuxtLink :to="to" :target="finalTarget" class="
        group relative w-full flex items-center p-3 rounded-xl
        border border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-0.5
        overflow-hidden
        " :class="[currentStyle.hoverBorder, currentStyle.hoverBg]">
            <!-- 左侧：图标容器 -->
            <div class="
          flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg
          mr-4 transition-transform duration-300 group-hover:scale-110
        " :class="currentStyle.iconBox">
                <UIcon :name="icon" class="w-5 h-5 transition-colors duration-300" :class="currentStyle.icon" />
            </div>

            <!-- 中间 -->
            <div class="flex-1 min-w-0 flex flex-col justify-center">
                <!-- 标题 -->
                <h3
                    class="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight truncate pr-2">
                    {{ title }}
                </h3>
                <!-- 链接文本 -->
                <span
                    class="text-xs text-gray-400 dark:text-gray-500 font-mono truncate mt-0.5 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                    {{ formattedLink }}
                </span>
            </div>

            <!-- 右侧：动作图标 -->
            <div
                class="shrink-0 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                <UIcon :name="actionIcon" class="w-4 h-4" :class="currentStyle.icon" />
            </div>

            <!-- 背景 -->
            <div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style="background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%);" />
        </NuxtLink>
    </UTooltip>
</template>
import { defineStore } from 'pinia';

export const useUiStore = defineStore('app', () => {
    const sidebarCookie = useCookie<boolean>('sidebar_status', {
        default: () => false,
        maxAge: 60 * 60 * 24 * 365,
        watch: true, // 自动监听变化并更新 Cookie
    });

    const isSidebarCollapsed = computed({
        get: () => sidebarCookie.value,
        set: (val) => {
            sidebarCookie.value = val;
        },
    });

    function toggleSidebarCollapsed() {
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
    }

    return {
        isSidebarCollapsed,
        toggleSidebarCollapsed,
    };
});

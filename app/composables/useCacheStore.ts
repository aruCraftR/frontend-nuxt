import { defineStore } from 'pinia';

export const useCacheStore = defineStore(
    'appData',
    () => {
        const serverList = ref<ServerInfo[]>([]);
        const hiddenServers = ref<Set<string>>(new Set());
        const lastFetchServerListTs = ref(0);
        const isServerListLoaded = ref(false);
        const mcVersionList = ref<string[]>([]);
        const playerProfile = ref<PlayerProfile | undefined>(undefined);

        return {
            serverList,
            hiddenServers,
            lastFetchServerListTs,
            isServerListLoaded,
            mcVersionList,
            playerProfile,
        };
    },
    { persist: false },
);

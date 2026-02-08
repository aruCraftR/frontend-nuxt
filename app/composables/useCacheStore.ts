import { defineStore } from 'pinia';

export const useCacheStore = defineStore(
    'appData',
    () => {
        const serverList = ref<ServerInfo[]>([]);
        const hiddenServers = ref<Set<string>>(new Set());
        const lastFetchServerListTs = ref(0);
        const isServerListLoaded = ref(false);
        const mcReleaseList = ref<string[]>([]);
        const mcSnapshotList = ref<string[]>([]);
        const playerProfile = ref<PlayerProfile | undefined>(undefined);

        return {
            serverList,
            hiddenServers,
            lastFetchServerListTs,
            isServerListLoaded,
            mcReleaseList,
            mcSnapshotList,
            playerProfile,
        };
    },
    { persist: false },
);

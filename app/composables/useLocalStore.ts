import { defineStore, type StateTree } from 'pinia';

export const useLocalStore = defineStore(
    'local',
    () => {
        const cache = useCacheStore();
        const { usePanelApi } = useApi();

        const isSidebarCollapsed = ref(false);
        const serverProfiles = ref<Record<string, ServerProfile>>({});

        function toggleSidebarCollapsed() {
            isSidebarCollapsed.value = !isSidebarCollapsed.value;
        }

        async function checkServerProfiles(serverInfoList: ServerInfo[]) {
            const missingProfiles: string[] = [];
            for (const info of serverInfoList) {
                const profile = serverProfiles.value[info.id];
                if (profile) {
                    if (profile.edit_time >= info.profile_time) {
                        continue;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete serverProfiles.value[info.id];
                    }
                }
                if (info.id in cache.hiddenServers) continue;
                missingProfiles.push(info.id);
            }
            if (missingProfiles.length) {
                const response: ApiResponse<ServerProfile[]> =
                    await usePanelApi('get', '/servers', {
                        query: { ids: missingProfiles },
                    });
                if (response.data) {
                    for (const i of response.data)
                        serverProfiles.value[i.server_id] = i;
                }
            }
            const existServerInfo: ServerInfo[] = [];
            for (const i of serverInfoList) {
                if (i.id in serverProfiles.value) {
                    existServerInfo.push(i);
                } else {
                    cache.hiddenServers.add(i.id);
                }
            }
            return existServerInfo;
        }

        return {
            serverProfiles,
            toggleSidebarCollapsed,
            checkServerProfiles,
        };
    },
    {
        persist: {
            storage:
                typeof window !== 'undefined' ? window.localStorage : undefined,
        },
    },
);

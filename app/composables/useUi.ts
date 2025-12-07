import type { ServerInfo } from "~/types/api"

export const useUi = () => {
    const isSidebarCollapsed = useState<boolean>('ui_sidebar_collapsed', () => true)
    const servers = useState<ServerInfo[]>('ui_servers', () => [])
    const lastFetchServerListTimestamp = useState<number>('ui_last_fetch_server_list_timestamp', () => 0)

    /**
     * 切换侧边栏折叠状态
     */
    const toggleSidebar = () => {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
    }

    return {
        isSidebarCollapsed,
        servers,
        lastFetchServerListTimestamp,
        toggleSidebar
    }
}
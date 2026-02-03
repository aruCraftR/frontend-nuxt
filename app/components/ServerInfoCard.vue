<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import humanizeDuration from 'humanize-duration';

const props = defineProps<{
    serverInfo: ServerInfo;
}>();
const { usePanelApi } = useApi();
const { user } = useAuth();
const store = useLocalStore();
const { useServerProfileEditor } = useEditor();
const toast = useToast();
const statusColors: Map<string, Colors> = new Map([
    ['active', 'success'],
    ['starting', 'primary'],
    ['stopping', 'warning'],
    ['stopped', 'error'],
    ['unresponsive', 'warning'],
    ['unstarted', 'neutral'],
]);
const statusText: Map<string, string> = new Map([
    ['active', '运行中'],
    ['starting', '启动中'],
    ['stopping', '关闭中'],
    ['stopped', '已关闭'],
    ['unresponsive', '无响应'],
    ['unstarted', '未启动'],
]);
const serverProfile: Ref<ServerProfile | undefined> = ref();

watch(
    () => props.serverInfo,
    (info) => {
        serverProfile.value = store.serverProfiles[info.id];
    },
    { immediate: true },
);

const openServerEditor = async (server?: ServerProfile) => {
    await useServerProfileEditor(server);
};

// @ts-expect-error ts认不出来扩展运算符内的类型
const getCardMenuItems = (serverInfo: ServerInfo): ContextMenuItem[] =>
    [
        {
            label: '进入聊天',
            icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
            onSelect() {
                toast.add({ title: '聊天功能正在开发中', color: 'neutral' });
            },
        },
        ...(user.value && user.value.permission >= AccountPermission.ADMIN
            ? [
                  { type: 'separator' },
                  {
                      label: '管理员',
                      color: 'primary',
                      icon: 'i-heroicons-shield-check',
                      children: [
                          [
                              {
                                  label: '修改属性',
                                  color: 'warning',
                                  icon: 'i-lucide-pencil',
                                  onSelect() {
                                      useServerProfileEditor(
                                          store.serverProfiles[serverInfo.id],
                                      );
                                  },
                              },
                              {
                                  label: '删除',
                                  color: 'error',
                                  icon: 'i-lucide-trash',
                                  onSelect() {},
                              },
                          ],
                      ],
                  },
              ]
            : []),
    ].filter(Boolean);

type PlayHistoryTabelApiData = {
    items: ServerPlayHistory[];
    total: number;
};

const playHistoryTabelColumns: TableColumn<ServerPlayHistory>[] = [
    {
        accessorKey: 'mcId',
        header: '玩家名',
    },
    {
        accessorKey: 'lastOnlineDate',
        header: '最近上线时间',
        cell: ({ row }) => {
            return new Date(row.original.online_date).toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        },
    },
    {
        accessorKey: 'totalTime',
        header: '总在线时长',
        cell: ({ row }) => {
            return humanizeDuration(row.original.total_time * 1000, {
                units: ['h', 'm'],
                language: 'zh_CN',
                round: true,
                delimiter: ' ',
                spacer: '',
            });
        },
    },
];

const playHistoryEmptyText = ref('加载中');
const playHistoryData: Ref<ServerPlayHistory[]> = ref([]);
const loadingPlayHistory = ref(true);
const playHistoryPageSize = 8;
const totalPlayHistory = ref(0);

const fetchPlayHistory = async (page: number) => {
    loadingPlayHistory.value = true;
    playHistoryEmptyText.value = '加载中';
    try {
        const response: ApiResponse<PlayHistoryTabelApiData> =
            await usePanelApi(
                'get',
                `/servers/${serverProfile.value?.server_id}/plays`,
                {
                    query: {
                        page: page,
                        page_size: playHistoryPageSize,
                    },
                },
            );
        if (response.data !== null) {
            playHistoryData.value = response.data.items;
            totalPlayHistory.value = response.data.total;
        }
    } finally {
        loadingPlayHistory.value = false;
        playHistoryEmptyText.value = '没有记录呢';
    }
};
</script>

<template>
    <UContextMenu :items="getCardMenuItems(serverInfo)">
        <UCard class="hover:shadow-lg transition-shadow duration-300 p-0">
            <div class="p-4">
                <UPopover
                    arrow
                    mode="click"
                >
                    <div class="flex cursor-pointer flex-col">
                        <div class="flex flex-row">
                            <div class="flex flex-1 gap-2 mb-2">
                                <h3 class="text-lg font-bold">
                                    <span v-if="serverProfile?.zh_cn_name">{{
                                        serverProfile.zh_cn_name
                                    }}</span>
                                    <span
                                        v-else-if="serverProfile?.en_ww_name"
                                        >{{ serverProfile.en_ww_name }}</span
                                    >
                                    <span v-else>{{ serverInfo.id }}</span>
                                </h3>
                                <span
                                    v-if="serverProfile?.server_version"
                                    class="text-sm text-gray-500 self-end mb-0.5"
                                >
                                    v{{ serverProfile.server_version }}
                                </span>
                            </div>
                            <UBadge
                                class="h-min"
                                :color="
                                    statusColors.get(serverInfo.status) ||
                                    'neutral'
                                "
                                variant="solid"
                            >
                                {{
                                    statusText.get(serverInfo.status) ||
                                    '状态未知'
                                }}
                            </UBadge>
                        </div>
                        <div
                            class="flex justify-between items-center text-sm text-gray-500 mb-4 space-x-2"
                        >
                            <div class="flex items-center gap-1 flex-1">
                                <UIcon name="i-heroicons-users" />
                                <span
                                    >{{ serverInfo.player_count }} /
                                    {{ serverInfo.max_players }}</span
                                >
                                <div>
                                    <UAvatarGroup
                                        size="2xs"
                                        :max="3"
                                        class="ml-1"
                                    >
                                        <UAvatar
                                            v-for="player in serverInfo.players"
                                            :key="player.name"
                                            :alt="player?.name"
                                            :src="getAvatarSrc(player)"
                                        />
                                    </UAvatarGroup>
                                </div>
                            </div>
                            <span v-if="serverProfile?.mc_version"
                                >MC {{ serverProfile.mc_version }}</span
                            >
                        </div>
                    </div>
                    <template #content>
                        <div
                            v-if="serverInfo.players.length > 0"
                            class="p-3 grid grid-cols-2 gap-2"
                        >
                            <UUser
                                v-for="player in serverInfo.players"
                                :key="player.name"
                                :name="player?.name"
                                :avatar="{
                                    src: getAvatarSrc(player),
                                }"
                                alt="Avatar"
                                size="sm"
                            />
                            <!-- MC头像: `https://avatars.cloudhaven.gg/avatars/${player?.uuid || '853c80ef3c3749fdaa49938b674adae6'}` -->
                        </div>
                        <div
                            v-else
                            class="p-3"
                        >
                            没有玩家呢
                        </div>
                    </template>
                </UPopover>

                <UProgress
                    size="xs"
                    :color="statusColors.get(serverInfo.status) || 'neutral'"
                />

                <div class="mt-4 flex gap-2">
                    <UModal
                        description="按最近上线时间排序"
                        :ui="{ content: 'max-w-3xl' }"
                        :title="`${serverProfile?.zh_cn_name || serverProfile?.en_ww_name} 最近上线记录`"
                    >
                        <UButton
                            block
                            variant="soft"
                            >上线记录
                        </UButton>
                        <template #body>
                            <DatabaseTable
                                :empty="playHistoryEmptyText"
                                :loading="loadingPlayHistory"
                                :columns="playHistoryTabelColumns"
                                :data="playHistoryData"
                                :page-size="playHistoryPageSize"
                                :server-total="totalPlayHistory"
                                @change="fetchPlayHistory"
                            >
                                <template #mcId-cell="{ row }">
                                    <UUser
                                        :name="row.original.player.name"
                                        :avatar="{
                                            src: getAvatarSrc(
                                                row.original.player,
                                            ),
                                        }"
                                        size="md"
                                    />
                                </template>
                            </DatabaseTable>
                        </template>
                    </UModal>
                    <UButton
                        block
                        color="neutral"
                        disabled
                        variant="soft"
                        @click="
                            toast.add({
                                title: '聊天功能正在开发中',
                                color: 'neutral',
                            })
                        "
                    >
                        进入聊天</UButton
                    >
                </div>
            </div>
        </UCard>
    </UContextMenu>
</template>

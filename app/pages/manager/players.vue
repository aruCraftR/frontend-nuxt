<!-- pages/index.vue -->
<script setup lang="ts">
import type { DropdownMenuItem, SelectItem, TableColumn } from '@nuxt/ui';
import { AccountPermission } from '~/constances';
import type { ApiResponse } from '~/types/api';
import type { Colors } from "~/types/misc"

definePageMeta({
  title: '玩家数据管理',
  permission: AccountPermission.ADMIN,
})

const { usePanelApi } = useApi()
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const pageSize = 10

type PlayerTabelItem = {
  uuid: string
  permission: AccountPermission
  is_bound: boolean
  qq_id?: number
  mc_id: string
  last_online_date?: string
  last_online_server?: string
}


type PlayerTabelApiData = {
  items: PlayerTabelItem[]
  total: number
}


const permissionColor: Record<AccountPermission, Colors> = {
  0: 'neutral',
  1: 'primary',
  3: 'success',
  4: 'warning',
  5: 'error',
}

const permissionText: Record<AccountPermission, string> = {
  0: '普通',
  1: '信任',
  3: '协管员',
  4: '管理员',
  5: '拥有者',
}

const playerTabelColumns: TableColumn<PlayerTabelItem>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'uuid',
    header: 'UUID',
    cell: ({ row }) => `${(row.getValue('uuid') as string).slice(0, 13)}...`
  },
  {
    accessorKey: 'mc_id',
    header: 'MC ID',
  },
  {
    accessorKey: 'last_online_server',
    header: '最近游玩',
  },
  {
    accessorKey: 'permission',
    header: '权限',
  },
  {
    accessorKey: 'last_online_date',
    header: '最近上线时间',
    cell: ({ row }) => {
      const lastOnline = row.getValue('last_online_date') as string | undefined
      if (lastOnline) {
        return new Date(lastOnline).toLocaleString('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
    }
  },
  {
    accessorKey: 'is_bound',
    header: '绑定状态',
  },
  {
    accessorKey: 'qq_id',
    header: 'QQ',
  },
  {
    id: 'action'
  }
]

const tableData: Ref<PlayerTabelItem[]> = ref([])
const totalItems = ref(0)
const isLoading = ref(true)

const fetchData = async (page: number) => {
  isLoading.value = true
  try {
    const response: ApiResponse<PlayerTabelApiData> = await usePanelApi('get', '/manager/players', {
      'query': {
        'page': page,
        'page_size': pageSize
      }
    })
    if (response.data !== null) {
      tableData.value = response.data.items
      totalItems.value = response.data.total
    }
  } finally {
    isLoading.value = false
  }
}


function getDropdownActions(item: PlayerTabelItem): DropdownMenuItem[] {
  return [
    [
      {
        label: '占位',
        icon: 'i-lucide-copy',
      }
    ],
    [
      {
        label: '占位',
        icon: 'i-lucide-edit'
      },
      {
        label: '占位',
        icon: 'i-lucide-trash',
        color: 'error'
      }
    ]
  ]
}

const setPermissionValue: Ref<AccountPermission> = ref(AccountPermission.USER)
const setPermissionItems: Ref<SelectItem[]> = ref([
  {
    label: '普通',
    value: AccountPermission.USER
  },
  {
    label: '信任',
    value: AccountPermission.TRUSTED
  },
  {
    label: '协管员',
    value: AccountPermission.HELPER
  },
  {
    label: '管理员',
    value: AccountPermission.ADMIN
  },
  {
    label: '拥有者',
    value: AccountPermission.OWNER
  },
])

async function changePermission(item: PlayerTabelItem) {
  const permission = setPermissionValue.value
  if (permission === item.permission) return
  tableData.value = []
  setPermissionValue.value = AccountPermission.USER
  try {
    await usePanelApi('patch', `/player/${item.uuid}/permission`, {
      'body': {
        'permission': permission,
      }
    })
  } catch (e) {
    console.warn(e)
  }
  fetchData(1)
}


</script>

<template>
  <div class="flex justify-center">
    <DatabaseTable class="w-full h-full" :columns="playerTabelColumns" :data="tableData" :center-headers="true"
      :page-size="pageSize" :server-total="totalItems" :loading="isLoading" @change="fetchData">
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>
      <template #permission-cell="{ row }">
        <UPopover arrow>
          <UBadge class="capitalize cursor-pointer" variant='subtle' :color="permissionColor[row.original.permission]">
            {{ permissionText[row.original.permission] }}
          </UBadge>
          <template #content>
            <UForm class="p-5 flex" @submit="changePermission(row.original)">
              <UFormField label="更改为" orientation="horizontal" class="pr-2">
                <USelect v-model="setPermissionValue" :items="setPermissionItems" />
              </UFormField>
              <UButton label="确认" type="submit" :disabled="setPermissionValue === row.original.permission" />
            </UForm>
          </template>
        </UPopover>
      </template>
      <template #is_bound-cell="{ row }">
        <span :class="`font-semibold capitalize ${row.original.is_bound ? 'text-success' : 'text-error'}`">{{
          row.original.is_bound ?
            '已绑定' : '未绑定' }}</span>
      </template>
      <template #qq_id-cell="{ row }">
        <UUser v-if="row.original.qq_id" :name="String(row.original.qq_id)" :avatar="{
          src: `https://q1.qlogo.cn/g?b=qq&nk=${row.original.qq_id || 0}&s=40`
        }" alt="Avatar" size="sm" />
      </template>
      <template #action-cell="{ row }">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" aria-label="Actions" />
        </UDropdownMenu>
      </template>
    </DatabaseTable>
  </div>
</template>

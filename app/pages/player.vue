<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import * as z from 'zod'
import { AccountPermission } from '~/constances'
import type { ApiResponse, PlayerProfile } from '~/types/api'
definePageMeta({
    title: '玩家设置',
    permission: AccountPermission.USER,
})

const { user, userLogout } = useAuth()
const { usePanelApi } = useApi()
const toast = useToast()
const patching = ref(false)
const playerProfile: Ref<PlayerProfile | undefined> = ref(undefined)
const showOnlineSuffixPrev = ref(false)
const showOfflineSuffixPrev = ref(false)

const formSchema = z.object({
    password: z.string('请填写密码').min(8, '密码必须超过8位').optional(),
    online_qq_suffix: z.string().optional(),
    offline_qq_suffix: z.string().optional(),
    avatar_source: z.enum(['qq', 'mc_skin'])
})
type FormSchema = z.output<typeof formSchema>

const formState = reactive<Partial<FormSchema>>({
    password: undefined,
    online_qq_suffix: '',
    offline_qq_suffix: '',
    avatar_source: 'qq',
})

const avatarSourceItems = ref<SelectItem[]>([
    {
        label: 'MC皮肤',
        value: 'mc_skin'
    },
    {
        label: 'QQ头像',
        value: 'qq'
    },
])

const saveProfile = async () => {
    patching.value = true
    if (formState.password) {
        if (formState.password.length <= 8) {
            toast.add({ title: '密码必须超过8位', color: 'warning' })
            return
        }
        try {
            const response = await usePanelApi('post', '/players/me/password', { 'body': { 'password': formState.password } })
            if (response.code === 200) {
                toast.add({ title: '密码已更改', color: 'success' })
                formState.password = ''
            }
        } catch {
            toast.add({ description: '密码更改失败', color: 'error' })
        }
    }
    const updatedProfile: Record<string, string> = {}
    const oldProfile = playerProfile.value
    if (formState.online_qq_suffix !== undefined && formState.online_qq_suffix != oldProfile?.online_qq_suffix) {
        updatedProfile.online_qq_suffix = formState.online_qq_suffix
        if (oldProfile) oldProfile.online_qq_suffix = formState.online_qq_suffix
    }
    if (formState.offline_qq_suffix !== undefined && formState.offline_qq_suffix != oldProfile?.offline_qq_suffix) {
        updatedProfile.offline_qq_suffix = formState.offline_qq_suffix
        if (oldProfile) oldProfile.offline_qq_suffix = formState.offline_qq_suffix
    }
    if (formState.avatar_source !== undefined && formState.avatar_source != oldProfile?.avatar_source) {
        updatedProfile.avatar_source = formState.avatar_source
        if (oldProfile) oldProfile.avatar_source = formState.avatar_source
    }
    if (Object.keys(updatedProfile).length !== 0) {
        try {
            const response = await usePanelApi('patch', '/players/me/profile', { 'body': updatedProfile })
            if (response.code === 200) {
                toast.add({ title: '个人设置已更新', color: 'success' })
            }
        } catch {
            toast.add({ description: '个人设置更新失败', color: 'error' })
        }
    }
    patching.value = false
}

const loadProfile = async () => {
    playerProfile.value = undefined
    const response: ApiResponse<PlayerProfile> = await usePanelApi('get', '/players/me/profile')
    if (response.code === 200) {
        formState.avatar_source = response.data?.avatar_source
        formState.online_qq_suffix = response.data?.online_qq_suffix
        formState.offline_qq_suffix = response.data?.offline_qq_suffix
        playerProfile.value = response.data === null ? undefined : response.data
    }
}

onMounted(() => {
    loadProfile()
})

</script>

<template>
    <div class="max-w-2xl mx-auto space-y-6">
        <UCard>
            <template #header>
                <h2 class="text-lg font-semibold">个人资料</h2>
            </template>
            <div class="space-y-6">
                <UUser :name="user?.name" :description="user?.uuid" :avatar="{
                    src: `https://avatars.cloudhaven.gg/avatars/${user?.uuid || '853c80ef3c3749fdaa49938b674adae6'}`
                }" size="3xl" />

                <USkeleton v-if="playerProfile === undefined" class="h-32 flex items-center justify-center">
                    <UBadge size="xl" class="justify-center" variant="soft">加载中...</UBadge>
                </USkeleton>
                <UForm v-else :schema="formSchema" :state="formState" class="space-y-4" :disabled="patching">
                    <div class="flex space-x-6">
                        <UFormField label="头像来源偏好" name="avatar_source">
                            <USelect v-model="formState.avatar_source" :items="avatarSourceItems" />
                        </UFormField>
                    </div>
                    <div v-if="playerProfile.social_accounts.qq !== undefined && formState.online_qq_suffix !== undefined && formState.offline_qq_suffix !== undefined"
                        class="flex space-x-6">
                        <UFormField label="绑定QQ">
                            <UInput :model-value="playerProfile.social_accounts.qq" disabled />
                        </UFormField>
                        <UTooltip :delay-duration="0" :open="showOnlineSuffixPrev">
                            <UFormField label="在线QQ后缀" name="online_qq_suffix">
                                <UInput v-model="formState.online_qq_suffix" placeholder="| {s}在线"
                                    @pointerenter="showOnlineSuffixPrev = true"
                                    @pointerleave="showOnlineSuffixPrev = false" />
                            </UFormField>
                            <template #content>
                                {{ formState.online_qq_suffix === '' ? `${user?.name} | Minecraft在线` :
                                    `${user?.name} ${formState.online_qq_suffix?.replaceAll('{s}', 'Minecraft')}` }}
                            </template>
                        </UTooltip>
                        <UTooltip :delay-duration="0" :open="showOfflineSuffixPrev">
                            <UFormField label="离线QQ后缀" name="offline_qq_suffix">
                                <UInput v-model="formState.offline_qq_suffix" placeholder="| {s}离线"
                                    @pointerenter="showOfflineSuffixPrev = true"
                                    @pointerleave="showOfflineSuffixPrev = false" />
                            </UFormField>
                            <template #content>
                                {{ formState.offline_qq_suffix === '' ? `${user?.name} | Minecraft离线` :
                                    `${user?.name} ${formState.offline_qq_suffix?.replaceAll('{s}', 'Minecraft')}` }}
                            </template>
                        </UTooltip>
                    </div>
                    <div class="flex space-x-6">
                        <UFormField label="更改密码" name="password">
                            <UInput v-model="formState.password" placeholder="若不需要更改密码可留空" type="password" />
                        </UFormField>
                    </div>

                    <div class="flex justify-end">
                        <UButton :disabled="patching" @click="saveProfile">保存更改</UButton>
                    </div>
                </UForm>
            </div>
        </UCard>

        <UCard>
            <template #header>
                <h2 class="text-lg font-semibold text-red-500">会话操作</h2>
            </template>
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">退出登录</p>
                    <p class="text-sm text-gray-500">清除本地会话信息并返回登录页。</p>
                </div>
                <UButton color="error" variant="soft" @click="userLogout">退出登录</UButton>
            </div>
        </UCard>
    </div>
</template>
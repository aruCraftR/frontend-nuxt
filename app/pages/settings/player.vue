<script setup lang="ts">
import * as z from 'zod'
definePageMeta({ title: '玩家设置' })

const { user, userLogout } = useAuth()
const toast = useToast()
const loading = ref(false)

const formSchema = z.object({
    password: z.string('请填写密码').min(8, '密码必须超过8位').optional()
})
type FormSchema = z.output<typeof formSchema>

const formState = reactive<Partial<FormSchema>>({
    password: undefined,
})

const saveProfile = async () => {
    loading.value = true
    if (formState.password) {
        if (formState.password.length <= 8) {
            toast.add({ title: '密码必须超过8位', color: 'warning' })
            return
        }
        const response = await useApi('post', '/player/change_password', { 'password': formState.password })
        if (response.code === 200) {
            toast.add({ title: '密码已更改', color: 'success' })
            formState.password = ''
        }
    }
    loading.value = false
}
</script>

<template>
    <div class="max-w-2xl mx-auto space-y-6">
        <UCard>
            <template #header>
                <h2 class="text-lg font-semibold">个人资料</h2>
            </template>
            <div class="space-y-6">
                <UUser :name="user?.player_id" :description="user?.uuid" :avatar="{
                    src: `https://avatars.cloudhaven.gg/avatars/${user?.uuid || '853c80ef3c3749fdaa49938b674adae6'}`
                }" size="3xl" />

                <UForm :schema="formSchema" :state="formState" class="space-y-4">
                    <div class="flex space-x-6">
                        <UFormField label="绑定QQ">
                            <UInput :model-value="user?.qq_id" disabled />
                        </UFormField>
                        <UFormField label="更改密码">
                            <UInput v-model="formState.password" placeholder="若不需要更改密码可留空" type="password" />
                        </UFormField>
                    </div>

                    <div class="flex justify-end">
                        <UButton :disabled="loading" @click="saveProfile">保存更改</UButton>
                    </div>
                </UForm>
            </div>
        </UCard>

        <UCard>
            <template #header>
                <h2 class="text-lg font-semibold text-red-500">危险区域</h2>
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
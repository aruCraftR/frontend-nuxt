<!-- pages/index.vue -->
<script setup lang="ts">
import { AccountPermission } from '~/constances';

definePageMeta({
  title: '导航页',
  permission: AccountPermission.USER,
})
const { user } = useAuth()
</script>

<template>
  <div class="px-8 flex justify-center">
    <div class="w-full max-w-4xl">

      <div class="text-center pt-5 pb-10">
        <UIcon name="i-lucide-rocket" class="text-primary text-4xl" />
        <h1 class="text-4xl font-bold text-highlighted pt-5">aruCraftR 网页导航</h1>
      </div>

      <UPageGrid class="gap-5">

        <NavStrip title="官网" to="https://www.arucraftr.org" tooltip="查看官方组件库文档" icon="i-heroicons-home"
          color="primary" />

        <NavStrip title="在线列表" to="/online" tooltip="查看官方组件库文档" icon="i-heroicons-server-stack" color="success" />

        <NavStrip title="服务状态监控" to="https://status.arucraftr.org" tooltip="查看各服务在线状态" icon="i-heroicons-bug-ant"
          color="error" />

        <NavStrip title="GitHub组织" to="https://github.com/aruCraftR" tooltip="提建议 / 做贡献 ?" icon="i-simple-icons-github"
          color="neutral" />

        <NavStrip title="新包投票" to="https://new-server-vote.arucraftr.org" tooltip="为新包投票吧"
          icon="i-heroicons-check-circle" color="info" />

        <NavStrip title="整合包收集表" to="http://collect.arucraftr.org" tooltip="填写你想玩的整合包吧~"
          icon="i-heroicons-clipboard-document-list" color="warning" />

        <NavStrip v-if="user && user.permission >= AccountPermission.HELPER" title="MCSM面板"
          to="https://mcsm.arucraftr.org" tooltip="MCSM管理面板" icon="i-heroicons-command-line" color="success" />

        <NavStrip v-if="user && user.permission >= AccountPermission.HELPER" title="整合包收集结果"
          to="http://collect.arucraftr.org/results" tooltip="查看整合包收集结果表格" icon="i-heroicons-table-cells"
          color="warning" />

        <NavStrip v-if="user && user.permission >= AccountPermission.ADMIN" title="NapCat面板"
          to="https://napcat.arucraftr.org" tooltip="NapCat网页面板" icon="i-heroicons-chat-bubble-left-right"
          color="info" />

      </UPageGrid>
    </div>
  </div>
</template>
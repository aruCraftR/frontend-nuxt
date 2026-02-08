<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableColumn } from '@nuxt/ui';

const props = defineProps<{
    data?: T[];
    columns?: TableColumn<T>[];
    pageSize?: number;
    serverTotal?: number;
    loading?: boolean;
    siblingCount?: number;
    showEdges?: boolean;
}>();

const emit = defineEmits<{
    (e: 'change', page: number): void;
}>();

const currentPage = ref(1);
const jumpPageInput = ref('');
const perPage = computed(() => props.pageSize || 10);
const maxPage = computed(() => {
    const total = totalCount.value;
    const size = perPage.value;
    if (total <= 0) return 1;
    return Math.ceil(total / size);
});
const totalCount = computed(() => {
    if (props.serverTotal !== undefined) return props.serverTotal;
    return (props.data || []).length;
});

const displayColumns = computed(() => {
    if (!props.columns) return [];
    return props.columns;
});

const tablePagination = computed(() => {
    if (props.serverTotal !== undefined) return undefined;

    return {
        pageIndex: currentPage.value - 1,
        pageSize: perPage.value,
    };
});

const handleJump = () => {
    const pageNum = parseInt(jumpPageInput.value);
    if (Number.isNaN(pageNum)) {
        jumpPageInput.value = '';
        return;
    }
    let targetPage = pageNum;
    if (pageNum < 1) {
        targetPage = 1;
    } else if (pageNum > maxPage.value) {
        targetPage = maxPage.value;
    }
    currentPage.value = targetPage;
    jumpPageInput.value = '';
};

watch(
    currentPage,
    (newPage) => {
        emit('change', newPage);
    },
    { immediate: true },
);
</script>
<template>
    <div class="flex flex-col gap-4">
        <div class="border rounded-md dark:border-gray-700">
            <UTable
                :loading="props.loading"
                :data="props.data"
                :columns="displayColumns"
                :pagination="tablePagination"
                v-bind="$attrs"
            >
                <template
                    v-for="(_, name) in $slots"
                    #[name]="slotData"
                >
                    <slot
                        :name="name"
                        v-bind="slotData"
                    />
                </template>
            </UTable>
        </div>

        <!-- 修改底部布局 -->
        <div class="flex justify-end pt-2 items-center gap-4">
            <UPagination
                v-model:page="currentPage"
                :items-per-page="perPage"
                :total="totalCount"
                :sibling-count="props.siblingCount"
                :disabled="props.loading"
                :show-edges="props.showEdges"
                class="flex items-center gap-1"
            />

            <!-- 新增：跳转输入区域 -->
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">前往</span>
                <UInput
                    v-model="jumpPageInput"
                    type="number"
                    min="1"
                    :max="maxPage"
                    :disabled="props.loading"
                    placeholder="页码"
                    class="w-16"
                    size="sm"
                    @keydown.enter="handleJump"
                    @blur="handleJump"
                />
                <span class="text-sm text-gray-500">页</span>
            </div>
        </div>
    </div>
</template>

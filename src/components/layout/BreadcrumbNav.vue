<template>
  <a-breadcrumb :style="breadcrumbStyle" separator="/">
    <a-breadcrumb-item>
      <router-link to="/home">首页</router-link>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in items" :key="item.path">
      <router-link v-if="item.path && !item.isLast" :to="item.path">
        {{ item.label }}
      </router-link>
      <span v-else>{{ item.label }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
  label: string
  path?: string
  isLast?: boolean
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

const breadcrumbStyle = computed(() => ({
  marginLeft: '24px',
  color: '#666',
}))
</script>

<style scoped>
:deep(.arco-breadcrumb-item-link) {
  color: #666;
  text-decoration: none;
  transition: color 0.15s;
}

:deep(.arco-breadcrumb-item-link:hover) {
  color: var(--color-primary);
}

:deep(.arco-breadcrumb-separator) {
  color: var(--text-quaternary);
}
</style>
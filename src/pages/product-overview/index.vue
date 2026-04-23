<template>
  <div class="product-overview-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">产品全景</h1>
        <p class="page-desc">数字社区产品架构总览 · 6 大产品域</p>
      </div>
      <div class="header-actions">
        <a-button @click="handleRefresh">
          <template #icon><IconRefresh /></template>
          刷新
        </a-button>
      </div>
    </div>

    <a-spin v-if="loading" class="page-spinner" />
    <a-result
      v-else-if="error"
      status="error"
      :title="error"
      class="page-error"
    >
      <template #extra>
        <a-button type="primary" @click="fetchData">重试</a-button>
      </template>
    </a-result>
    <template v-else>
      <div class="overview-stats">
        <div class="stat-item">
          <span class="stat-value">{{ domains.length }}</span>
          <span class="stat-label">产品域</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ totalEpics }}</span>
          <span class="stat-label">应用</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ totalFeatures }}</span>
          <span class="stat-label">功能模块</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ totalFunctionPoints }}</span>
          <span class="stat-label">功能点</span>
        </div>
      </div>

      <div class="domain-grid">
        <div
          v-for="(domain, idx) in domains"
          :key="domain.code"
          class="domain-card"
          :style="{ animationDelay: `${idx * 0.08}s` }"
          @click="handleDomainClick(domain.code)"
        >
          <div class="domain-card-header">
            <div class="domain-info">
              <span class="domain-name">{{ domain.label }}</span>
              <a-tag :color="getStatusColor(domain.status)" size="small">{{ domain.status }}</a-tag>
            </div>
            <div class="domain-meta">
              <span class="domain-code">{{ domain.code }}</span>
              <span class="domain-priority" :class="'priority-' + domain.priority">{{ domain.priority }}</span>
            </div>
          </div>
          <p class="domain-desc">{{ domain.description || '暂无描述' }}</p>
          <div class="domain-stats">
            <span class="domain-stat">
              <IconApps /> {{ (domain.epics ?? []).length }} 应用
            </span>
            <span class="domain-stat">
              <IconUnorderedList /> {{ getFeatureCount(domain) }} 功能
            </span>
            <span class="domain-stat">
              <IconLink /> {{ getFPCount(domain) }} 功能点
            </span>
          </div>
          <div class="domain-epics">
            <div
              v-for="epic in (domain.epics ?? []).slice(0, 3)"
              :key="epic.uri"
              class="epic-item"
              @click.stop="handleEpicClick(domain.code, epic.uri)"
            >
              <span class="epic-label">{{ epic.label }}</span>
              <a-tag :color="getStatusColor(epic.status)" size="small">{{ epic.status }}</a-tag>
            </div>
            <div v-if="(domain.epics ?? []).length > 3" class="epic-more">
              +{{ (domain.epics ?? []).length - 3 }} 更多应用
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconRefresh, IconApps, IconUnorderedList, IconLink } from '@arco-design/web-vue/es/icon'
import type { DomainWithEpics } from '../../types/productOverview'
import { getProductOverview } from '../../api/productOverview'

const router = useRouter()
const domains = ref<DomainWithEpics[]>([])
const loading = ref(false)
const error = ref('')

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const res = await getProductOverview()
    domains.value = res.domains
  } catch (err: any) {
    error.value = err.message || '加载产品全景数据失败'
  } finally {
    loading.value = false
  }
}

function handleRefresh() {
  fetchData()
  Message.success('数据已刷新')
}

function handleDomainClick(domainCode: string) {
  router.push(`/home/product-overview/${domainCode}`)
}

function handleEpicClick(domainCode: string, epicUri: string) {
  router.push(`/home/product-overview/${domainCode}?epic=${encodeURIComponent(epicUri)}`)
}

function getFeatureCount(domain: DomainWithEpics): number {
  return (domain.epics ?? []).reduce((sum: number, e) => sum + (e.features?.length ?? 0), 0)
}

function getFPCount(domain: DomainWithEpics): number {
  return (domain.epics ?? []).reduce((sum: number, e) =>
    sum + ((e.features ?? []) as any[]).reduce((fs: number, f) => fs + ((f.functionPoints?.length ?? 0) as number), 0), 0)
}

const totalEpics = computed(() => domains.value.reduce((s: number, d: DomainWithEpics) => s + (d.epics?.length ?? 0), 0))
const totalFeatures = computed(() => domains.value.reduce((s: number, d: DomainWithEpics) => s + getFeatureCount(d), 0))
const totalFunctionPoints = computed(() => domains.value.reduce((s: number, d: DomainWithEpics) => s + getFPCount(d), 0))

function getStatusColor(status?: string): string {
  if (!status) return 'default'
  const colorMap: Record<string, string> = {
    '已上线': 'green',
    '测试中': 'orange',
    '迭代中': 'blue',
    '构想': 'gray',
    '规划中': 'gray',
    '已废弃': 'red',
    '建设中': 'cyan',
  }
  return colorMap[status] || 'default'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.product-overview-page {
  padding: 24px 28px;
  animation: pageIn 0.3s ease;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-1);
  margin: 0 0 4px 0;
}

.page-desc {
  font-size: 14px;
  color: var(--color-text-3);
  margin: 0;
}

.page-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.page-error {
  padding: 48px 0;
}

.overview-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-m);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary-6, #165dff);
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-3);
}

.domain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.domain-card {
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-l);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: cardIn 0.35s ease backwards;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.domain-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--app-shadow-2);
  border-color: var(--color-primary-3, rgba(22, 93, 255, 0.3));
}

.domain-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}

.domain-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.domain-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}

.domain-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.domain-code {
  font-size: 11px;
  color: var(--color-text-4);
  font-family: monospace;
}

.domain-priority {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.priority-P0 { background: var(--surface-bg-2); color: #ff4d4f; }
.priority-P1 { background: var(--surface-bg-2); color: #fa8c16; }
.priority-P2 { background: var(--surface-bg-2); color: #1890ff; }
.priority-P3 { background: var(--surface-bg-2); color: #52c41a; }

.domain-desc {
  font-size: 13px;
  color: var(--color-text-3);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.domain-stats {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--app-border-color);
  border-bottom: 1px solid var(--app-border-color);
  margin-bottom: 12px;
}

.domain-stat {
  font-size: 12px;
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.domain-epics {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.epic-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--app-surface-bg-2);
  cursor: pointer;
  transition: background 0.15s;
}

.epic-item:hover {
  background: var(--color-primary-1, rgba(22, 93, 255, 0.06));
}

.epic-label {
  font-size: 13px;
  color: var(--color-text-2);
}

.epic-more {
  font-size: 12px;
  color: var(--color-text-4);
  text-align: center;
  padding: 6px;
}
</style>

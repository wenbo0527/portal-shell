<template>
  <div class="domain-detail-page">
    <div class="breadcrumb-bar">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <a @click="handleBack">产品全景</a>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ pd?.label || domainCode }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div v-if="pd" class="domain-header-card">
      <div class="domain-header-info">
        <div class="domain-title-row">
          <h1 class="domain-title">{{ pd.label }}</h1>
          <a-tag :color="getStatusColor(pd.status)" size="medium">{{ pd.status }}</a-tag>
          <span class="domain-priority" :class="'priority-' + pd.priority">{{ pd.priority }}</span>
        </div>
        <p class="domain-desc">{{ pd.description || '暂无描述' }}</p>
        <div class="domain-meta">
          <span class="meta-item">编号: <code>{{ pd.code }}</code></span>
          <span class="meta-item">最后更新: {{ formatDate(pd.updatedAt) }}</span>
        </div>
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
        <a-space>
          <a-button type="primary" @click="fetchData">重试</a-button>
          <a-button @click="handleBack">返回</a-button>
        </a-space>
      </template>
    </a-result>
    <template v-else-if="domainData">
      <div class="detail-stats">
        <div class="stat-card">
          <span class="stat-value">{{ domainData.epics.length }}</span>
          <span class="stat-label">应用</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalFeatures }}</span>
          <span class="stat-label">功能模块</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalFunctionPoints }}</span>
          <span class="stat-label">功能点</span>
        </div>
      </div>

      <div class="epic-list">
        <div
          v-for="(epic, epicIdx) in domainData.epics"
          :key="epic.uri"
          class="epic-card"
          :id="'epic-' + epicIdx"
          :style="{ animationDelay: `${epicIdx * 0.1}s` }"
        >
          <div class="epic-card-header">
            <div class="epic-info">
              <h3 class="epic-title">{{ epic.label }}</h3>
              <a-tag :color="getStatusColor(epic.status)" size="small">{{ epic.status }}</a-tag>
              <span class="epic-priority" :class="'priority-' + epic.priority">{{ epic.priority }}</span>
            </div>
            <div class="epic-meta">
              <code class="epic-id">{{ epic.id }}</code>
            </div>
          </div>

          <div v-if="epic.problem || epic.coreGoal" class="epic-goals">
            <div v-if="epic.problem" class="goal-item">
              <span class="goal-label">要解决的问题</span>
              <span class="goal-text">{{ epic.problem }}</span>
            </div>
            <div v-if="epic.coreGoal" class="goal-item">
              <span class="goal-label">核心目标</span>
              <span class="goal-text">{{ epic.coreGoal }}</span>
            </div>
          </div>

          <div class="feature-section">
            <div class="section-header">
              <span class="section-title">功能模块</span>
              <span class="section-count">{{ (epic.features ?? []).length }} 个</span>
            </div>
            <div v-if="(epic.features ?? []).length === 0" class="empty-state">
              <span>暂无功能模块</span>
            </div>
            <div v-else class="feature-grid">
              <div
                v-for="feature in (epic.features ?? [])"
                :key="feature.uri"
                class="feature-card"
                :id="'feature-' + feature.id"
              >
                <div class="feature-header">
                  <span class="feature-name">{{ feature.label || feature.uri + ' (数据待完善)' }}</span>
                  <a-tag :color="getFeatureStatusColor(feature.status)" size="small">{{ feature.status }}</a-tag>
                </div>
                <p v-if="feature.description" class="feature-desc">{{ feature.description }}</p>
                <div class="feature-meta">
                  <span class="feature-id">{{ feature.id }}</span>
                  <span class="feature-priority" :class="'priority-' + feature.priority">{{ feature.priority }}</span>
                </div>

                <div class="function-points">
                  <div class="fp-header">
                    <span class="fp-label">功能点</span>
                    <span class="fp-count">{{ (feature.functionPoints ?? []).length }} 个</span>
                  </div>
                  <div v-if="(feature.functionPoints ?? []).length === 0" class="fp-empty">
                    <span>暂无功能点</span>
                  </div>
                  <div v-else class="fp-list">
                    <div
                      v-for="fp in (feature.functionPoints ?? [])"
                      :key="fp.uri"
                      class="fp-item"
                    >
                      <span class="fp-name">{{ fp.label || fp.uri + ' (数据待完善)' }}</span>
                      <a-tag :color="getFeatureStatusColor(fp.status)" size="small">{{ fp.status }}</a-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { DomainDetailData } from '../../../types/productOverview'
import { getDomainDetail } from '../../../api/productOverview'

const route = useRoute()
const router = useRouter()

const domainCode = computed(() => (route.params.domainCode as string) || '')
const domainData = ref<DomainDetailData | null>(null)
const loading = ref(false)
const error = ref('')

const pd = computed(() => domainData.value?.productDomain)

async function fetchData() {
  if (!domainCode.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await getDomainDetail(domainCode.value)
    domainData.value = res
  } catch (err: any) {
    error.value = err.message || '加载产品域详情失败'
  } finally {
    loading.value = false
  }
}

function handleBack() {
  router.push('/home/product-overview')
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('zh-CN')
  } catch {
    return dateStr
  }
}

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

function getFeatureStatusColor(status?: string): string {
  return getStatusColor(status)
}

const totalFeatures = computed(() =>
  domainData.value?.epics.reduce((s, e) => s + (e.features?.length ?? 0), 0) ?? 0
)

const totalFunctionPoints = computed(() =>
  domainData.value?.epics.reduce((s, e) =>
    s + ((e.features ?? []) as any[]).reduce((fs, f) => fs + ((f.functionPoints?.length ?? 0) as number), 0), 0) ?? 0
)

watch(domainCode, () => {
  fetchData()
  const epicParam = route.query.epic as string
  if (epicParam) {
    setTimeout(() => {
      const idx = domainData.value?.epics.findIndex(e => e.uri === epicParam)
      if (idx !== undefined && idx >= 0) {
        document.getElementById('epic-' + idx)?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 500)
  }
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.domain-detail-page {
  padding: 24px 28px;
  animation: pageIn 0.3s ease;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.breadcrumb-bar {
  margin-bottom: 20px;
}

.domain-header-card {
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-l);
  padding: 24px;
  margin-bottom: 20px;
}

.domain-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.domain-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-1);
  margin: 0;
}

.domain-priority {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.priority-P0 { background: #fff2e8; color: #ff4d4f; }
.priority-P1 { background: #fff7e6; color: #fa8c16; }
.priority-P2 { background: #e6f7ff; color: #1890ff; }
.priority-P3 { background: #f6ffed; color: #52c41a; }

.domain-desc {
  font-size: 14px;
  color: var(--color-text-3);
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.domain-meta {
  display: flex;
  gap: 20px;
}

.meta-item {
  font-size: 12px;
  color: var(--color-text-4);
}

.meta-item code {
  font-family: monospace;
  background: var(--app-surface-bg-2);
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 4px;
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

.detail-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
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

.epic-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.epic-card {
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-l);
  padding: 20px;
  animation: cardIn 0.35s ease backwards;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.epic-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--app-border-color);
}

.epic-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.epic-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
}

.epic-priority {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.epic-meta {
  flex-shrink: 0;
}

.epic-id {
  font-size: 11px;
  font-family: monospace;
  color: var(--color-text-4);
  background: var(--app-surface-bg-2);
  padding: 2px 8px;
  border-radius: 4px;
}

.epic-goals {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--app-surface-bg-2);
  border-radius: 8px;
}

.goal-item {
  display: flex;
  gap: 12px;
}

.goal-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-3);
  flex-shrink: 0;
  width: 80px;
}

.goal-text {
  font-size: 13px;
  color: var(--color-text-2);
  line-height: 1.5;
}

.feature-section {
  margin-top: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1);
}

.section-count {
  font-size: 12px;
  color: var(--color-text-4);
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: var(--color-text-4);
  font-size: 13px;
  background: var(--app-surface-bg-2);
  border-radius: 8px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.feature-card {
  border: 1px solid var(--app-border-color);
  border-radius: 8px;
  padding: 14px;
  transition: border-color 0.15s;
}

.feature-card:hover {
  border-color: var(--color-primary-3, rgba(22, 93, 255, 0.3));
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.feature-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feature-desc {
  font-size: 12px;
  color: var(--color-text-3);
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.feature-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.feature-id {
  font-size: 11px;
  font-family: monospace;
  color: var(--color-text-4);
}

.feature-priority {
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
}

.function-points {
  border-top: 1px dashed var(--app-border-color);
  padding-top: 10px;
}

.fp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.fp-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-3);
}

.fp-count {
  font-size: 11px;
  color: var(--color-text-4);
}

.fp-empty {
  font-size: 12px;
  color: var(--color-text-4);
  text-align: center;
  padding: 8px;
}

.fp-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fp-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: var(--app-surface-bg-2);
  border-radius: 4px;
}

.fp-name {
  font-size: 12px;
  color: var(--color-text-2);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

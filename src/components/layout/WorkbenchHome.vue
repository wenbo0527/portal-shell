<template>
  <div class="page-home">
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">下午好，管理员</h1>
        <p class="welcome-date">{{ currentDateStr }} · 星期{{ weekDayStr }}</p>
      </div>
      <div class="welcome-actions">
        <a-button type="primary" @click="handleQuickStart">快速开始</a-button>
      </div>
    </div>

    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="12" :sm="6" v-for="stat in overviewStats" :key="stat.label">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: stat.bgColor }">
            {{ (stat.label || '').slice(0, 1) }}
          </div>
          <div class="stat-body">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="[20, 20]" class="main-content-row">
      <a-col :xs="24" :lg="14">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">最近访问</span>
            <a-button type="text" size="small" @click="clearRecent">清空</a-button>
          </div>
          <div class="recent-list">
            <div
              v-for="(item, idx) in recentVisits"
              :key="item.key"
              class="recent-item"
              :style="{ animationDelay: `${idx * 0.05}s` }"
              @click="handleRecentClick(item.key)"
            >
              <div class="recent-icon" :style="{ background: item.gradient }">
                {{ (item.shortName || item.name || '').slice(0, 1) }}
              </div>
              <div class="recent-body">
                <span class="recent-name">{{ item.name }}</span>
                <span class="recent-domain">{{ item.domainName }} · {{ item.epicName }}</span>
              </div>
              <span class="recent-time">{{ item.time }}</span>
            </div>
            <a-empty v-if="recentVisits.length === 0" description="暂无最近访问" />
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :lg="10">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">快捷入口</span>
          </div>
          <div class="quick-grid">
            <div
              v-for="(item, idx) in quickNavItems"
              :key="item.key"
              class="quick-item"
              :style="{ animationDelay: `${idx * 0.05}s` }"
              @click="handleQuickNavClick(item.key)"
            >
              <div class="quick-icon" :style="{ background: item.gradient }">
                {{ (item.shortName || item.name || '').slice(0, 1) }}
              </div>
              <span class="quick-name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <ArchitectureMap
          :domains="productOverviewDomains"
          :loading="poLoading"
          :error="poError"
          :show-layers="['application']"
          @select="handleArchitectureSelect"
          @retry="fetchProductOverviewData"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { DomainItem } from '../../config/domainDictionary'
import type { DomainWithEpics } from '../../types/productOverview'
import { getArchitectureMapData } from '../../api/productOverview'
import ArchitectureMap from './ArchitectureMap.vue'

const props = defineProps<{
  recentVisits: any[]
  quickNavItems: any[]
  productDomains: DomainItem[]
  overviewStats: any[]
}>()

const emit = defineEmits<{
  (e: 'clearRecent'): void
  (e: 'navigate', key: string): void
  (e: 'switchDomain', key: string): void
  (e: 'quickStart'): void
  (e: 'goProductOverview', payload: { type: string; id: string; label: string; domainCode: string; uri?: string }): void
}>()

const productOverviewDomains = ref<DomainWithEpics[]>([])
const poLoading = ref(false)
const poError = ref('')

async function fetchProductOverviewData() {
  poLoading.value = true
  poError.value = ''
  console.log('[WorkbenchHome] fetchProductOverviewData called')
  try {
    const data = await getArchitectureMapData()
    console.log('[WorkbenchHome] got data:', data.map(d => ({ code: d.code, label: d.label, epicCount: d.epics.length })))
    productOverviewDomains.value = data
  } catch (err: any) {
    console.error('[WorkbenchHome] API error:', err)
    poError.value = err.message || '加载产品全景数据失败'
  } finally {
    poLoading.value = false
  }
}

function handleArchitectureSelect(payload: { type: string; id: string; label: string; domainCode: string; uri?: string }) {
  if (!payload.domainCode) {
    console.warn('[WorkbenchHome] handleArchitectureSelect: no domainCode', payload)
  }
  emit('goProductOverview', payload)
}

const currentDateStr = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

const weekDayStr = computed(() => {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return days[new Date().getDay()]
})

function clearRecent() {
  emit('clearRecent')
  Message.success('已清空最近访问')
}

function handleRecentClick(key: string) {
  emit('navigate', key)
}

function handleQuickNavClick(key: string) {
  emit('navigate', key)
}

function handleQuickStart() {
  emit('quickStart')
}

onMounted(() => {
  fetchProductOverviewData()
})
</script>

<style scoped>
.page-home {
  padding: var(--app-space-6) var(--app-space-8);
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-space-4);
  margin-bottom: var(--app-space-6);
  padding: var(--app-space-6);
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-l);
  box-shadow: var(--app-shadow-1);
}

.welcome-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 var(--app-space-1) 0;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
}

.welcome-date {
  font-size: 14px;
  margin: 0;
  color: var(--color-text-3, rgba(0, 0, 0, 0.6));
}

.stats-row { margin-bottom: var(--app-space-6); }

.stat-card {
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-m);
  padding: var(--app-space-4);
  display: flex;
  align-items: center;
  gap: var(--app-space-4);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}

.stat-card:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: var(--app-shadow-1);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--app-radius-m);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.2px;
  flex-shrink: 0;
}

.stat-body { display: flex; flex-direction: column; }

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.stat-label { font-size: 12px; color: var(--color-text-3, rgba(0, 0, 0, 0.6)); margin-top: 2px; }

.panel {
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-l);
  padding: var(--app-space-6);
  box-shadow: var(--app-shadow-1);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--app-space-4);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
  display: flex;
  align-items: center;
  gap: 6px;
}

.recent-list { display: flex; flex-direction: column; gap: 4px; }

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--app-radius-m);
  cursor: pointer;
  transition: background-color 0.15s ease;
  animation: itemIn 0.24s ease backwards;
}

@keyframes itemIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.recent-item:hover { background: var(--app-surface-bg-2); }

.recent-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--app-radius-m);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
  flex-shrink: 0;
}

.recent-body { flex: 1; overflow: hidden; }

.recent-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-domain { font-size: 12px; color: var(--color-text-3, rgba(0, 0, 0, 0.6)); display: block; }

.recent-time { font-size: 12px; color: var(--color-text-4, rgba(0, 0, 0, 0.45)); white-space: nowrap; flex-shrink: 0; }

.quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--app-space-3); }

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: var(--app-space-4) var(--app-space-2);
  border-radius: var(--app-radius-m);
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
  border: 1px solid transparent;
  animation: itemIn 0.24s ease backwards;
}

.quick-item:hover {
  background: var(--app-surface-bg-2);
  border-color: var(--color-primary-2, rgba(22, 93, 255, 0.18));
  transform: translateY(-1px);
}

.quick-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--app-radius-m);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.quick-name {
  font-size: 12px;
  color: var(--color-text-2, rgba(0, 0, 0, 0.72));
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

@media (max-width: 768px) {
  .page-home { padding: var(--app-space-4); }
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: var(--app-space-6);
  }
}
</style>

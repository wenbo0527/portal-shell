<template>
  <div class="page-domain-home">
    <div class="domain-header-card">
      <div class="domain-header-icon" :style="{ background: domainGradient }">
        {{ currentDomain?.icon }}
      </div>
      <div class="domain-header-info">
        <h1 class="domain-header-title">{{ currentDomain?.name }}</h1>
        <p class="domain-header-desc">{{ currentDomain?.desc }}</p>
      </div>
      <div class="domain-header-actions">
        <a-button @click="handleRefresh">
          <template #icon><IconRefresh /></template>
          刷新
        </a-button>
      </div>
    </div>

    <div class="epic-list">
      <div
        v-for="(epic, epicIdx) in currentDomainEpics"
        :key="epic.key"
        class="epic-card"
        :style="{ animationDelay: `${epicIdx * 0.1}s` }"
      >
        <div class="epic-card-header">
          <div class="epic-card-left">
            <span class="epic-card-icon">{{ epic.icon || '📂' }}</span>
            <div class="epic-card-info">
              <h3 class="epic-card-name">{{ epic.displayName }}</h3>
              <span class="epic-card-key">{{ epic.key }}</span>
            </div>
          </div>
          <a-tag :color="epicColor(epic.key)" size="small">
            {{ epic.features.length }} 个功能
          </a-tag>
        </div>
        <div class="epic-features">
          <div
            v-for="feature in epic.features"
            :key="feature.key"
            class="feature-card"
            @click="handleFeatureClick(feature.key)"
          >
            <div class="feature-card-icon">{{ feature.icon }}</div>
            <div class="feature-card-body">
              <span class="feature-card-name">{{ feature.name }}</span>
              <span class="feature-card-desc">{{ feature.desc }}</span>
            </div>
            <div class="feature-card-arrow"><IconCaretRight /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCaretRight, IconRefresh } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import type { DomainItem, EpicItem } from '../../config/domainDictionary'

const props = defineProps<{
  currentDomain: DomainItem | undefined
  currentDomainEpics: EpicItem[]
}>()

const emit = defineEmits<{
  (e: 'navigate', key: string): void
  (e: 'refresh'): void
}>()

const domainGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

const EPIC_COLORS: Record<string, string> = {
  'EPIC-RISK-EXT': 'blue', 'EPIC-RISK-MODEL': 'purple',
  'EPIC-MKT-BENEFIT': 'orange', 'EPIC-MKT-CROWD': 'green', 'EPIC-MKT-CANVAS': 'cyan',
  'EPIC-MKT-REACH': 'magenta', 'EPIC-MKT-CALL': 'red',
  'EPIC-DEX-C360': 'blue', 'EPIC-DEX-METRIC': 'green', 'EPIC-DEX-ANALYSIS': 'purple',
  'EPIC-DMT-META': 'blue', 'EPIC-DMT-SVC': 'green', 'EPIC-DMT-STD': 'orange', 'EPIC-DMT-CONCEPT': 'cyan',
  'EPIC-ADMIN-PERM': 'blue', 'EPIC-ADMIN-NOTICE': 'green', 'EPIC-ADMIN-PORTAL': 'orange', 'EPIC-ADMIN-CONTENT': 'purple',
}

function epicColor(key: string) {
  return EPIC_COLORS[key] || 'arcoblue'
}

function handleFeatureClick(key: string) {
  emit('navigate', key)
}

function handleRefresh() {
  emit('refresh')
  Message.success('数据已刷新')
}
</script>

<style scoped>
.page-domain-home {
  padding: var(--space-6);
  animation: pageIn 0.3s ease;
}

@keyframes pageIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.domain-header-card {
  background: var(--surface-bg);
  border-radius: 12px;
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.domain-header-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}
.domain-header-info { flex: 1; }
.domain-header-title { font-size: 22px; font-weight: 700; color: var(--text-primary); margin: 0 0 6px 0; }
.domain-header-desc { font-size: 13px; color: var(--text-secondary); margin: 0; }
.domain-header-actions { flex-shrink: 0; }

.epic-list { display: flex; flex-direction: column; gap: 16px; }
.epic-card {
  background: var(--surface-bg);
  border-radius: 12px;
  padding: var(--space-4) var(--space-6);
  animation: cardIn 0.35s ease backwards;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.epic-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--border-light);
}
.epic-card-left { display: flex; align-items: center; gap: 10px; }
.epic-card-icon { font-size: 22px; }
.epic-card-info { display: flex; flex-direction: column; }
.epic-card-name { font-size: 15px; font-weight: 600; color: var(--text-primary); margin: 0 0 2px 0; }
.epic-card-key { font-size: 11px; color: var(--text-tertiary); }
.epic-features { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
.feature-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.15s;
}
.feature-card:hover {
  border-color: #165dff;
  background: rgba(22,93,255,0.02);
  transform: translateX(3px);
}
.feature-card-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  background: var(--surface-bg-2);
}
.feature-card-body { flex: 1; overflow: hidden; }
.feature-card-name { font-size: 14px; font-weight: 500; color: var(--text-primary); display: block; margin-bottom: 2px; }
.feature-card-desc { font-size: 12px; color: var(--text-tertiary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.feature-card-arrow { color: var(--text-quaternary); transition: all 0.15s; flex-shrink: 0; }
.feature-card:hover .feature-card-arrow { color: #165dff; transform: translateX(3px); }

@media (max-width: 768px) {
  .page-domain-home { padding: var(--space-4); }
  .domain-header-card { flex-direction: column; text-align: center; }
  .domain-header-actions { width: 100%; }
  .domain-header-actions .arco-btn { width: 100%; }
}
</style>
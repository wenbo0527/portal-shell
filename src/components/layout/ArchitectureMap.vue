<template>
  <div class="architecture-map">
    <a-spin v-if="loading" class="map-spinner" />
    <a-result
      v-else-if="error"
      status="error"
      :title="error"
      class="map-error"
    >
      <template #extra>
        <a-button type="primary" size="small" @click="$emit('retry')">重试</a-button>
      </template>
    </a-result>
    <template v-else>
      <div
        v-for="layer in layers.filter(l => showLayers.includes(l.type))"
        :key="layer.type"
        class="layer"
        :class="'layer-' + layer.type"
      >
        <div class="layer-header">
          <div class="layer-title">
            <span class="layer-icon">{{ layer.icon }}</span>
            <span class="layer-name">{{ layer.name }}</span>
            <span class="layer-sub">{{ layer.sub }}</span>
          </div>
        </div>
        <div class="layer-content">
          <template v-for="domain in displayDomains" :key="domain.code + '-' + layer.type">
            <div class="domain-group">
              <div class="domain-group-header">
                <span class="domain-group-name">{{ domain.label }}</span>
              </div>
              <div class="domain-group-items">
                <template v-if="layer.type === 'application'">
                  <div
                    v-for="item in getTopItems(domain.epics, 'epic', maxItemsPerGroup)"
                    :key="item.uri"
                    class="domain-card domain-card--clickable"
                    :class="{ 'domain-card--empty': !item.label }"
                    @click="handleNodeClick('epic', item)"
                  >
                    <div class="domain-card__name">{{ item.label || item.uri + ' (数据待完善)' }}</div>
                  </div>
                  <div
                    v-if="getTotalCount(domain.epics, 'epic') > maxItemsPerGroup"
                    class="domain-card domain-card--more"
                    @click="handleNodeClick('productDomain', { code: domain.code, label: domain.label, uri: domain.uri })"
                  >
                    <span class="more-text">+{{ getTotalCount(domain.epics, 'epic') - maxItemsPerGroup }} 更多</span>
                  </div>
                </template>
                <template v-else-if="layer.type === 'platform'">
                  <div
                    v-for="item in getTopItems(domain.epics, 'feature', maxItemsPerGroup)"
                    :key="item.uri"
                    class="domain-card domain-card--clickable"
                    :class="{ 'domain-card--empty': !item.label }"
                    @click="handleNodeClick('feature', item)"
                  >
                    <div class="domain-card__name">{{ item.label || item.uri + ' (数据待完善)' }}</div>
                  </div>
                  <div
                    v-if="getTotalFeatureCount(domain) > maxItemsPerGroup"
                    class="domain-card domain-card--more"
                    @click="handleNodeClick('productDomain', { code: domain.code, label: domain.label, uri: domain.uri })"
                  >
                    <span class="more-text">+{{ getTotalFeatureCount(domain) - maxItemsPerGroup }} 更多</span>
                  </div>
                  <div
                    v-if="getTotalFeatureCount(domain) === 0"
                    class="domain-card domain-card--empty-state"
                  >
                    <span class="empty-text">暂无功能</span>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="item in getTopItems(domain.epics, 'functionPoint', maxItemsPerGroup)"
                    :key="item.uri"
                    class="domain-card domain-card--readonly"
                    :class="{ 'domain-card--empty': !item.label }"
                  >
                    <div class="domain-card__name">{{ item.label || item.uri + ' (数据待完善)' }}</div>
                  </div>
                  <div
                    v-if="getTotalFPCount(domain) > maxItemsPerGroup"
                    class="domain-card domain-card--readonly"
                  >
                    <span class="more-text">+{{ getTotalFPCount(domain) - maxItemsPerGroup }} 更多</span>
                  </div>
                  <div
                    v-if="getTotalFPCount(domain) === 0"
                    class="domain-card domain-card--empty-state"
                  >
                    <span class="empty-text">暂无功能点</span>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DomainWithEpics, ArchitectureNodeType } from '../../types/productOverview'

const props = withDefaults(defineProps<{
  domains: DomainWithEpics[]
  loading?: boolean
  error?: string
  maxItemsPerGroup?: number
  showLayers?: ('application' | 'platform' | 'display')[]
}>(), {
  loading: false,
  error: '',
  maxItemsPerGroup: 3,
  showLayers: () => ['application', 'platform', 'display'],
})

const emit = defineEmits<{
  (e: 'select', payload: {
    type: ArchitectureNodeType
    id: string
    label: string
    domainCode: string
    uri?: string
  }): void
  (e: 'retry'): void
}>()

const displayDomains = computed(() => {
  const result = (props.domains ?? []).slice(0, 6)
  console.log('[ArchitectureMap] displayDomains:', result.map(d => ({ code: d.code, label: d.label, epicCount: d.epics.length })))
  return result
})

const layers = [
  { type: 'application', name: '应用层', sub: 'Epic', icon: '🔵' },
  { type: 'platform', name: '数据中台层', sub: 'Feature', icon: '🟢' },
  { type: 'display', name: '数据资源层', sub: 'FunctionPoint', icon: '⚪' },
] as const

interface FlatItem {
  uri: string
  label: string
  id?: string
  status?: string
}

function getTopItems(epics: DomainWithEpics['epics'], type: 'epic' | 'feature' | 'functionPoint', limit: number): FlatItem[] {
  const items: FlatItem[] = []
  if (!epics) return items.slice(0, limit)
  for (const epic of epics) {
    if (type === 'epic') {
      items.push({ uri: epic.uri, label: epic.label, id: epic.id, status: epic.status })
    } else if (type === 'feature') {
      if (!epic.features) continue
      for (const f of epic.features) {
        items.push({ uri: f.uri, label: f.label, id: f.id, status: f.status })
      }
    } else {
      if (!epic.features) continue
      for (const f of epic.features) {
        if (!f.functionPoints) continue
        for (const fp of f.functionPoints) {
          items.push({ uri: fp.uri, label: fp.label, id: fp.id, status: fp.status })
        }
      }
      return items.slice(0, limit)
    }
  }
  return items.slice(0, limit)
}

function getTotalCount(epics: DomainWithEpics['epics'], type: 'epic'): number {
  if (type === 'epic') return (epics?.length ?? 0)
  return 0
}

function getTotalFeatureCount(domain: DomainWithEpics): number {
  return (domain.epics ?? []).reduce((sum, e) => sum + (e.features?.length ?? 0), 0)
}

function getTotalFPCount(domain: DomainWithEpics): number {
  return (domain.epics ?? []).reduce((sum, e) =>
    sum + ((e.features ?? []) as any[]).reduce((fs, f) => fs + ((f.functionPoints?.length ?? 0) as number), 0), 0)
}


function handleNodeClick(type: ArchitectureNodeType, item: { code?: string; label: string; uri: string }) {
  const domain = displayDomains.value.find(d =>
    d.code === item.code ||
    d.epics.some(e => e.uri === item.uri ||
      ((e.features ?? []) as any[]).some(f => f.uri === item.uri ||
        ((f.functionPoints ?? []) as any[]).some(fp => fp.uri === item.uri)
      )
    )
  )
  emit('select', {
    type,
    id: item.code || item.uri,
    label: item.label,
    domainCode: domain?.code || '',
    uri: item.uri,
  })
}
</script>

<style scoped>
.architecture-map {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  width: 100%;
}

.map-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 24px;
}

.map-error {
  padding: 24px 0;
  max-width: 100%;
}

.map-error :deep(.arco-result) {
  max-width: 100%;
}

/* Layer Header */
.layer-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-m);
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.layer-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.layer-application .layer-header::before {
  background: linear-gradient(180deg, #165dff 0%, #4080ff 100%);
}

.layer-platform .layer-header::before {
  background: linear-gradient(180deg, #14c9c9 0%, #50d4d4 100%);
}

.layer-display .layer-header::before {
  background: linear-gradient(180deg, #86909c 0%, var(--text-quaternary) 100%);
}

.layer-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 8px;
  width: 100%;
}

.layer-icon {
  font-size: 16px;
  line-height: 1;
}

.layer-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
  letter-spacing: 0.5px;
}

.layer-sub {
  font-size: 12px;
  color: var(--color-text-3, rgba(0, 0, 0, 0.6));
  background: var(--app-surface-bg-2);
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: auto;
}

/* Layer Content */
.layer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  padding: 0 4px;
  min-width: 0;
}

/* Domain Group */
.domain-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.domain-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--app-surface-bg-2);
  border-radius: var(--app-radius-s);
  border: 1px solid var(--app-border-color);
}

.domain-group-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.domain-group-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Domain Card */
.domain-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: var(--app-radius-m);
  border: 1px solid var(--app-border-color);
  background: var(--app-surface-bg);
  transition: all 0.2s ease;
  min-height: 40px;
  position: relative;
}

.domain-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 2px 0 0 2px;
  background: transparent;
  transition: background 0.2s ease;
}

.layer-application .domain-card--clickable::before {
  background: #165dff;
}

.layer-platform .domain-card--clickable::before {
  background: #14c9c9;
}

.layer-display .domain-card::before {
  background: #86909c;
}

.domain-card--clickable {
  cursor: pointer;
}

.domain-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-2);
  border-color: var(--color-primary-3, rgba(22, 93, 255, 0.3));
}

.domain-card--readonly {
  cursor: default;
  opacity: 0.75;
  background: var(--app-surface-bg-2);
}

.domain-card--empty-state {
  opacity: 0.5;
  background: var(--app-surface-bg-2);
}

.domain-card--more {
  border-style: dashed;
  cursor: pointer;
  background: var(--app-surface-bg-2);
  opacity: 0.8;
}

.domain-card--more:hover {
  opacity: 1;
  border-color: var(--color-primary-3, rgba(22, 93, 255, 0.3));
}

.domain-card--empty .domain-card__name {
  color: var(--color-text-4, rgba(0, 0, 0, 0.45));
  font-size: 11px;
}

.domain-card__name {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-1, rgba(0, 0, 0, 0.88));
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding-left: 6px;
}

.more-text {
  font-size: 11px;
  color: var(--color-text-3, rgba(0, 0, 0, 0.6));
  font-weight: 500;
}

.empty-text {
  font-size: 11px;
  color: var(--color-text-4, rgba(0, 0, 0, 0.45));
}

/* Layer Separator */
.layer + .layer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed var(--app-border-color);
}

/* Responsive */
@media (max-width: 1200px) {
  .layer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .layer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .domain-card {
    padding: 8px 10px;
    min-height: 38px;
  }

  .domain-card__name {
    font-size: 11px;
  }

  .layer-header {
    padding: 10px 14px;
  }

  .layer-name {
    font-size: 13px;
  }
}
</style>

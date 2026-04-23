<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :width="260"
    :collapsedWidth="48"
    :trigger="null"
    breakpoint="xl"
    collapsible
    show-collapse-button
    class="layout-sider"
  >
    <div class="sider-header">
      <transition name="fade" mode="out-in">
        <div v-if="!collapsed" class="sider-domain-info" :key="activeDomainKey">
          <span class="sider-domain-icon">{{ currentDomain?.icon }}</span>
          <span class="sider-domain-name">{{ currentDomain?.name }}</span>
        </div>
        <span v-else class="sider-domain-icon-collapsed">{{ currentDomain?.icon }}</span>
      </transition>
    </div>

    <!-- 搜索框 -->
    <div class="sider-search" v-if="!collapsed">
      <a-input-search
        v-model="searchQuery"
        placeholder="搜索功能..."
        allow-clear
        :size="'small'"
        class="search-input"
        @search="onSearch"
      />
    </div>

    <div class="quick-fav-section" v-if="showQuickFav && !collapsed">
      <div class="qf-label">
        <IconStar /> 快捷访问
      </div>
      <div class="qf-items">
        <div
          v-for="fav in filteredFavorites"
          :key="fav.key"
          class="qf-item"
          :class="{ active: activeSideKey[0] === fav.key }"
          @click="handleQuickFavClick(fav.key)"
          :title="fav.name"
        >
          <span class="qf-icon">{{ fav.icon }}</span>
          <span class="qf-name">{{ fav.name }}</span>
        </div>
      </div>
    </div>

    <div class="sider-menu-container">
      <a-menu
        v-model:selectedKeys="activeSideKey"
        v-model:openKeys="openKeys"
        mode="inline"
        :collapsed="collapsed"
        class="side-menu"
        @menu-item-click="handleSideMenuClick"
        @sub-menu-click="handleSubMenuClick"
      >
        <a-menu-item key="__home__" @click="handleHomeClick">
          <template #icon><IconHome /></template>
          <span>工作台首页</span>
        </a-menu-item>

        <a-divider v-if="currentDomainEpics.length > 0" />

        <template v-for="epic in filteredEpics" :key="epic.key">
          <a-sub-menu v-if="epic.features && epic.features.length > 0" :key="epic.key">
            <template #title>
              <div class="epic-title">
                <span class="epic-icon">{{ epic.icon || '📂' }}</span>
                <span class="epic-text" v-if="!collapsed">{{ epic.displayName }}</span>
              </div>
            </template>
            <a-menu-item
              v-for="feature in epic.features"
              :key="feature.key"
              class="feature-item"
            >
              <span class="feature-item-content">
                <span class="feature-icon">{{ feature.icon }}</span>
                <span class="feature-name">{{ feature.name }}</span>
              </span>
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item v-else :key="epic.key" class="epic-title epic-standalone">
            <span class="epic-icon">{{ epic.icon || '📂' }}</span>
            <span class="epic-text" v-if="!collapsed">{{ epic.displayName }}</span>
          </a-menu-item>
        </template>

        <!-- 无搜索结果提示 -->
        <a-menu-item v-if="searchQuery && filteredEpics.length === 0 && !collapsed" disabled>
          <span class="no-results">未找到匹配的功能</span>
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconHome, IconStar } from '@arco-design/web-vue/es/icon'
import type { DomainItem } from '../../config/domainDictionary'

const props = defineProps<{
  collapsed: boolean
  activeDomainKey: string
  activeSideKey: string[]
  openKeys: string[]
  currentDomain: DomainItem | undefined
  currentDomainEpics: any[]
  favoriteFeatures: any[]
  showQuickFav: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'update:activeSideKey', value: string[]): void
  (e: 'update:openKeys', value: string[]): void
  (e: 'menuClick', key: string): void
  (e: 'homeClick'): void
}>()

// 搜索相关
const searchQuery = ref('')

const collapsed = computed({
  get: () => props.collapsed,
  set: (val) => emit('update:collapsed', val)
})

const activeSideKey = computed({
  get: () => props.activeSideKey,
  set: (val) => emit('update:activeSideKey', val)
})

const openKeys = computed({
  get: () => props.openKeys,
  set: (val) => emit('update:openKeys', val)
})

// 搜索时自动展开所有子菜单
watch(searchQuery, (query) => {
  if (query.trim()) {
    // 搜索时展开所有 epic 子菜单
    const allEpicKeys = props.currentDomainEpics
      .filter((epic: any) => epic.features && epic.features.length > 0)
      .map((epic: any) => epic.key)
    openKeys.value = allEpicKeys
  }
})

// 过滤后的 Epic 列表
const filteredEpics = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.currentDomainEpics
  }
  const query = searchQuery.value.toLowerCase().trim()
  return props.currentDomainEpics.map(epic => {
    const filteredFeatures = epic.features?.filter((f: any) => 
      f.name.toLowerCase().includes(query) || 
      f.desc?.toLowerCase().includes(query)
    )
    return {
      ...epic,
      features: filteredFeatures
    }
  }).filter((epic: any) => 
    epic.features && epic.features.length > 0
  )
})

// 过滤后的快捷访问
const filteredFavorites = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.favoriteFeatures
  }
  const query = searchQuery.value.toLowerCase().trim()
  return props.favoriteFeatures.filter((f: any) => 
    f.name.toLowerCase().includes(query)
  )
})

function onSearch(value: string) {
  console.log('[Sider] search:', value)
}

function handleSideMenuClick(key: string) {
  if (key === '__home__') {
    handleHomeClick()
    return
  }
  emit('menuClick', key)
}

function handleHomeClick() {
  emit('homeClick')
}

function handleQuickFavClick(key: string) {
  emit('menuClick', key)
}

function handleSubMenuClick(key: string) {
  const idx = props.openKeys.indexOf(key)
  if (idx > -1) {
    openKeys.value = props.openKeys.filter(k => k !== key)
  } else {
    openKeys.value = [...props.openKeys, key]
  }
}
</script>

<style scoped>
.layout-sider {
  background: var(--surface-bg);
  box-shadow: var(--shadow-sider, 2px 0 8px rgba(0,0,0,0.08));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.sider-header {
  height: var(--layout-sider-header-height, 56px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-3);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}
.sider-domain-info { display: flex; align-items: center; gap: var(--space-2); overflow: hidden; }
.sider-domain-icon { font-size: 20px; flex-shrink: 0; }
.sider-domain-icon-collapsed { font-size: 20px; display: block; text-align: center; width: 100%; }
.sider-domain-name { font-size: 14px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 搜索框样式 */
.sider-search {
  padding: var(--space-3) var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}
.search-input {
  width: 100%;
}
.search-input :deep(.arco-input-wrapper) {
  background: var(--surface-bg-2);
  border-radius: 6px;
}
.search-input :deep(.arco-input-wrapper:hover),
.search-input :deep(.arco-input-wrapper.arco-input-wrapper-focus) {
  background: var(--surface-bg);
}

.quick-fav-section {
  padding: var(--space-3) var(--space-2) var(--space-2);
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}
.qf-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-2);
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.qf-items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; }
.qf-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-2);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.qf-item:hover { background: var(--surface-bg-2); }
.qf-item.active { background: rgba(22,93,255,0.08); }
.qf-icon { font-size: 14px; flex-shrink: 0; }
.qf-name { font-size: 12px; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sider-menu-container { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 0; }
.sider-menu-container::-webkit-scrollbar { width: 4px; }
.sider-menu-container::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }
.side-menu { border-right: none; }

:deep(.arco-menu-inline .arco-menu-item),
:deep(.arco-menu-inline .arco-menu-sub-menu-title) {
  height: 40px;
  line-height: 40px;
  margin: 4px 8px;
  border-radius: 6px;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
:deep(.arco-menu-inline .arco-menu-item:hover),
:deep(.arco-menu-inline .arco-menu-sub-menu-title:hover) { background: var(--surface-bg-2); }
:deep(.arco-menu-inline .arco-menu-item.arco-menu-selected) {
  background: linear-gradient(90deg, rgba(22,93,255,0.1) 0%, rgba(22,93,255,0.04) 100%);
  color: var(--color-primary);
}

.epic-title { display: flex; align-items: center; gap: 6px; }
.epic-icon { font-size: 14px; flex-shrink: 0; }
.epic-text { font-size: 12px; font-weight: 600; color: var(--text-primary); }
.epic-standalone { margin: 2px 6px !important; }
.feature-item { padding-left: 28px !important; }
.feature-item-content { display: flex; align-items: center; gap: 6px; }
.feature-icon { font-size: 13px; flex-shrink: 0; }
.feature-name { font-size: 13px; color: var(--text-secondary); }
.no-results {
  font-size: 12px;
  color: var(--text-tertiary);
  text-align: center;
  display: block;
  padding: var(--space-3) 0;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

:deep(.arco-layout-sider-trigger) {
  border-top: 1px solid #f0f0f0;
}
</style>
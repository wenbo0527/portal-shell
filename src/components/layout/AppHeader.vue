<template>
  <div class="layout-header">
    <div class="header-left">
      <div class="header-logo" @click="handleHomeClick">
        <span class="logo-text">产品demo管理</span>
      </div>

      <a-menu
        mode="horizontal"
        :selected-keys="[activeDomainKey]"
        class="header-domain-menu"
        @menu-item-click="handleDomainMenuClick"
      >
        <a-menu-item key="home">
          工作台
        </a-menu-item>
        <a-menu-item
          v-for="domain in productDomains"
          :key="domain.key"
        >
          {{ domain.shortName }}
        </a-menu-item>
      </a-menu>
    </div>

    <div class="header-center">
      <a-trigger v-model:popup-visible="searchVisible" :trigger="['click']" :click-outside-to-close="true" position="bl">
        <div class="global-search" @click="handleSearchClick">
          <span class="search-placeholder">搜索功能、应用、人员...</span>
          <kbd class="search-shortcut">⌘K</kbd>
        </div>
        <template #content>
          <div class="search-modal-content">
            <div class="search-input-wrapper">
              <input
                ref="searchInput"
                v-model="searchQuery"
                class="search-input"
                placeholder="搜索功能、应用..."
                @keydown.esc="searchVisible = false"
              />
              <kbd class="search-esc">ESC</kbd>
            </div>
            <div class="search-results" v-if="searchQuery">
              <div
                v-for="result in searchResults"
                :key="result.key"
                class="search-result-item"
                @click="selectSearchResult(result)"
              >
                <div class="result-body">
                  <span class="result-name">{{ result.name }}</span>
                  <span class="result-path">{{ result.domainName }} · {{ result.epicName }}</span>
                </div>
              </div>
              <a-empty v-if="searchResults.length === 0" description="未找到匹配结果" />
            </div>
            <div class="search-hints" v-else>
              <span class="search-hint-label">快捷键</span>
              <div class="search-hint-items">
                <span class="hint-item"><kbd>↑↓</kbd> 导航</span>
                <span class="hint-item"><kbd>Enter</kbd> 选中</span>
                <span class="hint-item"><kbd>Esc</kbd> 关闭</span>
              </div>
            </div>
          </div>
        </template>
      </a-trigger>
    </div>

    <div class="header-right">
      <a-tooltip title="切换侧边栏">
        <a-button type="text" class="header-action-btn" @click="toggleSider">{{ collapsed ? '展开侧栏' : '收起侧栏' }}</a-button>
      </a-tooltip>

      <a-tooltip title="全屏">
        <a-button type="text" class="header-action-btn" @click="toggleFullscreen">全屏</a-button>
      </a-tooltip>

      <a-popover position="br" trigger="click" v-model:popup-visible="notifVisible">
        <a-badge :count="notificationCount" :max-count="9" :offset="[-2, 2]">
          <a-button type="text" class="header-action-btn">通知</a-button>
        </a-badge>
        <template #content>
          <div class="notif-panel">
            <div class="notif-header">
              <span class="notif-title">通知中心</span>
              <a-button type="text" size="mini" @click="clearNotifications">全部已读</a-button>
            </div>
            <div class="notif-list">
              <div class="notif-item" v-for="n in notifications" :key="n.id">
                <span class="notif-dot" :class="n.type"></span>
                <div class="notif-body">
                  <span class="notif-text">{{ n.text }}</span>
                  <span class="notif-time">{{ n.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </a-popover>

      <a-dropdown trigger="click" position="br">
        <div class="user-info">
          <a-avatar :size="32" class="user-avatar">管</a-avatar>
          <span class="user-name">管理员</span>
        </div>
        <template #content>
          <a-doption @click="handleUserAction('profile')">
            个人中心
          </a-doption>
          <a-doption @click="handleUserAction('settings')">
            系统设置
          </a-doption>
          <a-divider />
          <a-doption @click="handleUserAction('logout')">
            退出登录
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { FeatureItem } from '../../config/domainDictionary'
import { allDomains } from '../../config/domainDictionary'

const props = defineProps<{
  activeDomainKey: string
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'search', result: FeatureItem & { domainName: string; epicName: string }): void
  (e: 'switchDomain', key: string): void
  (e: 'home'): void
  (e: 'toggleSider'): void
}>()

const searchVisible = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()
const notifVisible = ref(false)

const productDomains = computed(() => allDomains.filter(d => d.key !== 'home'))

const notificationCount = ref(3)
const notifications = ref([
  { id: 1, type: 'info', text: '数字营销模块已更新至新版本', time: '10分钟前' },
  { id: 2, type: 'warning', text: '数据探索服务响应延迟', time: '30分钟前' },
  { id: 3, type: 'success', text: '系统健康检查已完成', time: '1小时前' },
])

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return allDomains
    .flatMap(d => d.epics.flatMap(e => e.features.map(f => ({ ...f, domainName: d.name, epicName: e.displayName, gradient: '' }))))
    .filter(f => f.name.toLowerCase().includes(q) || f.key.toLowerCase().includes(q))
    .slice(0, 8)
})

function clearNotifications() {
  notificationCount.value = 0
  notifications.value = []
  notifVisible.value = false
  Message.success('已全部标记为已读')
}

function handleSearchClick() {
  searchVisible.value = true
  nextTick(() => searchInput.value?.focus())
}

function selectSearchResult(result: FeatureItem & { domainName: string; epicName: string }) {
  emit('search', result)
  searchVisible.value = false
  searchQuery.value = ''
}

function handleDomainMenuClick(key: string) {
  if (key === 'home') {
    emit('home')
  } else {
    emit('switchDomain', key)
  }
}

function handleHomeClick() {
  emit('home')
}

function toggleSider() {
  emit('toggleSider')
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function handleUserAction(action: string) {
  const map: Record<string, string> = {
    profile: '个人中心正在建设中',
    settings: '系统设置正在建设中',
    logout: '退出登录功能正在建设中',
  }
  const msg = map[action]
  if (msg) { if (action === 'logout') Message.warning(msg); else Message.info(msg) }
}
</script>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  background: #fff;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  z-index: 100;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;
}

.header-logo {
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  flex-shrink: 0;
}
.logo-text {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.header-domain-menu {
  border: none;
  background: transparent;
  font-size: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
.header-domain-menu :deep(.arco-menu-item) {
  padding: 0 12px;
}

.header-domain-menu::-webkit-scrollbar {
  height: 0;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 560px;
  margin: 0 auto;
}

.global-search {
  width: 100%;
  max-width: 480px;
  height: 38px;
  background: var(--surface-bg-2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.global-search:hover { background: #e8e9eb; border-color: var(--border-color); }
.search-placeholder { flex: 1; font-size: 13px; color: var(--text-tertiary); }
.search-shortcut { font-size: 11px; color: var(--text-tertiary); background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #e8e9eb; }

.header-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
.header-action-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.header-action-btn:hover { background: var(--surface-bg-2); color: #165dff; }

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: 4px;
}
.user-info:hover { background: var(--surface-bg-2); }
.user-avatar {
  background: linear-gradient(135deg, #165dff 0%, #4285f4 100%);
  font-size: 13px;
  font-weight: 500;
}
.user-name { font-size: 13px; color: var(--text-secondary); white-space: nowrap; }

.notif-panel { width: 320px; }
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}
.notif-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.notif-list { max-height: 320px; overflow-y: auto; }
.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}
.notif-item:last-child { border-bottom: none; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
.notif-dot.info { background: #165dff; }
.notif-dot.warning { background: #ff7d00; }
.notif-dot.success { background: #00b42a; }
.notif-body { flex: 1; }
.notif-text { font-size: 13px; color: var(--text-primary); display: block; }
.notif-time { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; display: block; }

.search-modal-content {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  width: 520px;
}
.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text-primary);
  background: transparent;
}
.search-input::placeholder { color: var(--text-quaternary); }
.search-esc { font-size: 11px; color: var(--text-tertiary); background: var(--surface-bg-2); padding: 2px 6px; border-radius: 4px; }
.search-results { max-height: 360px; overflow-y: auto; padding: 8px; }
.search-result-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.search-result-item:hover { background: var(--surface-bg-2); }
.result-body { flex: 1; }
.result-name { font-size: 14px; font-weight: 500; color: var(--text-primary); display: block; }
.result-path { font-size: 12px; color: var(--text-tertiary); display: block; }
.search-hints { padding: 16px; }
.search-hint-label {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 10px;
}
.search-hint-items { display: flex; gap: 16px; }
.hint-item { font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }
.hint-item kbd { font-size: 11px; background: var(--surface-bg-2); padding: 2px 6px; border-radius: 4px; color: var(--text-tertiary); }

@media (max-width: 1200px) {
  .header-center { display: none; }
}
@media (max-width: 768px) {
  .logo-text, .user-name { display: none; }
  .header-center { max-width: 200px; }
}
</style>

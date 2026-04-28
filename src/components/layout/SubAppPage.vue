<template>
  <div class="page-subapp">
    <div class="breadcrumb-bar">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <a @click="handleHomeClick">
            <IconHome /> 工作台
          </a>
        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentEpic">
          <a-dropdown>
            <span class="breadcrumb-dropdown-trigger">
              {{ currentEpic.displayName }} <IconCaretDown />
            </span>
            <template #content>
              <a-doption
                v-for="f in currentEpic.features"
                :key="f.key"
                @click="handleEpicFeatureClick(f.key)"
              >
                {{ f.icon }} {{ f.name }}
              </a-doption>
            </template>
          </a-dropdown>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ currentFeature?.name }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <div class="subapp-header">
      <div class="subapp-header-main">
        <div class="subapp-icon">{{ currentFeature?.icon }}</div>
        <div class="subapp-header-text">
          <h2 class="subapp-title">{{ currentFeature?.name }}</h2>
          <div class="subapp-tags">
            <a-tag :color="currentFeature?.color || 'arcoblue'">{{ currentEpic?.displayName }}</a-tag>
            <a-tag color="gray">{{ currentDomain?.name }}</a-tag>
          </div>
        </div>
      </div>
      <div class="subapp-header-actions">
        <a-button type="primary" @click="handleOpenNewTab">
          <template #icon><IconLaunch /></template>
          新窗口打开
        </a-button>
        <a-button @click="handleBack">
          <template #icon><IconCaretLeft /></template>
          返回
        </a-button>
      </div>
    </div>

    <p class="subapp-desc">{{ currentFeature?.desc }}</p>

    <!-- iframe 容器 -->
    <div class="iframe-wrapper">
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        class="subapp-iframe"
        :class="{ loaded: iframeLoaded }"
        @load="handleIframeLoad"
        @error="handleIframeError"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        allow="fullscreen"
      />
      <div v-if="iframeLoading" class="iframe-loading">
        <a-spin :size="24" />
        <span>正在加载应用...</span>
      </div>
      <div v-if="iframeError" class="iframe-error">
        <a-result status="error" title="应用加载失败" :subtitle="iframeError">
          <template #extra>
            <a-button type="primary" @click="retryLoad">重试</a-button>
            <a-button @click="handleBack">返回</a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconHome, IconCaretDown, IconCaretLeft, IconLaunch } from '@arco-design/web-vue/es/icon'
import type { DomainItem, EpicItem, FeatureItem } from '../../config/domainDictionary'

const props = defineProps<{
  currentFeature: FeatureItem | undefined
  currentEpic: EpicItem | undefined
  currentDomain: DomainItem | undefined
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'navigate', key: string): void
  (e: 'home'): void
}>()

const iframeLoading = ref(true)
const iframeLoaded = ref(false)
const iframeError = ref('')

// 子应用 URL 配置
const PUBLIC_BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL || 'http://118.196.79.130'

const iframeUrl = computed(() => {
  if (!props.currentFeature) return ''
  let url = props.currentFeature.url || ''
  
  if (url && !url.startsWith('http')) {
    url = `${PUBLIC_BASE_URL}${url}`
  }
  
  return url
})

function handleIframeLoad() {
  console.log('[Portal] iframe loaded successfully')
  iframeLoading.value = false
  iframeLoaded.value = true
  iframeError.value = ''
}

function handleIframeError() {
  console.error('[Portal] iframe load error')
  iframeLoading.value = false
  iframeError.value = '子应用加载失败，请检查网络或刷新重试'
}

function retryLoad() {
  iframeLoading.value = true
  iframeError.value = ''
  iframeLoaded.value = false
}

function handleBack() {
  iframeLoaded.value = false
  emit('back')
}

function handleOpenNewTab() {
  if (iframeUrl.value) {
    window.open(iframeUrl.value, '_blank')
  }
}

function handleEpicFeatureClick(key: string) {
  emit('navigate', key)
}

function handleHomeClick() {
  emit('home')
}

// 监听 feature 变化，重置 iframe 状态
watch(() => props.currentFeature?.key, (newKey, oldKey) => {
  if (newKey !== oldKey) {
    iframeLoading.value = true
    iframeLoaded.value = false
    iframeError.value = ''
  }
})
</script>

<style scoped>
.page-subapp {
  padding: 24px;
  min-height: 100%;
}

.breadcrumb-bar {
  margin-bottom: 16px;
}

.subapp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.subapp-header-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.subapp-icon {
  font-size: 40px;
  line-height: 1;
}

.subapp-header-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subapp-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
  margin: 0;
}

.subapp-tags {
  display: flex;
  gap: 8px;
}

.subapp-header-actions {
  display: flex;
  gap: 8px;
}

.subapp-desc {
  color: var(--color-text-3);
  margin-bottom: 16px;
}

.breadcrumb-dropdown-trigger {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* iframe 容器 */
.iframe-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 280px);
  min-height: 500px;
  background: var(--surface-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.subapp-iframe {
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.subapp-iframe.loaded {
  opacity: 1;
}

.iframe-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: var(--surface-bg);
  font-size: 14px;
  color: var(--text-tertiary);
}

.iframe-error {
  padding: 48px 24px;
}

@media (max-width: 768px) {
  .subapp-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .subapp-header-actions {
    width: 100%;
    margin-top: 16px;
  }
  
  .iframe-wrapper {
    height: calc(100vh - 320px);
  }
}
</style>

<!-- 追加样式到现有 scoped style 中 -->

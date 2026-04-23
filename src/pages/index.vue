<template>
  <a-config-provider :locale="locale">
    <div id="portal-app">
      <a-layout class="layout-container">
        <AppHeader
          :active-domain-key="activeTopKey[0]"
          :collapsed="collapsed"
          @search="handleSearchResult"
          @switch-domain="switchDomain"
          @home="handleHomeClick"
          @toggle-sider="collapsed = !collapsed"
        />

        <a-layout class="layout-body">
          <AppSider
            v-model:collapsed="collapsed"
            :active-domain-key="activeTopKey[0]"
            v-model:active-side-key="activeSideKey"
            v-model:open-keys="openKeys"
            :current-domain="currentDomain"
            :current-domain-epics="currentDomainEpics"
            :favorite-features="favoriteFeatures"
            :show-quick-fav="activeTopKey[0] === 'home'"
            @menu-click="handleSideMenuClick"
            @home-click="handleHomeClick"
          />

          <a-layout class="layout-main">
            <a-layout-content class="layout-content">
              <ProductOverviewDomainDetail
                v-if="isProductOverviewDomain"
                :key="'po-domain-' + $route.params.domainCode"
              />

              <ProductOverviewIndex
                v-else-if="isProductOverview"
                :key="'po-index'"
              />

              <WorkbenchHome
                v-else-if="activeTopKey[0] === 'home' && !currentFeature"
                :recent-visits="recentVisits"
                :quick-nav-items="quickNavItemsWithGradient"
                :product-domains="productDomains"
                :overview-stats="overviewStats"
                @clear-recent="clearRecent"
                @navigate="navigateToFeature"
                @switch-domain="switchDomain"
                @quick-start="handleQuickStart"
                @go-product-overview="handleGoProductOverview"
              />

              <DomainHome
                v-else-if="!currentFeature"
                :current-domain="currentDomain"
                :current-domain-epics="currentDomainEpics"
                @navigate="navigateToFeature"
                @refresh="handleRefresh"
              />

              <SubAppPage
                v-else
                :current-feature="currentFeature"
                :current-epic="currentEpic"
                :current-domain="currentDomain"
                @back="handleBack"
                @navigate="navigateToFeature"
                @home="handleHomeClick"
              />
            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-layout>

      <transition name="fade">
        <div v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
          <span class="back-to-top-arrow">↑</span>
        </div>
      </transition>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSider from '../components/layout/AppSider.vue'
import WorkbenchHome from '../components/layout/WorkbenchHome.vue'
import DomainHome from '../components/layout/DomainHome.vue'
import SubAppPage from '../components/layout/SubAppPage.vue'
import ProductOverviewIndex from '../pages/product-overview/index.vue'
import ProductOverviewDomainDetail from '../pages/product-overview/DomainDetail/index.vue'
import {
  allDomains,
  quickNavItems as _quickNavItems,
  getFeatureByKey,
  getDomainByKey,
  type DomainItem,
  type EpicItem,
  type FeatureItem
} from '../config/domainDictionary'

const route = useRoute()
const router = useRouter()
const locale = ref(zhCN)

const collapsed = ref(false)
const activeTopKey = ref<string[]>(['home'])
const activeSideKey = ref<string[]>([])
const openKeys = ref<string[]>([])
const showBackToTop = ref(false)

const recentVisits = ref([
  { key: 'risk-ext-lifecycle', name: '外部数据生命周期', domainName: '数字风险', epicName: '数据扩展', icon: '🛡️', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', time: '5分钟前' },
  { key: 'mkt-campaign-create', name: '创建营销活动', domainName: '数字营销', epicName: '营销管理', icon: '📢', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', time: '20分钟前' },
  { key: 'dex-c360-profile', name: '客户360画像', domainName: '数据探索', epicName: '客户360', icon: '🔍', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', time: '1小时前' },
])

function clearRecent() {
  recentVisits.value = []
}

const quickNavItemsWithGradient = computed(() => _quickNavItems.map((item, idx) => ({
  ...item,
  gradient: [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ][idx % 6]
})))

const productDomains = computed(() => (allDomains ?? []).filter(d => d.key !== 'home'))

const overviewStats = computed(() => [
  { label: '产品域', value: productDomains.value.length, icon: '🌐', bgColor: '#f0f5ff' },
  { label: '功能模块', value: (allDomains ?? []).reduce((s, d) => s + (d.epics ?? []).reduce((ss, e) => ss + (e.features?.length ?? 0), 0), 0), icon: '📦', bgColor: '#fff7e6' },
  { label: 'EPIC', value: (allDomains ?? []).reduce((s, d) => s + (d.epics?.length ?? 0), 0), icon: '📂', bgColor: '#e6f7ff' },
  { label: '我的收藏', value: favoriteFeatures.value?.length ?? 0, icon: '⭐', bgColor: '#f6ffed' },
])

const favoriteFeatures = computed(() =>
  (allDomains ?? []).flatMap(d => (d.epics ?? []).flatMap(e => (e.features ?? []))).slice(0, 4)
)

const currentDomain = computed<DomainItem | undefined>(() =>
  getDomainByKey(activeTopKey.value[0])
)
const currentDomainEpics = computed(() => currentDomain.value?.epics || [])

const currentFeature = computed<FeatureItem | undefined>(() =>
  activeSideKey.value[0] && activeSideKey.value[0] !== '__home__'
    ? getFeatureByKey(activeSideKey.value[0])
    : undefined
)

const currentEpic = computed<EpicItem | undefined>(() => {
  if (!currentFeature.value) return undefined
  return currentDomainEpics.value.find(epic =>
    epic.features.some(f => f.key === currentFeature.value?.key)
  )
})

const isProductOverview = computed(() =>
  route.name === 'product-overview' ||
  route.path.includes('/product-overview')
)
const isProductOverviewDomain = computed(() =>
  route.name === 'product-overview-domain'
)

function syncUrl() {
  const domain = activeTopKey.value[0]
  const feature = activeSideKey.value[0]

  if (domain === 'home' || !domain) {
    router.replace('/home')
  } else if (feature && feature !== '__home__') {
    router.replace(`/home/${domain}/${feature}`)
  } else {
    router.replace(`/home/${domain}`)
  }
}

function handleSearchResult(result: FeatureItem & { domainName: string; epicName: string }) {
  navigateToFeature(result.key)
}

function handleSideMenuClick(key: string) {
  if (key === '__home__') {
    activeTopKey.value = ['home']
    activeSideKey.value = []
    return
  }
  const feature = getFeatureByKey(key)
  if (feature) {
    activeSideKey.value = [key]
    addToRecent(feature)
  }
}

function handleHomeClick() {
  activeTopKey.value = ['home']
  activeSideKey.value = []
  openKeys.value = []
}

function addToRecent(feature: FeatureItem) {
  const existing = recentVisits.value.findIndex(r => r.key === feature.key)
  if (existing > -1) {
    recentVisits.value.splice(existing, 1)
  }
  const domain = getDomainByKey(feature.domain)
  const epic = domain?.epics.find(e => e.features.some(f => f.key === feature.key))
  recentVisits.value.unshift({
    key: feature.key,
    name: feature.name,
    domainName: domain?.name || '',
    epicName: epic?.displayName || '',
    icon: feature.icon,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    time: '刚刚'
  })
  recentVisits.value = recentVisits.value.slice(0, 5)
}

function navigateToFeature(key: string) {
  const feature = getFeatureByKey(key)
  if (!feature) return
  activeTopKey.value = [feature.domain]
  activeSideKey.value = [key]
  const domain = getDomainByKey(feature.domain)
  if (domain) {
    const epic = domain.epics.find(e => e.features.some(f => f.key === key))
    if (epic) openKeys.value = [epic.key]
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function switchDomain(key: string) {
  const domain = getDomainByKey(key)
  if (!domain) return
  
  // 直接进入该域的第一个 Feature，而不是显示导航页
  const firstEpic = domain.epics[0]
  if (firstEpic && (firstEpic.features?.length ?? 0) > 0) {
    const firstFeature = firstEpic.features[0]
    navigateToFeature(firstFeature.key)
  } else {
    // 如果没有 Feature，则显示导航页（兼容无 feature 的域）
    activeTopKey.value = [key]
    activeSideKey.value = []
    openKeys.value = []
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleRefresh() {}

function handleGoProductOverview(payload: { type: string; id: string; label: string; domainCode: string; uri?: string }) {
  if (payload.type === 'productDomain' || payload.type === 'feature' || payload.type === 'epic') {
    if (payload.domainCode) {
      router.push(`/product-overview/${payload.domainCode}${payload.type === 'epic' && payload.uri ? '?epic=' + encodeURIComponent(payload.uri) : ''}`)
    }
  }
}

function handleQuickStart() {
  if (_quickNavItems.length > 0) navigateToFeature(_quickNavItems[0].key)
}

function handleBack() {
  activeSideKey.value = []
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 400
}

function initFromUrl() {
  const domain = route.params.domain as string
  const feature = route.params.feature as string
  
  if (domain) {
    if (domain === 'home') {
      activeTopKey.value = ['home']
    } else {
      activeTopKey.value = [domain]
      if (feature) {
        activeSideKey.value = [feature]
        const domainObj = getDomainByKey(domain)
        if (domainObj) {
          const epic = domainObj.epics.find(e => e.features.some(f => f.key === feature))
          if (epic) openKeys.value = [epic.key]
        }
      }
    }
  }
}

watch(activeTopKey, () => {
  activeSideKey.value = []
  openKeys.value = []
  syncUrl()
})

watch(activeSideKey, () => {
  syncUrl()
})

onMounted(() => {
  initFromUrl()
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
#app,
#portal-app {
  height: 100%;
}

#portal-app :where(h1, h2, h3, h4, h5, h6, p, ul, ol) {
  margin: 0;
  padding: 0;
}

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overflow: hidden;
  background: var(--app-page-bg);
}
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.layout-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.layout-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--app-page-bg);
}
.layout-content::-webkit-scrollbar {
  width: 6px;
}
.layout-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.22);
  border-radius: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 40px;
  height: 40px;
  background: var(--app-surface-bg);
  border: 1px solid var(--app-border-color);
  border-radius: var(--app-radius-m);
  box-shadow: var(--app-shadow-1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 200;
  transition: all 0.2s;
  color: var(--color-text-3, rgba(0, 0, 0, 0.6));
}
.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: var(--app-shadow-2);
  color: var(--color-primary-6, #165dff);
}

.back-to-top-arrow {
  font-size: 16px;
  line-height: 1;
  font-weight: 600;
}
</style>

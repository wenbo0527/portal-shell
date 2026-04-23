import { createRouter, createWebHistory } from 'vue-router'

// portal-shell 主应用运行在 /home/ 前缀下
// 子应用通过 iframe 加载，各子应用独立运行

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  // 主应用工作台
  {
    path: '/home',
    name: 'home',
    component: () => import('../pages/index.vue')
  },
  // 各产品域路由（/home 前缀下匹配）
  {
    path: '/home/:domain',
    name: 'domain',
    component: () => import('../pages/index.vue')
  },
  {
    path: '/home/:domain/:feature',
    name: 'feature',
    component: () => import('../pages/index.vue')
  },
  // 兼容不带 /home 前缀的旧路径（引导到 /home）
  {
    path: '/risk',
    redirect: '/home/risk'
  },
  {
    path: '/risk/:feature',
    redirect: (to: any) => `/home/risk/${to.params.feature}`
  },
  {
    path: '/mkt',
    redirect: '/home/mkt'
  },
  {
    path: '/mkt/:feature',
    redirect: (to: any) => `/home/mkt/${to.params.feature}`
  },
  {
    path: '/dex',
    redirect: '/home/dex'
  },
  {
    path: '/dex/:feature',
    redirect: (to: any) => `/home/dex/${to.params.feature}`
  },
  {
    path: '/dmt',
    redirect: '/home/dmt'
  },
  {
    path: '/dmt/:feature',
    redirect: (to: any) => `/home/dmt/${to.params.feature}`
  },
  {
    path: '/admin',
    redirect: '/home/admin'
  },
  {
    path: '/admin/:feature',
    redirect: (to: any) => `/home/admin/${to.params.feature}`
  },
  {
    path: '/dfd',
    redirect: '/home/dfd'
  },
  {
    path: '/dfd/:feature',
    redirect: (to: any) => `/home/dfd/${to.params.feature}`
  },
  {
    path: '/product-overview',
    name: 'product-overview',
    component: () => import('../pages/product-overview/index.vue')
  },
  {
    path: '/product-overview/:domainCode',
    name: 'product-overview-domain',
    component: () => import('../pages/product-overview/DomainDetail/index.vue')
  },
]

const router = createRouter({
  history: createWebHistory('/home/'),
  routes
})

export default router

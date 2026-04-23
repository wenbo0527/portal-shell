/**
 * 主应用入口
 */
import { createApp } from 'vue';
import App from './pages/index.vue';
import { createRouteGuard } from './router/guard';
import router from './router';
import { createPinia } from 'pinia';
import './style.css';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

/**
 * 临时禁用飞书SSO，直接允许访问
 * TODO: 正式环境需接入真实 SSO
 */
async function handleAuth(): Promise<boolean> {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    window.history.replaceState({}, '', window.location.pathname);
  }

  console.log('[Portal] 开发模式：跳过SSO验证');
  return true;
}

async function init() {
  const authenticated = await handleAuth();
  if (!authenticated) {
    document.body.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:18px;">访问被拒绝</div>';
    return;
  }

  // 创建 Vue app
  const app = createApp(App);

  // 注册 Pinia
  const pinia = createPinia();
  app.use(pinia);

  // 注册 Arco Design
  app.use(ArcoVue);

  // 注册路由
  app.use(router);

  // 设置路由守卫
  createRouteGuard(router);

  // 挂载
  app.mount('#app');

  console.log('[Portal] 企业应用门户已启动');
}

init();
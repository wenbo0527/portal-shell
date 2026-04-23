/**
 * 路由守卫主入口
 * 统一管理所有路由守卫
 */
import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupUserLoginInfoGuard from './userLoginInfo';
import setupPermissionGuard from './permission';

/**
 * 页面级守卫（用于发射路由变化事件）
 */
function setupPageGuard(router: Router) {
  router.beforeEach(async (to) => {
    setRouteEmitter(to);
  });
}

/**
 * 创建路由守卫
 */
export function createRouteGuard(router: Router) {
  setupPageGuard(router);
  setupUserLoginInfoGuard(router);
  setupPermissionGuard(router);
}

export default createRouteGuard;

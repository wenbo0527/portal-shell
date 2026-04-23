/**
 * 路由变化监听工具
 */
import type { RouteLocationNormalized } from 'vue-router';

let routeListener: ((to: RouteLocationNormalized) => void) | null = null;

/**
 * 设置路由变化监听器
 */
export function setRouteEmitter(to: RouteLocationNormalized) {
  if (routeListener) {
    routeListener(to);
  }
}

/**
 * 注册路由变化监听
 */
export function registerRouteListener(
  listener: (to: RouteLocationNormalized) => void
) {
  routeListener = listener;
}

/**
 * 移除路由变化监听
 */
export function removeRouteListener() {
  routeListener = null;
}

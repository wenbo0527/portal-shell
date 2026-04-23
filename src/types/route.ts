/**
 * 路由相关类型定义
 */
import type { RouteRecordRaw } from 'vue-router';

// 路由元信息
export interface RouteMeta {
  requiresAuth?: boolean;
  permission?: string | string[];
  title?: string;
  menuVisible?: boolean;
  icon?: string;
  keepAlive?: boolean;
}

// 扩展的路由记录（使用交叉类型避免扩展问题）
export type ExtendedRouteRecordRaw = RouteRecordRaw & {
  meta?: RouteMeta;
  children?: ExtendedRouteRecordRaw[];
};

// 菜单项
export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
}

// 标签页项
export interface TabItem {
  key: string;
  label: string;
  path: string;
  closable?: boolean;
}

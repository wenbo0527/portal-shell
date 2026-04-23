/**
 * 应用状态管理
 */
import { defineStore } from 'pinia';
import type { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebarCollapsed: false,
    globalLoading: false,
    theme: 'light',
    themeColor: '#165DFF',
    device: 'desktop',
    locale: 'zh-CN',
  }),

  getters: {
    isSidebarCollapsed(state: AppState): boolean {
      return state.sidebarCollapsed;
    },
    isMobile(state: AppState): boolean {
      return state.device === 'mobile';
    },
  },

  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebarCollapsed = collapsed;
    },
    setGlobalLoading(loading: boolean) {
      this.globalLoading = loading;
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
    },
    setThemeColor(color: string) {
      this.themeColor = color;
    },
    setDevice(device: 'desktop' | 'mobile') {
      this.device = device;
    },
    setLocale(locale: string) {
      this.locale = locale;
    },
  },
});

export default useAppStore;

/**
 * 应用状态类型
 */
export interface AppState {
  // 侧边栏折叠状态
  sidebarCollapsed: boolean;
  // 全局加载状态
  globalLoading: boolean;
  // 主题
  theme: 'light' | 'dark';
  // 主题色
  themeColor: string;
  // 设备类型
  device: 'desktop' | 'mobile';
  // 语言
  locale: string;
}

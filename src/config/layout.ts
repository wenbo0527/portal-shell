/**
 * 布局配置
 */
export const LAYOUT_CONFIG = {
  // Header
  header: {
    height: 48,
    background: '#fff',
    padding: '0 24px',
  },
  // Sider
  sider: {
    width: 220,
    background: '#fff',
    collapsedWidth: 48,
  },
  // Content
  content: {
    background: '#f5f5f5',
    padding: 16,
  },
  // Border
  border: {
    color: '#e5e6eb',
    radius: 8,
  },
} as const;

// 动画配置
export const ANIMATION = {
  duration: '0.2s',
  easing: 'ease',
} as const;
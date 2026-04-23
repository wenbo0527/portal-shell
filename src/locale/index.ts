/**
 * 国际化配置
 */
export type Locale = 'zh-CN' | 'en-US';

// 支持的语言
export const SUPPORTED_LOCALES: { label: string; value: Locale }[] = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
];

// 默认语言
export const DEFAULT_LOCALE: Locale = 'zh-CN';
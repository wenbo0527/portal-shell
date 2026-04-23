/**
 * API 相关类型定义
 */
import type { AxiosRequestConfig } from 'axios';

// API 响应结构
export interface HttpResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 请求配置选项
export interface RequestOptions {
  loading?: boolean;
  showError?: boolean;
  caching?: boolean;
}

// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求配置扩展
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
}

// API 错误
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}

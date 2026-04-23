/**
 * 请求封装 Hook
 */
import { ref } from 'vue';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';

export interface RequestOptions {
  loading?: boolean;
  showError?: boolean;
}

export function useRequest<T = any>(
  url: string,
  options: RequestOptions = { loading: true, showError: true }
) {
  const loading = ref(false);
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);

  const request = async (config?: AxiosRequestConfig) => {
    if (options.loading) loading.value = true;
    
    try {
      const response: AxiosResponse = await axios(url, {
        ...config,
      });
      data.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err;
      if (options.showError) {
        Message.error(err.message || '请求失败');
      }
      throw err;
    } finally {
      if (options.loading) loading.value = false;
    }
  };

  return {
    loading,
    data,
    error,
    request,
  };
}

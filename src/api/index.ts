/**
 * Axios 实例配置
 * 统一封装请求拦截器、响应拦截器
 */
import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 添加 Token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    
    // 根据业务状态码处理
    if (data.code !== 0 && data.code !== 200) {
      Message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    
    return response;
  },
  (error) => {
    // 错误处理
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 401:
          Message.error('登录已过期，请重新登录');
          // 可以触发登出逻辑
          break;
        case 403:
          Message.error('没有权限访问该资源');
          break;
        case 404:
          Message.error('请求的资源不存在');
          break;
        case 500:
          Message.error('服务器内部错误');
          break;
        default:
          Message.error(response.data?.message || '网络错误');
      }
    } else {
      Message.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

/**
 * 用户状态管理
 */
import { defineStore } from 'pinia';
import { getToken, setToken, clearToken } from '@/utils/auth';
import type { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userId: undefined,
    name: undefined,
    avatar: undefined,
    email: undefined,
    phone: undefined,
    role: undefined,
    permissions: [],
    isLogin: false,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
    isLoggedIn(state: UserState): boolean {
      return state.isLogin ?? false;
    },
    hasPermission:
      (state) =>
      (permission: string): boolean => {
        if (!state.permissions || state.permissions.length === 0) {
          return false;
        }
        return state.permissions.includes(permission);
      },
  },

  actions: {
    setUserInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    resetUserState() {
      this.$reset();
    },

    initState() {
      const token = getToken();
      if (token) {
        this.isLogin = true;
      }
    },

    setAuthToken(token: string) {
      setToken(token);
      this.isLogin = true;
    },

    clearAuth() {
      clearToken();
      this.resetUserState();
    },

    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
  },
});

export default useUserStore;

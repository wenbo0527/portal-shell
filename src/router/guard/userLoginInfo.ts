/**
 * 用户登录信息守卫
 * 在路由切换时获取/更新用户信息
 */
import type { Router } from 'vue-router';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to) => {
    // 如果目标路由需要认证
    if (to.meta.requiresAuth !== false && isLogin()) {
      // 可以在这里获取用户信息
      // await userStore.info();
    }
    return true;
  });
}

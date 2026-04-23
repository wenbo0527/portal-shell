/**
 * 权限守卫
 * 验证用户是否有权限访问目标路由
 */
import type { Router } from 'vue-router';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (_to, _from, next) => {
    // 获取路由需要的权限
    const requiredPermission = _to.meta.permission;
    
    if (requiredPermission) {
      // TODO: 从 store 获取用户权限进行验证
      // const hasPermission = userStore.permissions.includes(requiredPermission as string);
      // if (!hasPermission) {
      //   Message.error('没有权限访问该页面');
      //   return next({ name: '403' });
      // }
    }
    
    next();
  });
}

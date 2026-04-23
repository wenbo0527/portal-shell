/**
 * 用户状态类型
 */
export interface UserState {
  // 用户 ID
  userId?: string;
  // 用户名
  name?: string;
  // 头像
  avatar?: string;
  // 邮箱
  email?: string;
  // 手机号
  phone?: string;
  // 角色
  role?: string;
  // 权限列表
  permissions?: string[];
  // 登录状态
  isLogin?: boolean;
}

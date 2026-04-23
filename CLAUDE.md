# Portal Shell - 项目规范

> 本文件是 portal-shell 项目的工程化规范，所有 AI 开发必须遵守。  
> 版本：v1.0 | 最后更新：2026-04-23

---

## 一、技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 + TypeScript | `<script setup>` 语法 |
| UI 组件库 | Arco Design Vue | 禁止混用其他组件库 |
| 构建工具 | Vite | 静态资源构建 |
| 路由 | Vue Router 4 | history 模式 |
| HTTP 客户端 | Axios | 统一封装在 `src/api/index.ts` |
| 状态管理 | Pinia | 尚未引入，待评估 |
| 生产服务器 | Node.js（CJS） | `dist/server.cjs`（自研静态服务器） |

---

## 二、目录结构

```
portal-shell/
├── src/
│   ├── api/                    # API 封装（禁止直接 axios）
│   │   ├── index.ts           # axios 实例（拦截器、认证）
│   │   └── productOverview.ts # 产品全景 API
│   ├── components/            # 公共组件
│   │   ├── AppHeader.vue      # 顶部导航栏
│   │   └── AppSider.vue       # 左侧菜单栏
│   ├── pages/
│   │   ├── index.vue          # 主入口页面
│   │   └── product-overview/
│   │       ├── index.vue       # 产品概览页
│   │       └── DomainDetail/  # 域详情组件
│   ├── router/index.ts         # 路由配置
│   ├── types/productOverview.ts # TypeScript 类型定义
│   └── utils/auth.ts          # 认证工具
├── dist/                       # 构建产物（npm run build 生成）
│   ├── server.cjs             # 生产服务器（端口 8000）
│   └── index.html
├── package.json
└── CLAUDE.md                  # 本文件
```

---

## 三、API 契约

### 3.1 Base URL
- 本地开发：`http://localhost:8080`
- 生产环境：`/api/v1/product-overview`（nginx 代理到 Java 后端）

### 3.2 接口列表

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/v1/product-overview/` | 全景概览（所有域 + Epic） | ✅ 正常 |
| GET | `/api/v1/product-overview/domain/{code}` | 域详情 | ⚠️ PD-COM 返回空，前端有 Fallback |
| GET | `/api/v1/product-overview/epic/{uri}` | Epic 详情 | ⚠️ 未测试 |

### 3.3 响应格式
```typescript
interface ApiResponse<T> {
  code: number;      // 0 = 成功
  message: string;
  data: T;
}
```

### 3.4 认证
Bearer Token：`Authorization: Bearer <token>`（从 `utils/auth.ts` 的 `getToken()` 获取）

---

## 四、已知问题（禁止忽略）

| # | 问题 | 影响 | 状态 |
|---|:---|:---|:---:|
| 1 | `/domain/PD-COM` 接口返回空 | 域详情页无法加载真实数据 | ⚠️ 前端已有 Fallback |
| 2 | product-backend controller 层大部分为空 | 很多 API 没有真实实现 | ⚠️ 待后端补充 |
| 3 | 功能点 URI 是 Mock 数据（`_summary_` / `_fp_X`） | 数字社区域的 FP 数据不真实 | ⚠️ Mock |
| 4 | `dist/server.cjs` 是临时创建的文件 | 需纳入 Git 版本控制 | ⚠️ 待处理 |

---

## 五、开发约束

### 5.1 禁止事项
- ❌ 不许直接 `axios.get()` / `axios.post()`，必须用 `src/api/index.ts` 封装的实例
- ❌ 不许混用 Arco Design 以外的组件库
- ❌ 不许在组件内直接操作 DOM，用 Vue 的响应式机制
- ❌ 不许使用 `any` 类型
- ❌ 不许 `console.log` 提交到代码库，用 `console.warn` 或框架日志
- ❌ 不许修改 `accompany.ts`（数据社区项目的约束，portal-shell 无此文件但注意区分）

### 5.2 代码风格
- 组件使用 `<script setup lang="ts">`
- 所有 API 函数返回类型必须声明
- 组件 props 必须有 TypeScript 类型
- 异步操作用 `async/await`，统一 try/catch

### 5.3 路由规则
- 所有路由在 `src/router/index.ts` 集中管理
- 新增页面需同步更新侧边栏菜单配置
- SPA 所有路由都需要 fallback 到 `index.html`

---

## 六、质量验收清单

每次修改后必须逐项验证：

### 功能检查
- [ ] 页面能正常加载（`http://localhost:8000`）
- [ ] 侧边栏菜单能正常切换
- [ ] 域详情数据能正常展示（PD-COM 等）
- [ ] API 请求不报 404/500

### 构建检查
- [ ] `npm run build` 通过
- [ ] 构建产物在 `dist/` 目录
- [ ] `dist/server.cjs` 存在且可执行

### Git 检查
- [ ] 修改前先 `git commit -m "WIP: xxx"`
- [ ] 修改完成后 `git commit -m "fix/feat: xxx"`
- [ ] 禁止提交 `node_modules/`、`*.local`

---

## 七、工作流程

```
1. 需求分析 → 拆解为 ≤200 行的小任务
2. 环境准备 → 确认 node_modules 已安装，端口空闲
3. 分阶段执行 → 每个功能单独开发
4. 质量验收 → 过上方清单
5. Checkpoint → git commit + tag（如有大阶段则打 tag）
6. 如遇错误 → git commit "WIP: 问题描述" → 回滚 → 修正
```

---

## 八、相关文档

- 架构文档：`/Users/wenbo/Documents/05_AgentOutput/agent_work/Zhongli/PortalShell架构文档_v1.0.md`
- 后端 API：Java Spring Boot，端口 8080（联系后端团队获取接口定义）
- Neo4j 数据库：7687/7474（联系后端团队获取数据模型）

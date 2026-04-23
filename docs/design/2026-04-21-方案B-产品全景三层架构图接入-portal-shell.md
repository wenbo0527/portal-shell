# 方案B：产品全景三层架构图接入（portal-shell）设计文档

**版本**：v0.2
**更新日期**：2026-04-21
**状态**：前端已实现，等待后端就绪

## 0. 当前进展（v0.1 → v0.2）

### ✅ 已完成

| 模块 | 文件 | 说明 |
|---|---|---|
| 类型定义 | [src/types/productOverview.ts](file:///Users/wenbo/Documents/project/portal-shell/src/types/productOverview.ts) | ProductDomain / Epic / Feature / FunctionPoint 及 API 响应类型 |
| API 封装 | [src/api/productOverview.ts](file:///Users/wenbo/Documents/project/portal-shell/src/api/productOverview.ts) | `getProductOverview` / `getDomainDetail` / `getArchitectureMapData`（并发拉取所有域详情） |
| 架构图重构 | [src/components/layout/ArchitectureMap.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/ArchitectureMap.vue) | props 驱动，含加载态/错误态/空态；emit `select` 事件 |
| WorkbenchHome 升级 | [src/components/layout/WorkbenchHome.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/WorkbenchHome.vue) | 承担数据拉取职责，透传 `go-product-overview` |
| 全景总览页 | [src/pages/product-overview/index.vue](file:///Users/wenbo/Documents/project/portal-shell/src/pages/product-overview/index.vue) | 展示 6 大产品域 + Epic 列表，含统计卡片 |
| 产品域详情页 | [src/pages/product-overview/DomainDetail/index.vue](file:///Users/wenbo/Documents/project/portal-shell/src/pages/product-overview/DomainDetail/index.vue) | 四级展开（域→Epic→功能→功能点），支持 `?epic=` 锚点定位 |
| 路由更新 | [src/router/index.ts](file:///Users/wenbo/Documents/project/portal-shell/src/router/index.ts) | 新增 `/product-overview` 与 `/product-overview/:domainCode` |
| 容器页更新 | [src/pages/index.vue](file:///Users/wenbo/Documents/project/portal-shell/src/pages/index.vue) | 新增 `isProductOverview` / `isProductOverviewDomain` 分支及 `handleGoProductOverview` |
| 代理配置 | [vite.config.ts](file:///Users/wenbo/Documents/project/portal-shell/vite.config.ts) | 新增 `/api` → `http://118.196.79.130:8081` 代理 |
| 错误态样式 | ArchitectureMap.vue | 限制 `arco-result` 最大宽度避免撑满 |

### ⚠️ 当前阻塞：404 后端未就绪

访问工作台首页时，架构图区域显示 **HTTP 404**，原因是后端尚未部署产品全景相关 API。

**现状**：

- 前端已配置 `/api` 代理到 `http://118.196.79.130:8081`
- 前端已实现 `getProductOverview` / `getDomainDetail` / `getArchitectureMapData` 三个接口的调用逻辑
- 但 `http://118.196.79.130:8081/api/v1/product-overview/` 返回 404

**原因**：后端 Flask 服务（`ai_service.py`）尚未实现产品全景 API 接口。根据产品文档，后端由**钟离**维护，位于 `/Users/wenbo/Documents/project/product_managment/backend-python/ai_service.py`，服务端口 `8081`，路由前缀 `/api/v1/`。

### ⏳ 待开发内容

以下内容需要**后端先完成**，前端才能端到端联调：

#### 优先级 P0（必须，否则功能不可用）

**后端 — 产品全景 API 接入（由钟离负责）**

1. 在 `ai_service.py` 中实现以下路由：

| 接口 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 全景页数据 | GET | `/api/v1/product-overview/` | 返回全部 ProductDomain + Epic |
| 产品域详情 | GET | `/api/v1/product-overview/domain/<code>` | 返回该域的 Epic + Feature + FunctionPoint |
| Epic 详情 | GET | `/api/v1/product-overview/epic/<uri>` | 返回指定 Epic 详情（可选） |

> 具体字段映射与 Cypher 查询见产品文档第三节与第六节。

2. **Neo4j 连接确认**：确认 `bolt://localhost:7687` 可访问，Neo4j 中已有 `ProductDomain / Epic / Feature / FunctionPoint` 节点。

3. **CORS 配置**：确保 Flask 服务允许来自 `http://118.196.79.130` 的跨域请求，或通过 nginx 做同域转发。

#### 优先级 P1（联调完成后优化）

1. **映射表（可选）**：若希望架构图点击 Epic/Feature 后直接打开对应的 iframe 子应用（而非进入产品全景详情页），需要在 `src/config/productOverviewMap.ts` 中维护 `Epic.uri → FeatureItem.key` 的映射关系，并实现 B 路径跳转逻辑。

2. **产品全景页入口**：目前产品全景页仅通过架构图"更多"入口访问。可考虑在顶部导航栏（AppHeader）或工作台首页增加明确的"产品全景"入口链接，提升可见性。

3. **搜索集成**：产品全景的 Epic/Feature/FunctionPoint 数据可接入全局搜索（AppHeader 搜索框），提升检索能力。

---

## 1. 背景与目标

portal-shell 当前在工作台首页展示一个三层「架构图」组件，用于快速切换产品域（`risk/mkt/dex/dfd/dmt/admin`）并进入子应用（iframe）。该架构图目前是**静态写死**的数据与层级。

本方案（方案B）的目标是：

- 将工作台首页的三层展示替换为“产品全景”数据（来自 Neo4j 的 ProductDomain/Epic/Feature/FunctionPoint），并在 UI 上继续保持三层结构：
  - **应用层**：Epic
  - **数据中台层**：Feature
  - **数据资源层**：FunctionPoint
- 支持点击交互：点击卡片可进入相应的“产品全景详情”或触发既有导航能力（需要定义映射策略）。

本设计文档以 portal-shell 的现有实现为约束，明确需要新增/调整的模块、数据契约与交互方式，供后续开发落地。

## 2. 现状实现（基于当前代码）

### 2.1 页面编排与渲染分支

portal-shell 所有主路由均渲染同一个容器页 [index.vue](file:///Users/wenbo/Documents/project/portal-shell/src/pages/index.vue)。

- 顶部：域菜单与全局搜索 [AppHeader.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/AppHeader.vue)
- 左侧：EPIC/Feature 树与“工作台首页”入口 [AppSider.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/AppSider.vue)
- 主内容区互斥：
  - 工作台首页：`activeTopKey[0] === 'home' && !currentFeature` 时渲染 [WorkbenchHome.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/WorkbenchHome.vue)
  - 域概览页：无 feature 时渲染 [DomainHome.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/DomainHome.vue)
  - 子应用页：有 feature 时渲染 [SubAppPage.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/SubAppPage.vue)

关键分支可见 [index.vue:L28-L58](file:///Users/wenbo/Documents/project/portal-shell/src/pages/index.vue#L28-L58)。

### 2.2 当前“架构图”组件

架构图组件为 [ArchitectureMap.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/ArchitectureMap.vue)，特征：

- 3 个层级标题固定：应用层/数据中台层/数据资源层
- 每层的卡片数据通过本文件内 `appDomains/platformDomains/displayItems` 写死
- 可点击层：应用层与数据中台层卡片点击后 `emit('switchDomain', key)`
- 数据资源层：只读展示，不触发点击

### 2.3 switchDomain 事件链路（从架构图点击到实际跳转）

当前架构图的点击最终会走到 `pages/index.vue` 的 `switchDomain(key)`（注意：这里的 key 期望是 portal-shell 的 Domain key，例如 `risk`）。

- 架构图触发：见 [ArchitectureMap.vue:L79-L81](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/ArchitectureMap.vue#L79-L81)
- 工作台首页透传：见 [WorkbenchHome.vue:L131-L133](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/WorkbenchHome.vue#L131-L133)
- 容器页统一处理：见 [index.vue:L223-L239](file:///Users/wenbo/Documents/project/portal-shell/src/pages/index.vue#L223-L239)

`switchDomain` 现有策略：

- 优先进入该域的“第一个 Epic 的第一个 Feature”（直接打开子应用页）
- 若该域没有 Feature，则只切换顶部域并显示域概览页

这意味着：**只要继续复用 `switchDomain`，就必须保证点击参数是 portal-shell 的 Domain key**。

### 2.4 数据来源：domainDictionary.ts（静态字典）

portal-shell 当前所有域/EPIC/Feature 的结构来自 [domainDictionary.ts](file:///Users/wenbo/Documents/project/portal-shell/src/config/domainDictionary.ts)。

- `DomainItem`：`key/name/shortName/port/icon/desc/epics`（见 [domainDictionary.ts:L29-L38](file:///Users/wenbo/Documents/project/portal-shell/src/config/domainDictionary.ts#L29-L38)）
- `EpicItem`：`key/displayName/domain/features`（见 [domainDictionary.ts:L19-L27](file:///Users/wenbo/Documents/project/portal-shell/src/config/domainDictionary.ts#L19-L27)）
- `FeatureItem`：包含 `url`（用于 iframe 加载）与展示信息（见 [domainDictionary.ts:L6-L17](file:///Users/wenbo/Documents/project/portal-shell/src/config/domainDictionary.ts#L6-L17)）

### 2.5 路由约束（重要）

路由定义见 [router/index.ts](file:///Users/wenbo/Documents/project/portal-shell/src/router/index.ts)。

- `createWebHistory('/home/')` 作为 base
- 同时 routes 中仍然使用 `path: '/home'`、`'/home/:domain'`、`'/home/:domain/:feature'`

因此在实际部署环境中，页面 URL 会表现为 `/home/home`、`/home/home/:domain/:feature`（这是当前 demo 页面地址的来源）。新增页面/路由时，需要沿用这一约束，避免出现双重 `/home` 前缀。

## 3. 方案B的产品层级映射

产品文档定义的层级为：

```
Vision/Project
  └─ ProductDomain
       └─ Epic（应用）
            └─ Feature
                 └─ FunctionPoint
```

为适配 portal-shell 的三层架构图，本方案采用以下映射：

- **应用层**：Epic
- **数据中台层**：Feature
- **数据资源层**：FunctionPoint

额外约定：三层内容均按 ProductDomain 分组展示（每个产品域一组）。

## 4. 交互设计（与现有 portal-shell 行为兼容）

### 4.1 两种跳转语义（必须二选一或同时支持）

由于 portal-shell 现有导航的入口是 `Domain key → Feature key → iframe URL`，而产品全景数据的标识是 `ProductDomain.code / Epic.uri / Feature.uri / FunctionPoint.uri`，二者天然不一致。

因此点击行为有两种设计路径：

#### A. 点击进入“产品全景详情页”（推荐作为默认）

- 架构图卡片点击后，进入 portal-shell 内的“产品全景页面/详情页”
- 不影响现有 `switchDomain()` 语义，也不需要把 Neo4j 的对象强行映射到子应用 Feature

落地方式：

- 新增路由（示例）：
  - `/home/product-overview`：全景页
  - `/home/product-overview/:domainCode`：产品域详情
  - `/home/product-overview/epic/:epicUri`：Epic 详情（可选）
- 架构图组件 emit 新事件（见 6.2）给上层，容器页接到后 `router.push(...)`

#### B. 点击触发既有子应用跳转（需要维护“映射表”）

- 将产品全景里的某些节点（比如 Epic 或 Feature）映射到 portal-shell 的 `FeatureItem.key`（iframe 子应用入口）
- 点击后复用 `navigateToFeature(featureKey)`

落地方式：

- 新增 `productOverviewToPortalFeatureMap`：
  - key：`Epic.uri` 或 `Feature.uri`
  - value：portal-shell `FeatureItem.key`
- 映射缺失时降级为进入产品全景详情页（A）或 toast 提示

### 4.2 建议的点击规则

- 点击 ProductDomain：进入产品域详情页（A）
- 点击 Epic：进入 Epic 详情（A），若配置了映射表则可“一键打开对应子应用”（B）
- 点击 Feature：默认进入产品域详情页并定位到该 Feature（A，支持 anchor/scroll），可选支持 B
- 点击 FunctionPoint：默认只读（不跳转），或进入详情页定位（A）

## 5. 数据契约（来自产品文档，供前端消费）

### 5.1 后端接口

产品文档建议接口（由 Neo4j 实时读取）：

- `GET /api/v1/product-overview/`：全景页数据（ProductDomain + Epic）
- `GET /api/v1/product-overview/domain/:code`：产品域详情（Epic + Feature + FunctionPoint）
- `GET /api/v1/product-overview/epic/:uri`：Epic 详情（可选）

### 5.2 为“三层架构图”补齐的数据需求

要在一个组件中同时展示 Epic/Feature/FunctionPoint 三层，至少需要：

- 方案 1（推荐）：在前端并发拉取所有产品域详情 `domain/:code`，组装后渲染
  - 优点：不改后端接口
  - 风险：网络请求数较多（产品域 * 1）
- 方案 2：后端新增专用接口（推荐中长期）：
  - `GET /api/v1/product-overview/architecture-map`
  - 直接返回适配三层展示的聚合结构，减少前端组装成本与请求数

建议聚合结构（示例）：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "domains": [
      {
        "code": "PD-COM",
        "label": "数字社区门户",
        "status": "已上线",
        "epics": [
          {
            "uri": "Epic:EPIC-COM_CONTENT_MANAGE",
            "label": "内容管理",
            "status": "已上线",
            "features": [
              {
                "uri": "Feature:FEAT-COM-CONTENT-CATEGORY",
                "label": "分类管理",
                "status": "已上线",
                "functionPoints": [
                  {
                    "uri": "FunctionPoint:FPOINT-...",
                    "label": "分类管理功能点",
                    "status": "规划中"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 6. 前端改造设计（portal-shell）

### 6.1 新增模块

建议新增：

- `src/api/productOverview.ts`：封装 fetch 与错误处理
- `src/types/productOverview.ts`：与后端契约一致的类型
- `src/config/productOverviewMap.ts`（可选）：产品全景节点到 portal-shell 子应用 feature 的映射表

portal-shell 当前未引入 axios，建议使用浏览器 `fetch`（与现有依赖一致，见 [package.json](file:///Users/wenbo/Documents/project/portal-shell/package.json)）。

### 6.2 ArchitectureMap 组件重构

将 [ArchitectureMap.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/ArchitectureMap.vue) 从“静态卡片”升级为“数据驱动组件”。

核心变更点：

- props：注入数据（推荐由 WorkbenchHome 或 pages/index 负责拉取并传入，避免组件内部做全局请求）
- emits：支持更丰富的点击事件，不再只传 `domain.key`

建议事件：

```ts
type ArchitectureNodeType = 'productDomain' | 'epic' | 'feature' | 'functionPoint'

emit('select', {
  type: ArchitectureNodeType,
  id: string,        // code 或 uri
  label: string,
  domainCode?: string
})
```

与现有 `switchDomain(key: string)` 的兼容策略：

- 在 WorkbenchHome 中将 `@select` 适配成两类处理：
  - 若选中的是 portal-shell Domain（旧逻辑）则仍 emit `switchDomain`
  - 若选中的是产品全景节点，则走 `router.push('/home/product-overview/...')` 或走映射表打开子应用

### 6.3 WorkbenchHome 作为“数据装配层”

当前 [WorkbenchHome.vue](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/WorkbenchHome.vue) 仅负责布局与事件透传。方案B建议它承担：

- 在进入工作台首页时拉取产品全景数据（或由 pages/index 提前拉取）
- 将数据传给 ArchitectureMap
- 处理加载态/失败态（使用 `a-spin` / `a-result` / `Message`）

### 6.4 新增产品全景页面（用于详情承接）

若采用 4.1-A（推荐），需要新增页面：

- `src/pages/product-overview/index.vue`
- `src/pages/product-overview/domain.vue`（或目录式 `DomainDetail/index.vue`）

并在 [router/index.ts](file:///Users/wenbo/Documents/project/portal-shell/src/router/index.ts) 中加路由。由于当前 router base 为 `'/home/'`，建议新增路由仍以 `'/home/...'` 方式声明，保持与现有 `/home/home` 一致的最终表现。

## 7. UI 与样式约束

### 7.1 现有布局约束

当前架构图使用 grid：`grid-template-columns: repeat(3, 1fr)`（移动端 2 列），并使用设计 token：

- `--app-surface-bg/--app-border-color/--app-radius-*` 见 [tokens.css](file:///Users/wenbo/Documents/project/portal-shell/src/styles/tokens.css)

方案B建议沿用现有样式与结构，只替换数据与交互，不引入新的 UI 框架。

### 7.2 信息密度与裁剪

产品全景的 Feature/FunctionPoint 可能数量较多，建议：

- 架构图层级仅展示 Top-N（例如每个 ProductDomain 下每层最多展示 6 个），其余通过“更多”入口进入详情页
- 名称过长使用 ellipsis（现有 `.domain-card__name` 已实现）

## 8. 异常与降级策略

结合产品文档的“数据质量说明”，在 portal-shell 侧的建议：

- API 超时/失败：显示错误态卡片，并提供重试
- 某个 ProductDomain 无 Feature/FP：该层显示空态或展示 `-`
- label/id 为空：展示 uri/code + “数据待完善”

## 9. 安全与兼容性

- portal-shell 通过 iframe 加载子应用，已启用 `sandbox`（见 [SubAppPage.vue:L57-L66](file:///Users/wenbo/Documents/project/portal-shell/src/components/layout/SubAppPage.vue#L57-L66)）。产品全景页面若需要嵌入外部内容，需复用相同策略。
- 调用 `http://118.196.79.130` 与 `:8081` 时需关注 CORS：建议后端允许 portal-shell 域名的跨域请求，或在 nginx 做同域转发。

## 10. 验收标准（落地检查点）

- 工作台首页架构图三层展示来自产品全景数据（非静态写死）
- 点击 ProductDomain/Epic 能进入产品全景详情页，且 URL 可直达刷新不丢状态
- 数据为空/接口失败时有明确的降级与错误提示
- 不影响现有 portal-shell 的域切换、侧边栏、iframe 子应用打开能力


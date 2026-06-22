# Portal Shell

> Qiankun Micro Frontend Container · 飞书 / CLI 入口

[![Vue](https://img.shields.io/badge/Vue-3-4FC08D)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)]()
[![qiankun](https://img.shields.io/badge/qiankun-micro--frontend-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 📌 这是什么

基于 **Qiankun** 的微前端门户容器，统一集成 43 个子应用入口：

- **飞书工作台入口**：从飞书跳转进入各个子应用
- **CLI 工具入口**：开发/部署工具的统一容器
- **跨子应用通信**：qiankun 的 props + actions 机制

## 🏗️ 技术栈

- **Vue 3** + TypeScript + Vite
- **Qiankun** 微前端框架
- **Arco Design** UI 组件库
- **Pinia** 状态管理
- **Vue Router** 路由

## 📂 目录结构

```
portal-shell/
├── src/
│   ├── micro/              # 微前端注册 + 生命周期
│   ├── views/              # 页面级组件
│   ├── components/         # 通用组件
│   ├── router/             # 路由配置（包含子应用）
│   ├── store/              # Pinia store
│   └── utils/              # 工具函数
├── public/                 # 静态资源
├── config/                 # 构建/部署配置
└── tests/                  # 单元测试
```

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务
pnpm dev

# 3. 访问 http://localhost:8443/home/
```

## 🔗 关联项目

- **fintech-data-portal** - 数据门户子应用
- **wenbodemo.com** - 个人主页 + Wiki
- **OpenClaw Agent Team** - 16 agent 协作平台

## 📊 部署

| 环境 | 地址 | 状态 |
|:---|:---|:---:|
| 生产 | https://118.196.79.130:8443 | ✅ 43 子应用已部署 |

---

👤 **文博** · [GitHub](https://github.com/wenbo0527) · [知乎](https://www.zhihu.com/people/wenbo-67-38)

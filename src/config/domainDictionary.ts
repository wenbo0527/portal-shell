/**
 * 产品域字典映射配置
 * 维护所有产品域、EPIC、Feature 与实际页面 URL 的映射关系
 */

export interface FeatureItem {
  key: string           // Feature 唯一标识
  name: string          // 中文名称
  epic: string         // 所属 EPIC
  epicName: string     // EPIC 中文名称
  domain: string        // 所属产品域
  domainName: string    // 产品域中文名称
  url: string           // 子应用访问地址
  icon: string          // 图标 emoji
  desc: string          // 功能描述
  color: string         // 标签颜色
}

export interface EpicItem {
  key: string           // EPIC 唯一标识
  name: string          // EPIC 名称 (如 EPIC-RISK-EXT)
  displayName: string   // 中文显示名称
  icon?: string         // 图标
  domain: string        // 所属产品域
  domainName: string    // 产品域中文名称
  features: FeatureItem[] // 子功能列表
}

export interface DomainItem {
  key: string           // 产品域标识 (risk, mkt, dex, dmt, admin)
  name: string          // 中文名称
  shortName: string     // 简称
  port: number          // 服务端口
  icon: string          // 图标
  desc: string          // 描述
  epics: EpicItem[]     // EPIC 列表
  menus?: SubMenuItem[] // 子应用菜单配置（可选）
}

export interface SubMenuItem {
  key: string
  title: string
  children?: SubMenuItem[]
}

// ==================== 数字风险域 ====================
const riskDomain: DomainItem = {
  key: 'risk',
  name: '数字风险',
  shortName: '数字风险',
  port: 8001,
  icon: '🛡️',
  desc: '外数生命周期管理、离线模型平台',
  menus: [
    {
      key: 'lifecycle',
      title: '外数生命周期',
      children: [
        { key: '/external-data/lifecycle', title: '生命周期总览' },
        { key: '/external-data/archive', title: '外数档案管理' },
        { key: '/external-data/evaluation', title: '外数评估中心' },
        { key: '/external-data/service-scene', title: '服务场景入口' },
        { key: '/external-data/service-create', title: '外数服务创建（新）' },
        { key: '/external-data/service', title: '服务任务列表' },
        { key: '/external-data/sample-preparation', title: '样本表准备' },
        { key: '/external-data/validation-template', title: '服务校验模版管理' },
        { key: '/external-data/online-call-application', title: '外数线上调用服务申请' }
      ]
    },
    {
      key: 'budget',
      title: '预算管理',
      children: [
        { key: '/budget/overview', title: '预算总览' },
        { key: '/budget/list', title: '预算列表' },
        { key: '/budget/monitor', title: '预算监控' },
        { key: '/budget/contracts', title: '合同管理' },
        { key: '/budget/settlement', title: '结算管理' }
      ]
    },
    {
      key: 'model',
      title: '离线模型平台',
      children: [
        { key: '/model-offline-analysis/feature-center', title: '特征中心' },
        { key: '/model-offline-analysis/model-register', title: '模型注册' },
        { key: '/model-offline-analysis/model-backtrack', title: '模型回溯' },
        { key: '/model-offline-analysis/task-management', title: '任务管理' },
        { key: '/model-offline-analysis/model-evaluation', title: '模型评估' }
      ]
    }
  ],
  epics: [
    {
      key: 'EPIC-RISK-EXT',
      name: 'EPIC-RISK-EXT',
      displayName: '外数生命周期',
      domain: 'risk',
      domainName: '数字风险域',
      features: [
        { key: 'risk-ext-lifecycle', name: '生命周期总览', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/external-data/lifecycle', icon: '🔄', desc: '外部数据全生命周期管理', color: 'blue' },
        { key: 'risk-ext-archive', name: '外数档案', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/external-data/archive', icon: '📁', desc: '外部数据档案管理', color: 'blue' },
        { key: 'risk-ext-service', name: '数据服务', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/external-data/service', icon: '🛠️', desc: '外部数据服务管理', color: 'blue' },
        { key: 'risk-ext-sample', name: '样本表准备', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/external-data/sample-preparation', icon: '📊', desc: '样本表准备', color: 'blue' },
        { key: 'risk-ext-evaluation', name: '评估中心', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/external-data/evaluation', icon: '⭐', desc: '外部数据质量评估', color: 'blue' },
        { key: 'risk-ext-budget', name: '预算管理', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/budget/overview', icon: '💰', desc: '外部数据预算编制与控制', color: 'blue' },
        { key: 'risk-ext-contract', name: '合同管理', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/budget/contracts', icon: '📝', desc: '外部数据合同管理', color: 'blue' },
        { key: 'risk-ext-settle', name: '结算管理', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/budget/settlement', icon: '📊', desc: '外部数据结算对账', color: 'blue' },
        { key: 'risk-ext-monitor', name: '预算监控', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/budget/monitor', icon: '📈', desc: '预算执行监控', color: 'blue' },
        { key: 'risk-ext-accounting', name: '核算流程', epic: 'EPIC-RISK-EXT', epicName: '外数生命周期', domain: 'risk', domainName: '数字风险域', url: '/risk/budget/accounting', icon: '🔢', desc: '核算流程管理', color: 'blue' },
      ]
    },
    {
      key: 'EPIC-RISK-MODEL',
      name: 'EPIC-RISK-MODEL',
      displayName: '离线模型平台',
      domain: 'risk',
      domainName: '数字风险域',
      features: [
        { key: 'risk-model-feature', name: '特征中心', epic: 'EPIC-RISK-MODEL', epicName: '离线模型平台', domain: 'risk', domainName: '数字风险域', url: '/risk/model-offline-analysis/feature-center', icon: '🎯', desc: '特征指标管理', color: 'purple' },
        { key: 'risk-model-register', name: '模型注册', epic: 'EPIC-RISK-MODEL', epicName: '离线模型平台', domain: 'risk', domainName: '数字风险域', url: '/risk/model-offline-analysis/model-register', icon: '📦', desc: '离线模型注册与版本', color: 'purple' },
        { key: 'risk-model-backtrack', name: '模型回溯', epic: 'EPIC-RISK-MODEL', epicName: '离线模型平台', domain: 'risk', domainName: '数字风险域', url: '/risk/model-offline-analysis/model-backtrack', icon: '🔙', desc: '模型变量回溯分析', color: 'purple' },
        { key: 'risk-model-task', name: '任务管理', epic: 'EPIC-RISK-MODEL', epicName: '离线模型平台', domain: 'risk', domainName: '数字风险域', url: '/risk/model-offline-analysis/task-management', icon: '📋', desc: '离线任务管理', color: 'purple' },
        { key: 'risk-model-evaluation', name: '模型评估', epic: 'EPIC-RISK-MODEL', epicName: '离线模型平台', domain: 'risk', domainName: '数字风险域', url: '/risk/model-offline-analysis/model-evaluation', icon: '📐', desc: '模型效果评估', color: 'purple' },
      ]
    }
  ]
}

// ==================== 营销域 ====================
const mktDomain: DomainItem = {
  key: 'mkt',
  name: '数字营销',
  shortName: '数字营销',
  port: 8002,
  icon: '📢',
  desc: '权益中心、客群中心、营销画布、触达系统、人工电销工作台',
  menus: [
    {
      key: 'canvas',
      title: '营销画布',
      children: [
        { key: '/tasks', title: '画布列表页' }
      ]
    },
    {
      key: 'benefit',
      title: '权益中心',
      children: [
        { key: '/benefit', title: '权益首页' },
        { key: '/benefit/template', title: '券模板管理' },
        { key: '/benefit/management', title: '券管理' },
        { key: '/benefit/package', title: '券包管理' },
        { key: '/benefit/inventory', title: '券库存管理' },
        { key: '/benefit/statistics', title: '权益统计' },
        { key: '/benefit/logs', title: '权益日志' },
        { key: '/global', title: '全局规则' }
      ]
    },
    {
      key: 'customer',
      title: '客群中心',
      children: [
        { key: '/customer', title: '客群首页' },
        { key: '/customer/tag-system', title: '标签管理' },
        { key: '/customer/tag-table', title: '标签表管理' },
        { key: '/customer/list', title: '客群列表' },
        { key: '/customer/selector', title: '客群圈选' },
        { key: '/customer/delete-approval', title: '客群删除审批' },
        { key: '/customer/lifecycle/rules', title: '生命周期规则配置' },
        { key: '/customer/lifecycle/analysis', title: '生命周期分析' },
        { key: '/customer/lifecycle/monitor', title: '生命周期监控' }
      ]
    },
    {
      key: 'touch',
      title: '触达系统',
      children: [
        { key: '/touch', title: '触达首页' },
        { key: '/touch/system/overview', title: '系统概览' },
        { key: '/touch/system/field', title: '字段管理' },
        { key: '/touch/policy/overview', title: '策略模板管理' },
        { key: '/touch/policy/stats', title: '触达数据概览' },
        { key: '/touch/channel/manual-call', title: '人工外呼模板' },
        { key: '/touch/channel/sms', title: '短信模板' },
        { key: '/touch/channel/ai-call', title: 'AI外呼模板' },
        { key: '/touch/channel/alert', title: '预警管理' },
        { key: '/touch/channel/freq', title: '全局频控' },
        { key: '/touch/channel/blacklist', title: '黑名单管理' },
        { key: '/touch/channel/vendor', title: '供应商管理' },
        { key: '/touch/query', title: '触达明细查询' },
        { key: '/touch/query/sms', title: '短信发送记录' },
        { key: '/touch/query/ai-call', title: 'AI外呼记录' },
        { key: '/touch/query/manual-call', title: '人工外呼记录' },
        { key: '/touch/query/marketing', title: '营销记录查询' },
        { key: '/touch/manual-sms', title: '手动短信' }
      ]
    },
    {
      key: 'call',
      title: '人工电销工作台',
      children: [
        { key: '/call/tasks', title: '呼叫任务' },
        { key: '/call/records', title: '外呼记录' },
        { key: '/call/callback', title: '未接回调' },
        { key: '/call/agent', title: '坐席管理' },
        { key: '/call/skill-group', title: '技能组管理' },
        { key: '/call/org', title: '组织架构' },
        { key: '/call/realtime', title: '实时监控' },
        { key: '/call/agent-report', title: '坐席报表' },
        { key: '/call/ops-report', title: '运营报表' },
        { key: '/call/quality/list', title: '质检列表' },
        { key: '/call/quality/rules', title: '质检规则' },
        { key: '/call/quality/appeal', title: '申诉管理' },
        { key: '/call/script', title: '话术模板' },
        { key: '/call/sms-template', title: '短信模板' },
        { key: '/call/config', title: '外呼配置' }
      ]
    }
  ],
  epics: [
    {
      key: 'EPIC-MKT-BENEFIT',
      name: 'EPIC-MKT-BENEFIT',
      displayName: '权益中心',
      domain: 'mkt',
      domainName: '营销域',
      features: [
        { key: 'mkt-benefit-dashboard', name: '权益首页', epic: 'EPIC-MKT-BENEFIT', epicName: '权益中心', domain: 'mkt', domainName: '营销域', url: '/mkt/benefit/dashboard', icon: '🏠', desc: '权益中心首页', color: 'orange' },
        { key: 'mkt-benefit-template', name: '券模板管理', epic: 'EPIC-MKT-BENEFIT', epicName: '权益中心', domain: 'mkt', domainName: '营销域', url: '/mkt/benefit/template', icon: '📋', desc: '优惠券模板配置', color: 'orange' },
        { key: 'mkt-benefit-management', name: '券管理', epic: 'EPIC-MKT-BENEFIT', epicName: '权益中心', domain: 'mkt', domainName: '营销域', url: '/mkt/benefit/management', icon: '🎫', desc: '优惠券管理', color: 'orange' },
        { key: 'mkt-benefit-package', name: '券包管理', epic: 'EPIC-MKT-BENEFIT', epicName: '权益中心', domain: 'mkt', domainName: '营销域', url: '/mkt/benefit/package', icon: '🎁', desc: '权益包组合管理', color: 'orange' },
        { key: 'mkt-benefit-inventory', name: '券库存管理', epic: 'EPIC-MKT-BENEFIT', epicName: '权益中心', domain: 'mkt', domainName: '营销域', url: '/mkt/benefit/inventory', icon: '📦', desc: '优惠券库存查询', color: 'orange' },
        { key: 'mkt-benefit-stats', name: '权益统计', epic: 'EPIC-MKT-BENEFIT', epicName: '权益中心', domain: 'mkt', domainName: '营销域', url: '/mkt/benefit/statistics', icon: '📊', desc: '权益发放统计', color: 'orange' },
      ]
    },
    {
      key: 'EPIC-MKT-CROWD',
      name: 'EPIC-MKT-CROWD',
      displayName: '客群中心',
      domain: 'mkt',
      domainName: '营销域',
      features: [
        { key: 'mkt-crowd-home', name: '客群首页', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer', icon: '🏠', desc: '客群中心首页', color: 'green' },
        { key: 'mkt-crowd-tag', name: '标签管理', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/tag-system', icon: '🏷️', desc: '标签系统管理', color: 'green' },
        { key: 'mkt-crowd-tag-table', name: '标签表管理', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/tag-table', icon: '📋', desc: '标签表配置', color: 'green' },
        { key: 'mkt-crowd-list', name: '客群列表', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/list', icon: '👥', desc: '客户分群管理', color: 'green' },
        { key: 'mkt-crowd-selector', name: '客群圈选', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/selector', icon: '🎯', desc: '人群圈选工具', color: 'green' },
        { key: 'mkt-crowd-delete-approval', name: '客群删除审批', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/delete-approval', icon: '✅', desc: '删除审批流程', color: 'green' },
        { key: 'mkt-crowd-lifecycle-rules', name: '生命周期规则配置', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/lifecycle/rules', icon: '⚙️', desc: '生命周期规则配置', color: 'green' },
        { key: 'mkt-crowd-lifecycle-analysis', name: '生命周期分析', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/lifecycle/analysis', icon: '📊', desc: '生命周期分析视图', color: 'green' },
        { key: 'mkt-crowd-lifecycle-monitor', name: '生命周期监控', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/lifecycle/monitor', icon: '📈', desc: '生命周期监控面板', color: 'green' },
        { key: 'mkt-crowd-idmap', name: 'ID-MAPPING', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/idmap', icon: '🔗', desc: '多渠道用户ID映射', color: 'green' },
        { key: 'mkt-crowd-portrait', name: '画像分析', epic: 'EPIC-MKT-CROWD', epicName: '客群中心', domain: 'mkt', domainName: '营销域', url: '/mkt/customer/portrait', icon: '👤', desc: '客户画像分析', color: 'green' },
      ]
    },
    {
      key: 'EPIC-MKT-CANVAS',
      name: 'EPIC-MKT-CANVAS',
      displayName: '营销画布',
      domain: 'mkt',
      domainName: '营销域',
      features: [
        { key: 'mkt-canvas-list', name: '画布列表', epic: 'EPIC-MKT-CANVAS', epicName: '营销画布', domain: 'mkt', domainName: '营销域', url: '/mkt/tasks', icon: '📝', desc: '营销流程列表', color: 'cyan' },
        { key: 'mkt-canvas-editor', name: '画布编辑器', epic: 'EPIC-MKT-CANVAS', epicName: '营销画布', domain: 'mkt', domainName: '营销域', url: '/mkt/canvas', icon: '🎨', desc: '拖拽式流程编排', color: 'cyan' },
      ]
    },
    {
      key: 'EPIC-MKT-REACH',
      name: 'EPIC-MKT-REACH',
      displayName: '触达系统',
      domain: 'mkt',
      domainName: '营销域',
      features: [
        { key: 'mkt-reach-overview', name: '触达首页', epic: 'EPIC-MKT-REACH', epicName: '触达系统', domain: 'mkt', domainName: '营销域', url: '/mkt/touch', icon: '📡', desc: '触达系统首页', color: 'magenta' },
        { key: 'mkt-reach-channel', name: '渠道管理', epic: 'EPIC-MKT-REACH', epicName: '触达系统', domain: 'mkt', domainName: '营销域', url: '/mkt/touch/channel', icon: '📡', desc: '触达渠道配置', color: 'magenta' },
        { key: 'mkt-reach-policy', name: '策略管理', epic: 'EPIC-MKT-REACH', epicName: '触达系统', domain: 'mkt', domainName: '营销域', url: '/mkt/touch/policy/overview', icon: '📋', desc: '触达策略配置', color: 'magenta' },
        { key: 'mkt-reach-query', name: '触达查询', epic: 'EPIC-MKT-REACH', epicName: '触达系统', domain: 'mkt', domainName: '营销域', url: '/mkt/touch/query', icon: '🔍', desc: '触达记录查询', color: 'magenta' },
        { key: 'mkt-reach-sms', name: '手动短信', epic: 'EPIC-MKT-REACH', epicName: '触达系统', domain: 'mkt', domainName: '营销域', url: '/mkt/touch/manual-sms', icon: '💬', desc: '手动短信发送', color: 'magenta' },
        { key: 'mkt-reach-system', name: '系统管理', epic: 'EPIC-MKT-REACH', epicName: '触达系统', domain: 'mkt', domainName: '营销域', url: '/mkt/touch/system', icon: '⚙️', desc: '触达系统配置', color: 'magenta' },
      ]
    },
    {
      key: 'EPIC-MKT-CALL',
      name: 'EPIC-MKT-CALL',
      displayName: '人工电销工作台',
      domain: 'mkt',
      domainName: '营销域',
      features: [
        { key: 'mkt-call', name: '电销工作台', epic: 'EPIC-MKT-CALL', epicName: '人工电销工作台', domain: 'mkt', domainName: '营销域', url: '/mkt/call', icon: '📞', desc: '人工外呼任务管理', color: 'red' },
      ]
    }
  ]
}

// ==================== 数据探索域 ====================
const dexDomain: DomainItem = {
  key: 'dex',
  name: '数据探索',
  shortName: '数据探索',
  port: 8003,
  icon: '🔍',
  desc: '客户360全景能力、指标看板、统一分析工作台',
  menus: [
    {
      key: 'customer360',
      title: '客户360',
      children: [
        { key: '/customer360', title: '客户搜索页' }
      ]
    },
    {
      key: 'metric',
      title: '指标看板',
      children: [
        { key: '/indicator-dashboard', title: '看板首页' }
      ]
    },
    {
      key: 'analysis',
      title: '统一分析工作台',
      children: [
        { key: '/analytics-workbench', title: '工作台首页' }
      ]
    }
  ],
  epics: [
    {
      key: 'EPIC-DEX-C360',
      name: 'EPIC-DEX-C360',
      displayName: '客户360全景能力',
      domain: 'dex',
      domainName: '数据探索域',
      features: [
        { key: 'dex-c360-overview', name: '客户搜索页', epic: 'EPIC-DEX-C360', epicName: '客户360全景能力', domain: 'dex', domainName: '数据探索域', url: '/dex/dex/customer360', icon: '📊', desc: '客户数据搜索与详情', color: 'blue' },
      ]
    },
    {
      key: 'EPIC-DEX-METRIC',
      name: 'EPIC-DEX-METRIC',
      displayName: '指标看板',
      domain: 'dex',
      domainName: '数据探索域',
      features: [
        { key: 'dex-metric-dashboard', name: '看板首页', epic: 'EPIC-DEX-METRIC', epicName: '指标看板', domain: 'dex', domainName: '数据探索域', url: '/dex/dex/indicator-dashboard', icon: '📈', desc: '业务指标可视化', color: 'green' },
      ]
    },
    {
      key: 'EPIC-DEX-ANALYSIS',
      name: 'EPIC-DEX-ANALYSIS',
      displayName: '统一分析工作台',
      domain: 'dex',
      domainName: '数据探索域',
      features: [
        { key: 'dex-analysis', name: '工作台首页', epic: 'EPIC-DEX-ANALYSIS', epicName: '统一分析工作台', domain: 'dex', domainName: '数据探索域', url: '/dex/dex/analytics-workbench', icon: '🔬', desc: '自助分析工具', color: 'purple' },
      ]
    }
  ]
}

// ==================== 数据管理域 ====================
const dmtDomain: DomainItem = {
  key: 'dmt',
  name: '数据管理',
  shortName: '数据管理',
  port: 8006,
  icon: '📊',
  desc: '元数据管理、数据服务、数据标准',
  epics: [
    {
      key: 'EPIC-DMT-META',
      name: 'EPIC-DMT-META',
      displayName: '元数据管理',
      domain: 'dmt',
      domainName: '数据管理域',
      features: [
        { key: 'dmt-meta-query', name: '元数据查询', epic: 'EPIC-DMT-META', epicName: '元数据管理', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/metadata', icon: '🔍', desc: '元数据检索', color: 'blue' },
        { key: 'dmt-meta-model', name: '数据模型', epic: 'EPIC-DMT-META', epicName: '元数据管理', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/data-models', icon: '🏗️', desc: '数据模型管理', color: 'blue' },
      ]
    },
    {
      key: 'EPIC-DMT-SVC',
      name: 'EPIC-DMT-SVC',
      displayName: '数据服务',
      domain: 'dmt',
      domainName: '数据管理域',
      features: [
        { key: 'dmt-svc-register', name: '服务注册', epic: 'EPIC-DMT-SVC', epicName: '数据服务', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/service', icon: '📝', desc: '数据服务注册', color: 'green' },
        { key: 'dmt-svc-publish', name: '服务发布', epic: 'EPIC-DMT-SVC', epicName: '数据服务', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/service/publish', icon: '🚀', desc: '数据服务发布', color: 'green' },
        { key: 'dmt-svc-monitor', name: '服务监控', epic: 'EPIC-DMT-SVC', epicName: '数据服务', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/service/monitor', icon: '📊', desc: '服务调用监控', color: 'green' },
      ]
    },
    {
      key: 'EPIC-DMT-STD',
      name: 'EPIC-DMT-STD',
      displayName: '数据标准',
      domain: 'dmt',
      domainName: '数据管理域',
      features: [
        { key: 'dmt-std-domain', name: '标准领域', epic: 'EPIC-DMT-STD', epicName: '数据标准', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/data-standard', icon: '📐', desc: '数据标准领域', color: 'orange' },
        { key: 'dmt-std-manage', name: '标准管理', epic: 'EPIC-DMT-STD', epicName: '数据标准', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/data-standard/manage', icon: '📋', desc: '数据标准详情', color: 'orange' },
      ]
    },
    {
      key: 'EPIC-DMT-CONCEPT',
      name: 'EPIC-DMT-CONCEPT',
      displayName: '业务概念',
      domain: 'dmt',
      domainName: '数据管理域',
      features: [
        { key: 'dmt-concept', name: '业务概念', epic: 'EPIC-DMT-CONCEPT', epicName: '业务概念', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/business-concept', icon: '💡', desc: '业务术语管理', color: 'cyan' },
        { key: 'dmt-variable-mgmt', name: '变量管理', epic: 'EPIC-DMT-CONCEPT', epicName: '业务概念', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/variable-management', icon: '📝', desc: '变量指标管理', color: 'cyan' },
        { key: 'dmt-variable-map', name: '变量地图', epic: 'EPIC-DMT-CONCEPT', epicName: '业务概念', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/variable-map', icon: '🗺️', desc: '变量关系地图', color: 'cyan' },
      ]
    },
    {
      key: 'EPIC-DMT-SYSTEM',
      name: 'EPIC-DMT-SYSTEM',
      displayName: '系统配置',
      domain: 'dmt',
      domainName: '数据管理域',
      features: [
        { key: 'dmt-docs', name: '文档管理', epic: 'EPIC-DMT-SYSTEM', epicName: '系统配置', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/docs', icon: '📄', desc: '文档管理', color: 'gray' },
        { key: 'dmt-notifications', name: '通知管理', epic: 'EPIC-DMT-SYSTEM', epicName: '系统配置', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/notifications', icon: '🔔', desc: '通知配置', color: 'gray' },
        { key: 'dmt-user-groups', name: '用户组管理', epic: 'EPIC-DMT-SYSTEM', epicName: '系统配置', domain: 'dmt', domainName: '数据管理域', url: '/dmt/dmt/user-groups', icon: '👥', desc: '用户组管理', color: 'gray' },
      ]
    }
  ]
}

// ==================== 通用域 ====================
const adminDomain: DomainItem = {
  key: 'admin',
  name: '通用',
  shortName: '通用',
  port: 8005,
  icon: '⚙️',
  desc: '权限管理、门户管理、通知管理',
  epics: [
    {
      key: 'EPIC-ADMIN-PERM',
      name: 'EPIC-ADMIN-PERM',
      displayName: '权限管理',
      domain: 'admin',
      domainName: '通用域',
      features: [
        { key: 'admin-perm-user', name: '用户管理', epic: 'EPIC-ADMIN-PERM', epicName: '权限管理', domain: 'admin', domainName: '通用域', url: '/admin/admin/permission/user-management', icon: '👤', desc: '平台用户管理', color: 'blue' },
        { key: 'admin-perm-role', name: '角色管理', epic: 'EPIC-ADMIN-PERM', epicName: '权限管理', domain: 'admin', domainName: '通用域', url: '/admin/admin/permission/role-management', icon: '🔐', desc: '角色权限配置', color: 'blue' },
        { key: 'admin-perm-app', name: '应用权限', epic: 'EPIC-ADMIN-PERM', epicName: '权限管理', domain: 'admin', domainName: '通用域', url: '/admin/admin/permission/app-permission', icon: '📱', desc: '应用访问权限', color: 'blue' },
      ]
    },
    {
      key: 'EPIC-ADMIN-NOTICE',
      name: 'EPIC-ADMIN-NOTICE',
      displayName: '通知管理',
      domain: 'admin',
      domainName: '通用域',
      features: [
        { key: 'admin-notice', name: '通知管理', epic: 'EPIC-ADMIN-NOTICE', epicName: '通知管理', domain: 'admin', domainName: '通用域', url: '/admin/admin/notice', icon: '🔔', desc: '系统通知配置', color: 'green' },
      ]
    },
    {
      key: 'EPIC-ADMIN-PORTAL',
      name: 'EPIC-ADMIN-PORTAL',
      displayName: '门户管理',
      domain: 'admin',
      domainName: '通用域',
      features: [
        { key: 'admin-portal', name: '门户管理', epic: 'EPIC-ADMIN-PORTAL', epicName: '门户管理', domain: 'admin', domainName: '通用域', url: '/admin/admin/portal', icon: '🏠', desc: '门户配置管理', color: 'orange' },
      ]
    },
    {
      key: 'EPIC-ADMIN-CONTENT',
      name: 'EPIC-ADMIN-CONTENT',
      displayName: '内容管理',
      domain: 'admin',
      domainName: '通用域',
      features: [
        { key: 'admin-content', name: '内容管理', epic: 'EPIC-ADMIN-CONTENT', epicName: '内容管理', domain: 'admin', domainName: '通用域', url: '/admin/admin/content', icon: '📝', desc: '内容发布管理', color: 'purple' },
      ]
    }
  ]
}

// ==================== 首页 ====================
export const homeDomain: DomainItem = {
  key: 'home',
  name: '首页',
  shortName: 'HOME',
  port: 8000,
  icon: '🏠',
  desc: '企业应用门户首页',
  epics: []
}

// ==================== 全部产品域列表 ====================
// ==================== 数据发现域 DFD ====================
const dfdDomain: DomainItem = {
  key: 'dfd',
  name: '数据发现',
  shortName: '数据发现',
  port: 5185,
  icon: '💎',
  desc: '数据资产运营、资产字典、要素字典、资源字典、统一搜索',
  menus: [
    {
      key: 'asset-ops',
      title: '数据资产运营工具',
      children: [
        { key: '/lineage', title: '资产血缘分析' },
        { key: '/impact-analysis', title: '变更影响分析' }
      ]
    },
    {
      key: 'asset-dict',
      title: '数据资产字典',
      children: [
        { key: '/asset-catalog', title: '资产目录列表' },
        { key: '/favorites', title: '资产收藏' }
      ]
    },
    {
      key: 'element-dict',
      title: '数据要素字典',
      children: [
        { key: '/feature-dict', title: '特征字典列表' },
        { key: '/variable-dict', title: '变量字典列表' },
        { key: '/indicator-dict', title: '指标字典列表' }
      ]
    },
    {
      key: 'resource-dict',
      title: '数据资源字典',
      children: [
        { key: '/data-resources', title: '资源列表' }
      ]
    },
    {
      key: 'unified-search',
      title: '统一搜索',
      children: [
        { key: '/search', title: '统一搜索页' }
      ]
    }
  ],
  epics: [
    {
      key: 'EPIC-DFD-OPS',
      name: 'EPIC-DFD-OPS',
      displayName: '数据资产运营工具',
      domain: 'dfd',
      domainName: '数据发现域',
      features: [
        { key: 'dfd-lineage', name: '资产血缘分析', epic: 'EPIC-DFD-OPS', epicName: '数据资产运营工具', domain: 'dfd', domainName: '数据发现域', url: '/dfd/lineage', icon: '🔗', desc: '数据资产血缘关系分析', color: 'blue' },
        { key: 'dfd-impact', name: '变更影响分析', epic: 'EPIC-DFD-OPS', epicName: '数据资产运营工具', domain: 'dfd', domainName: '数据发现域', url: '/dfd/impact-analysis', icon: '📊', desc: '数据变更影响范围分析', color: 'blue' }
      ]
    },
    {
      key: 'EPIC-DFD-DICT',
      name: 'EPIC-DFD-DICT',
      displayName: '数据资产字典',
      domain: 'dfd',
      domainName: '数据发现域',
      features: [
        { key: 'dfd-catalog', name: '资产目录列表', epic: 'EPIC-DFD-DICT', epicName: '数据资产字典', domain: 'dfd', domainName: '数据发现域', url: '/dfd/asset-catalog', icon: '📁', desc: '数据资产目录管理', color: 'green' },
        { key: 'dfd-favorites', name: '资产收藏', epic: 'EPIC-DFD-DICT', epicName: '数据资产字典', domain: 'dfd', domainName: '数据发现域', url: '/dfd/favorites', icon: '⭐', desc: '我的资产收藏', color: 'green' }
      ]
    },
    {
      key: 'EPIC-DFD-ELEMENT',
      name: 'EPIC-DFD-ELEMENT',
      displayName: '数据要素字典',
      domain: 'dfd',
      domainName: '数据发现域',
      features: [
        { key: 'dfd-feature-dict', name: '特征字典列表', epic: 'EPIC-DFD-ELEMENT', epicName: '数据要素字典', domain: 'dfd', domainName: '数据发现域', url: '/dfd/feature-dict', icon: '🏷️', desc: '特征指标字典', color: 'orange' },
        { key: 'dfd-variable-dict', name: '变量字典列表', epic: 'EPIC-DFD-ELEMENT', epicName: '数据要素字典', domain: 'dfd', domainName: '数据发现域', url: '/dfd/variable-dict', icon: '📝', desc: '变量指标字典', color: 'orange' },
        { key: 'dfd-indicator-dict', name: '指标字典列表', epic: 'EPIC-DFD-ELEMENT', epicName: '数据要素字典', domain: 'dfd', domainName: '数据发现域', url: '/dfd/indicator-dict', icon: '📈', desc: '业务指标字典', color: 'orange' }
      ]
    },
    {
      key: 'EPIC-DFD-RESOURCE',
      name: 'EPIC-DFD-RESOURCE',
      displayName: '数据资源字典',
      domain: 'dfd',
      domainName: '数据发现域',
      features: [
        { key: 'dfd-resources', name: '资源列表', epic: 'EPIC-DFD-RESOURCE', epicName: '数据资源字典', domain: 'dfd', domainName: '数据发现域', url: '/dfd/data-resources', icon: '💾', desc: '数据资源列表', color: 'cyan' }
      ]
    },
    {
      key: 'EPIC-DFD-SEARCH',
      name: 'EPIC-DFD-SEARCH',
      displayName: '统一搜索',
      domain: 'dfd',
      domainName: '数据发现域',
      features: [
        { key: 'dfd-search', name: '统一搜索页', epic: 'EPIC-DFD-SEARCH', epicName: '统一搜索', domain: 'dfd', domainName: '数据发现域', url: '/dfd/search', icon: '🔍', desc: '数据全局搜索', color: 'purple' }
      ]
    }
  ]
}

// ==================== 全部产品域列表 ====================
export const allDomains: DomainItem[] = [
  homeDomain,
  riskDomain,
  mktDomain,
  dexDomain,
  dfdDomain,
  dmtDomain,
  adminDomain
]

// ==================== 快捷导航 ====================
export const quickNavItems = [
  { key: 'mkt-benefit', name: '权益中心', desc: '优惠券、权益包管理', icon: '🎫', domain: 'mkt', path: '/mkt/benefit' },
  { key: 'dex-c360', name: '客户360', desc: '客户全景视图', icon: '👤', domain: 'dex', path: '/dex/customer360' },
  { key: 'risk-ext', name: '外数生命周期', desc: '外部数据全流程管理', icon: '📊', domain: 'risk', path: '/risk/external-data' },
  { key: 'dmt-meta', name: '元数据管理', desc: '元数据查询与血缘', icon: '🔍', domain: 'dmt', path: '/dmt/metadata' },
  { key: 'admin-perm', name: '权限管理', desc: '用户与角色配置', icon: '🔐', domain: 'admin', path: '/admin/permission' },
  { key: 'mkt-canvas', name: '营销画布', desc: '可视化流程编排', icon: '🎨', domain: 'mkt', path: '/mkt/canvas' },
]

// ==================== 辅助函数 ====================

/**
 * 根据 key 查找 Feature
 */
export function getFeatureByKey(key: string): FeatureItem | undefined {
  for (const domain of allDomains) {
    for (const epic of domain.epics) {
      const feature = epic.features.find(f => f.key === key)
      if (feature) return feature
    }
  }
  return undefined
}

/**
 * 根据 EPIC key 查找 EPIC
 */
export function getEpicByKey(key: string): { domain: DomainItem; epic: EpicItem } | undefined {
  for (const domain of allDomains) {
    const epic = domain.epics.find(e => e.key === key)
    if (epic) return { domain, epic }
  }
  return undefined
}

/**
 * 根据产品域 key 获取产品域信息
 */
export function getDomainByKey(key: string): DomainItem | undefined {
  return allDomains.find(d => d.key === key)
}

/**
 * 获取所有 Feature 列表（扁平化）
 */
export function getAllFeatures(): FeatureItem[] {
  const features: FeatureItem[] = []
  for (const domain of allDomains) {
    for (const epic of domain.epics) {
      features.push(...epic.features)
    }
  }
  return features
}

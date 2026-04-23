/**
 * 产品全景类型定义
 */

// 架构节点类型
export type ArchitectureNodeType = 'productDomain' | 'epic' | 'feature' | 'functionPoint';

// 状态类型
export type DomainStatus = '规划中' | '建设中' | '已上线' | '已废弃';
export type FeatureStatus = '构想' | '规划中' | '迭代中' | '测试中' | '已上线' | '已废弃';
export type NodeStatus = DomainStatus | FeatureStatus;
export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

// 产品域
export interface ProductDomain {
  uri: string;
  code: string;
  label: string;
  description: string;
  priority: Priority;
  status: DomainStatus;
  updatedAt?: string;
}

// Epic
export interface Epic {
  uri: string;
  id: string;
  label: string;
  problem?: string;
  coreGoal?: string;
  priority: Priority;
  status: NodeStatus;
  updatedAt?: string;
}

// 功能特性
export interface Feature {
  uri: string;
  id: string;
  label: string;
  description?: string;
  priority: Priority;
  status: FeatureStatus;
  epicId?: string;
  updatedAt?: string;
}

// 功能点
export interface FunctionPoint {
  uri: string;
  id: string;
  label: string;
  description?: string;
  status: FeatureStatus;
  updatedAt?: string;
}

// 包含 Epic 的域
export interface DomainWithEpics extends ProductDomain {
  epics: EpicWithFeatures[];
}

// 包含功能特性的 Epic
export interface EpicWithFeatures extends Epic {
  features: FeatureWithFunctionPoints[];
}

// 包含功能点的功能特性
export interface FeatureWithFunctionPoints extends Feature {
  functionPoints: FunctionPoint[];
}

// 架构图节点
export interface ArchitectureMapNode {
  type: ArchitectureNodeType;
  id: string;
  label: string;
  status?: string;
  domainCode?: string;
  uri?: string;
}

// API 通用响应
export interface APIResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

// 产品全景数据
export interface ProductOverviewData {
  vision: string;
  project: string;
  domains: DomainWithEpics[];
}

// 域详情数据
export interface DomainDetailData {
  productDomain: ProductDomain;
  epics: EpicWithFeatures[];
}

// 扁平化架构项
export interface FlatArchitectureItem {
  type: 'epic' | 'feature' | 'functionPoint';
  id: string;
  label: string;
  status: string;
  domainCode: string;
  uri: string;
  parentLabel?: string;
}

// 状态颜色映射
export const STATUS_COLOR_MAP: Record<string, string> = {
  '已上线': '#52c41a',
  '测试中': '#faad14',
  '迭代中': '#1890ff',
  '构想': '#d9d9d9',
  '规划中': '#d9d9d9',
  '已废弃': '#f5222d',
  '建设中': '#1890ff',
};

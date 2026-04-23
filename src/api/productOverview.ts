/**
 * 产品全景 API
 * 基于统一 axios 实例封装
 */
import axiosInstance from './index';
import type {
  ProductOverviewData,
  DomainDetailData,
  DomainWithEpics,
  Epic,
} from '../types/productOverview';

const API_BASE = '/api/v1/product-overview';

/**
 * 获取产品全景概览
 */
export async function getProductOverview(): Promise<ProductOverviewData> {
  const response = await axiosInstance.get<{ code: number; data: ProductOverviewData }>(
    `${API_BASE}/`
  );
  return response.data.data;
}

/**
 * 获取域详情
 */
export async function getDomainDetail(code: string): Promise<DomainDetailData | null> {
  try {
    const response = await axiosInstance.get<{ code: number; data: DomainDetailData }>(
      `${API_BASE}/domain/${encodeURIComponent(code)}`
    );
    const data = response.data.data;
    // Fallback: detail API 为空时，从 overview 数据中查找
    if (!data) {
      const overview = await getProductOverview();
      const domain = overview.domains.find(d => d.code === code);
      if (domain) {
        return { 
          productDomain: { uri: domain.uri || '', code: domain.code, label: domain.label, description: domain.description || '', priority: domain.priority || 'P2', status: domain.status || '已上线' }, 
          epics: domain.epics || [] 
        };
      }
      return null;
    }
    return data;
  } catch {
    // 错误时也从 overview 兜底
    const overview = await getProductOverview();
    const domain = overview.domains.find(d => d.code === code);
    if (domain) {
      return { 
        productDomain: { uri: domain.uri || '', code: domain.code, label: domain.label, description: domain.description || '', priority: domain.priority || 'P2', status: domain.status || '已上线' }, 
        epics: domain.epics || [] 
      };
    }
    return null;
  }
}

/**
 * 获取 Epic 详情
 */
export async function getEpicDetail(uri: string): Promise<Epic> {
  const response = await axiosInstance.get<{ code: number; data: Epic }>(
    `${API_BASE}/epic/${encodeURIComponent(uri)}`
  );
  return response.data.data;
}

/**
 * 获取架构图数据（包含所有域和 Epic 详情）
 * 直接使用 overview API 数据，不再逐域调用 detail，减少 API 调用
 */
export async function getArchitectureMapData(): Promise<DomainWithEpics[]> {
  try {
    const overview = await getProductOverview();
    if (!overview || !Array.isArray(overview.domains)) {
      console.warn('[ProductOverview API] overview.domains missing, returning empty array');
      return [];
    }
    return overview.domains.filter((d): d is DomainWithEpics => {
      return Boolean(d && typeof d.code === 'string' && d.code.length > 0);
    });
  } catch (err) {
    console.error('[ProductOverview API] getProductOverview failed:', err);
    return [];
  }
}

/**
 * 扁平化架构数据
 */
export interface FlatArchitectureItem {
  type: 'epic' | 'feature' | 'functionPoint';
  id: string;
  label: string;
  status: string;
  domainCode: string;
  uri: string;
  parentLabel?: string;
}

export function flattenArchitectureData(domains: DomainWithEpics[]): {
  epics: FlatArchitectureItem[];
  features: FlatArchitectureItem[];
  functionPoints: FlatArchitectureItem[];
} {
  const epics: FlatArchitectureItem[] = [];
  const features: FlatArchitectureItem[] = [];
  const functionPoints: FlatArchitectureItem[] = [];

  for (const domain of domains) {
    for (const epic of domain.epics ?? []) {
      epics.push({
        type: 'epic',
        id: epic.id,
        label: epic.label,
        status: epic.status,
        domainCode: domain.code,
        uri: epic.uri,
      });
      
      for (const feature of epic.features ?? []) {
        features.push({
          type: 'feature',
          id: feature.id,
          label: feature.label,
          status: feature.status,
          domainCode: domain.code,
          uri: feature.uri,
          parentLabel: epic.label,
        });
        
        for (const fp of feature.functionPoints ?? []) {
          functionPoints.push({
            type: 'functionPoint',
            id: fp.id,
            label: fp.label,
            status: fp.status,
            domainCode: domain.code,
            uri: fp.uri,
            parentLabel: feature.label,
          });
        }
      }
    }
  }

  return { epics, features, functionPoints };
}

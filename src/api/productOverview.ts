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
export async function getDomainDetail(code: string): Promise<DomainDetailData> {
  const response = await axiosInstance.get<{ code: number; data: DomainDetailData }>(
    `${API_BASE}/domain/${encodeURIComponent(code)}`
  );
  return response.data.data;
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
 */
export async function getArchitectureMapData(): Promise<DomainWithEpics[]> {
  let overview: ProductOverviewData;
  
  try {
    overview = await getProductOverview();
  } catch (err) {
    console.error('[ProductOverview API] getProductOverview failed:', err);
    return [];
  }

  if (!overview || !Array.isArray(overview.domains)) {
    console.warn('[ProductOverview API] overview.domains missing, returning empty array');
    return [];
  }

  const validDomains = overview.domains.filter((d): d is DomainWithEpics => {
    return Boolean(d && typeof d.code === 'string' && d.code.length > 0);
  });

  const detailResults = await Promise.all(
    validDomains.map((domain) =>
      getDomainDetail(domain.code).catch((err) => {
        console.warn('[ProductOverview API] failed to fetch domain detail for', domain.code, err);
        return null;
      })
    )
  );

  return detailResults
    .filter((d): d is DomainDetailData => d !== null)
    .map((d) => ({
      ...d.productDomain,
      epics: d.epics,
    }));
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

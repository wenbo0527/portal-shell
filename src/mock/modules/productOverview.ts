/**
 * 产品全景 Mock 数据
 */
import { delay } from '../utils';
import type {
  ProductOverviewData,
  DomainDetailData,
  EpicWithFeatures,
} from '@/types/productOverview';

// 产品全景数据
export const mockProductOverview: ProductOverviewData = {
  vision: '打造业界领先的数据资产管理平台',
  project: '数据资产管理平台',
  domains: [
    {
      uri: '/domain/risk',
      code: 'risk',
      label: '风险管理',
      description: '管理外数生命周期、模型回溯等风险相关功能',
      priority: 'P0',
      status: '已上线',
      updatedAt: '2026-04-15',
      epics: [
        {
          uri: '/epic/risk-001',
          id: 'risk-001',
          label: '外数生命周期管理',
          problem: '当前外数管理缺乏系统性',
          coreGoal: '建立完整的外数管理流程',
          priority: 'P0',
          status: '已上线',
          updatedAt: '2026-04-10',
          features: [
            {
              uri: '/feature/risk-001-001',
              id: 'risk-001-001',
              label: '外数申请流程',
              description: '在线申请外部数据源',
              priority: 'P0',
              status: '已上线',
              epicId: 'risk-001',
              functionPoints: [
                {
                  uri: '/fp/risk-001-001-001',
                  id: 'risk-001-001-001',
                  label: '申请表单',
                  description: '外部数据源申请表',
                  status: '已上线',
                },
                {
                  uri: '/fp/risk-001-001-002',
                  id: 'risk-001-001-002',
                  label: '审批流程',
                  description: '多级审批工作流',
                  status: '已上线',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      uri: '/domain/mkt',
      code: 'mkt',
      label: '营销管理',
      description: '权益管理、客群分析、营销画布、触达管理',
      priority: 'P1',
      status: '建设中',
      updatedAt: '2026-04-18',
      epics: [
        {
          uri: '/epic/mkt-001',
          id: 'mkt-001',
          label: '营销画布',
          problem: '缺乏可视化营销流程编排',
          coreGoal: '提供拖拽式营销画布',
          priority: 'P1',
          status: '迭代中',
          updatedAt: '2026-04-12',
          features: [
            {
              uri: '/feature/mkt-001-001',
              id: 'mkt-001-001',
              label: '画布编辑器',
              description: '可视化拖拽编辑器',
              priority: 'P1',
              status: '迭代中',
              epicId: 'mkt-001',
              functionPoints: [
                {
                  uri: '/fp/mkt-001-001-001',
                  id: 'mkt-001-001-001',
                  label: '节点拖拽',
                  description: '拖拽添加营销节点',
                  status: '迭代中',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      uri: '/domain/dex',
      code: 'dex',
      label: '数据分析',
      description: '客户360视图、指标看板、分析工作台',
      priority: 'P1',
      status: '建设中',
      updatedAt: '2026-04-20',
      epics: [],
    },
  ],
};

/**
 * 获取产品全景数据
 */
export async function getProductOverviewMock(): Promise<ProductOverviewData> {
  await delay(300);
  return mockProductOverview;
}

/**
 * 获取域详情
 */
export async function getDomainDetailMock(
  code: string
): Promise<DomainDetailData | null> {
  await delay(200);
  
  const domain = mockProductOverview.domains.find((d) => d.code === code);
  if (!domain) {
    return null;
  }

  return {
    productDomain: domain,
    epics: domain.epics,
  };
}

/**
 * 获取 Epic 详情
 */
export async function getEpicDetailMock(uri: string): Promise<EpicWithFeatures | null> {
  await delay(200);
  
  for (const domain of mockProductOverview.domains) {
    const epic = domain.epics.find((e) => e.uri === uri);
    if (epic) {
      return epic as EpicWithFeatures;
    }
  }
  return null;
}

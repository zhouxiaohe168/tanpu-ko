export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  priceDisplay: string
  features: string[]
  popular?: boolean
  type: 'one_time' | 'monthly' | 'yearly'
  queries?: number // 查询次数限制，undefined 表示无限
}

// 探铺产品定价
export const PRODUCTS: Product[] = [
  {
    id: 'single-query',
    name: '单次查询',
    description: '单次空白点查询服务',
    priceInCents: 990, // ¥9.9
    priceDisplay: '¥9.9',
    type: 'one_time',
    queries: 1,
    features: [
      '1次空白点查询',
      '基础周边分析',
      '竞品距离标注',
      '24小时有效',
    ],
  },
  {
    id: 'monthly-pass',
    name: '月卡会员',
    description: '30天无限查询服务',
    priceInCents: 19900, // ¥199
    priceDisplay: '¥199',
    type: 'monthly',
    queries: undefined, // 无限
    popular: true,
    features: [
      '30天无限查询',
      '完整周边分析',
      'AI智能研判',
      '数据导出Excel',
      '位置PK对比',
    ],
  },
  {
    id: 'yearly-pass',
    name: '年卡会员',
    description: '365天无限查询服务',
    priceInCents: 149900, // ¥1499
    priceDisplay: '¥1499',
    type: 'yearly',
    queries: undefined, // 无限
    features: [
      '365天无限查询',
      '完整周边分析',
      'AI智能研判',
      '数据导出Excel',
      '位置PK对比',
      '反向推荐功能',
      '专属客服支持',
      '优先体验新功能',
    ],
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// 行业分类数据
export interface Industry {
  id: string
  name: string
  brands: Brand[]
}

export interface Brand {
  id: string
  name: string
  industryId: string
}

// 目前只支持奶茶行业
export const industries: Industry[] = [
  {
    id: "milk-tea",
    name: "奶茶饮品",
    brands: [
      { id: "mixue", name: "蜜雪冰城", industryId: "milk-tea" },
      { id: "guming", name: "古茗", industryId: "milk-tea" },
      { id: "bawangchaji", name: "霸王茶姬", industryId: "milk-tea" },
      { id: "chabaidao", name: "茶百道", industryId: "milk-tea" },
      { id: "heytea", name: "喜茶", industryId: "milk-tea" },
      { id: "nayuki", name: "奈雪的茶", industryId: "milk-tea" },
      { id: "yidiandian", name: "一点点", industryId: "milk-tea" },
      { id: "coco", name: "CoCo都可", industryId: "milk-tea" },
      { id: "shuyi", name: "书亦烧仙草", industryId: "milk-tea" },
      { id: "chayan", name: "茶颜悦色", industryId: "milk-tea" },
      { id: "tianlala", name: "甜啦啦", industryId: "milk-tea" },
      { id: "yinong", name: "益禾堂", industryId: "milk-tea" },
    ],
  },
]

// 跨行业品类（用于竞品分析）
export const crossIndustryCategories: Industry[] = [
  {
    id: "coffee",
    name: "咖啡",
    brands: [
      { id: "luckin", name: "瑞幸咖啡", industryId: "coffee" },
      { id: "starbucks", name: "星巴克", industryId: "coffee" },
      { id: "manner", name: "Manner咖啡", industryId: "coffee" },
      { id: "mstand", name: "M Stand", industryId: "coffee" },
      { id: "tims", name: "Tims天好咖啡", industryId: "coffee" },
      { id: "kudi", name: "库迪咖啡", industryId: "coffee" },
    ],
  },
  {
    id: "fast-food",
    name: "快餐简餐",
    brands: [
      { id: "hualaishi", name: "华莱士", industryId: "fast-food" },
      { id: "zhengxin", name: "正新鸡排", industryId: "fast-food" },
      { id: "juewei", name: "绝味鸭脖", industryId: "fast-food" },
      { id: "mcdonald", name: "麦当劳", industryId: "fast-food" },
      { id: "kfc", name: "肯德基", industryId: "fast-food" },
      { id: "tastien", name: "塔斯汀", industryId: "fast-food" },
    ],
  },
  {
    id: "bakery",
    name: "烘焙甜点",
    brands: [
      { id: "85c", name: "85度C", industryId: "bakery" },
      { id: "holiland", name: "好利来", industryId: "bakery" },
      { id: "yuanzu", name: "元祖", industryId: "bakery" },
      { id: "wedome", name: "味多美", industryId: "bakery" },
    ],
  },
  {
    id: "convenience",
    name: "便利店",
    brands: [
      { id: "711", name: "7-Eleven", industryId: "convenience" },
      { id: "familymart", name: "全家", industryId: "convenience" },
      { id: "lawson", name: "罗森", industryId: "convenience" },
      { id: "meiyijia", name: "美宜佳", industryId: "convenience" },
    ],
  },
]

// 获取奶茶行业所有品牌
export function getMilkTeaBrands(): Brand[] {
  return industries[0].brands
}

// 获取跨行业品类
export function getCrossIndustryCategories(): Industry[] {
  return crossIndustryCategories
}

// 根据品类ID获取品牌
export function getBrandsByCategory(categoryId: string): Brand[] {
  const category = crossIndustryCategories.find((c) => c.id === categoryId)
  return category?.brands || []
}

// 获取所有品牌（包括跨行业）
export function getAllBrands(): Brand[] {
  const milkTeaBrands = industries.flatMap((i) => i.brands)
  const crossBrands = crossIndustryCategories.flatMap((c) => c.brands)
  return [...milkTeaBrands, ...crossBrands]
}

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
    ],
  },
  {
    id: "coffee",
    name: "咖啡",
    brands: [
      { id: "luckin", name: "瑞幸咖啡", industryId: "coffee" },
      { id: "starbucks", name: "星巴克", industryId: "coffee" },
      { id: "manner", name: "Manner咖啡", industryId: "coffee" },
      { id: "mstand", name: "M Stand", industryId: "coffee" },
      { id: "tims", name: "Tims天好咖啡", industryId: "coffee" },
      { id: "pacific", name: "太平洋咖啡", industryId: "coffee" },
      { id: "costa", name: "Costa咖啡", industryId: "coffee" },
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
      { id: "dicos", name: "德克士", industryId: "fast-food" },
      { id: "tastien", name: "塔斯汀", industryId: "fast-food" },
      { id: "laoxiang", name: "老乡鸡", industryId: "fast-food" },
      { id: "xiangcun", name: "乡村基", industryId: "fast-food" },
      { id: "yonghe", name: "永和大王", industryId: "fast-food" },
    ],
  },
  {
    id: "hotpot",
    name: "火锅烧烤",
    brands: [
      { id: "haidilao", name: "海底捞", industryId: "hotpot" },
      { id: "xiabuxiabu", name: "呷哺呷哺", industryId: "hotpot" },
      { id: "bajiudi", name: "巴奴毛肚火锅", industryId: "hotpot" },
      { id: "xiaolongkan", name: "小龙坎", industryId: "hotpot" },
      { id: "tanlada", name: "谭鸭血", industryId: "hotpot" },
      { id: "shuxiang", name: "蜀香火锅", industryId: "hotpot" },
    ],
  },
  {
    id: "bakery",
    name: "烘焙甜点",
    brands: [
      { id: "85c", name: "85度C", industryId: "bakery" },
      { id: "breadtalk", name: "面包新语", industryId: "bakery" },
      { id: "holiland", name: "好利来", industryId: "bakery" },
      { id: "yuanzu", name: "元祖", industryId: "bakery" },
      { id: "paris", name: "巴黎贝甜", industryId: "bakery" },
      { id: "wedome", name: "味多美", industryId: "bakery" },
    ],
  },
  {
    id: "convenience",
    name: "便利店零售",
    brands: [
      { id: "711", name: "7-Eleven", industryId: "convenience" },
      { id: "familymart", name: "全家", industryId: "convenience" },
      { id: "lawson", name: "罗森", industryId: "convenience" },
      { id: "meiyijia", name: "美宜佳", industryId: "convenience" },
      { id: "tianfu", name: "天福便利", industryId: "convenience" },
    ],
  },
  {
    id: "noodle",
    name: "面食小吃",
    brands: [
      { id: "lanzhou", name: "兰州拉面", industryId: "noodle" },
      { id: "shaxian", name: "沙县小吃", industryId: "noodle" },
      { id: "mianwu", name: "面五", industryId: "noodle" },
      { id: "hejia", name: "和府捞面", industryId: "noodle" },
      { id: "mazilu", name: "马子禄", industryId: "noodle" },
      { id: "wunai", name: "五爷拌面", industryId: "noodle" },
    ],
  },
]

// 获取所有品牌
export function getAllBrands(): Brand[] {
  return industries.flatMap((industry) => industry.brands)
}

// 根据行业获取品牌
export function getBrandsByIndustry(industryId: string): Brand[] {
  const industry = industries.find((i) => i.id === industryId)
  return industry?.brands || []
}

// 获取跨行业品牌（排除指定行业）
export function getCrossIndustryBrands(excludeIndustryId: string): Brand[] {
  return industries
    .filter((i) => i.id !== excludeIndustryId)
    .flatMap((i) => i.brands)
}

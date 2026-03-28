// 省市区街道数据
export interface Region {
  code: string
  name: string
  children?: Region[]
}

// 简化版省市区数据（实际项目中应从API获取完整数据）
export const regions: Region[] = [
  {
    code: "330000",
    name: "浙江省",
    children: [
      {
        code: "330100",
        name: "杭州市",
        children: [
          { code: "330102", name: "上城区", children: [
            { code: "330102001", name: "清波街道" },
            { code: "330102002", name: "湖滨街道" },
            { code: "330102003", name: "小营街道" },
            { code: "330102004", name: "南星街道" },
          ]},
          { code: "330103", name: "下城区", children: [
            { code: "330103001", name: "武林街道" },
            { code: "330103002", name: "天水街道" },
            { code: "330103003", name: "朝晖街道" },
          ]},
          { code: "330106", name: "西湖区", children: [
            { code: "330106001", name: "北山街道" },
            { code: "330106002", name: "西溪街道" },
            { code: "330106003", name: "翠苑街道" },
            { code: "330106004", name: "文新街道" },
          ]},
          { code: "330108", name: "滨江区", children: [
            { code: "330108001", name: "西兴街道" },
            { code: "330108002", name: "长河街道" },
            { code: "330108003", name: "浦沿街道" },
          ]},
          { code: "330109", name: "萧山区", children: [
            { code: "330109001", name: "城厢街道" },
            { code: "330109002", name: "北干街道" },
            { code: "330109003", name: "蜀山街道" },
          ]},
          { code: "330110", name: "余杭区", children: [
            { code: "330110001", name: "临平街道" },
            { code: "330110002", name: "南苑街道" },
            { code: "330110003", name: "东湖街道" },
            { code: "330110004", name: "五常街道" },
          ]},
        ],
      },
      {
        code: "330700",
        name: "金华市",
        children: [
          { code: "330702", name: "婺城区", children: [
            { code: "330702001", name: "城东街道" },
            { code: "330702002", name: "城中街道" },
            { code: "330702003", name: "城西街道" },
            { code: "330702004", name: "城北街道" },
          ]},
          { code: "330703", name: "金东区", children: [
            { code: "330703001", name: "多湖街道" },
            { code: "330703002", name: "东孝街道" },
          ]},
          { code: "330782", name: "义乌市", children: [
            { code: "330782001", name: "稠城街道" },
            { code: "330782002", name: "北苑街道" },
            { code: "330782003", name: "稠江街道" },
            { code: "330782004", name: "江东街道" },
            { code: "330782005", name: "后宅街道" },
            { code: "330782006", name: "城西街道" },
            { code: "330782007", name: "廿三里街道" },
            { code: "330782008", name: "福田街道" },
          ]},
          { code: "330783", name: "东阳市", children: [
            { code: "330783001", name: "吴宁街道" },
            { code: "330783002", name: "白云街道" },
            { code: "330783003", name: "江北街道" },
          ]},
          { code: "330784", name: "永康市", children: [
            { code: "330784001", name: "东城街道" },
            { code: "330784002", name: "西城街道" },
            { code: "330784003", name: "江南街道" },
          ]},
        ],
      },
      {
        code: "330200",
        name: "宁波市",
        children: [
          { code: "330203", name: "海曙区", children: [
            { code: "330203001", name: "月湖街道" },
            { code: "330203002", name: "南门街道" },
            { code: "330203003", name: "江厦街道" },
          ]},
          { code: "330205", name: "江北区", children: [
            { code: "330205001", name: "中马街道" },
            { code: "330205002", name: "白沙街道" },
            { code: "330205003", name: "孔浦街道" },
          ]},
          { code: "330206", name: "北仑区", children: [
            { code: "330206001", name: "新碶街道" },
            { code: "330206002", name: "小港街道" },
            { code: "330206003", name: "大碶街道" },
          ]},
        ],
      },
      {
        code: "330300",
        name: "温州市",
        children: [
          { code: "330302", name: "鹿城区", children: [
            { code: "330302001", name: "五马街道" },
            { code: "330302002", name: "松台街道" },
            { code: "330302003", name: "南汇街道" },
          ]},
          { code: "330303", name: "龙湾区", children: [
            { code: "330303001", name: "永中街道" },
            { code: "330303002", name: "蒲州街道" },
          ]},
        ],
      },
    ],
  },
  {
    code: "310000",
    name: "上海市",
    children: [
      {
        code: "310100",
        name: "上海市",
        children: [
          { code: "310101", name: "黄浦区", children: [
            { code: "310101001", name: "南京东路街道" },
            { code: "310101002", name: "外滩街道" },
            { code: "310101003", name: "瑞金二路街道" },
            { code: "310101004", name: "淮海中路街道" },
          ]},
          { code: "310104", name: "徐汇区", children: [
            { code: "310104001", name: "徐家汇街道" },
            { code: "310104002", name: "天平路街道" },
            { code: "310104003", name: "湖南路街道" },
          ]},
          { code: "310105", name: "长宁区", children: [
            { code: "310105001", name: "华阳路街道" },
            { code: "310105002", name: "江苏路街道" },
            { code: "310105003", name: "新华路街道" },
          ]},
          { code: "310106", name: "静安区", children: [
            { code: "310106001", name: "江宁路街道" },
            { code: "310106002", name: "石门二路街道" },
            { code: "310106003", name: "南京西路街道" },
          ]},
          { code: "310110", name: "杨浦区", children: [
            { code: "310110001", name: "定海路街道" },
            { code: "310110002", name: "平凉路街道" },
            { code: "310110003", name: "五角场街道" },
          ]},
          { code: "310115", name: "浦东新区", children: [
            { code: "310115001", name: "陆家嘴街道" },
            { code: "310115002", name: "潍坊新村街道" },
            { code: "310115003", name: "塘桥街道" },
            { code: "310115004", name: "张江镇" },
          ]},
        ],
      },
    ],
  },
  {
    code: "110000",
    name: "北京市",
    children: [
      {
        code: "110100",
        name: "北京市",
        children: [
          { code: "110101", name: "东城区", children: [
            { code: "110101001", name: "东华门街道" },
            { code: "110101002", name: "景山街道" },
            { code: "110101003", name: "交道口街道" },
            { code: "110101004", name: "王府井街道" },
          ]},
          { code: "110102", name: "西城区", children: [
            { code: "110102001", name: "西长安街街道" },
            { code: "110102002", name: "新街口街道" },
            { code: "110102003", name: "金融街街道" },
          ]},
          { code: "110105", name: "朝阳区", children: [
            { code: "110105001", name: "建外街道" },
            { code: "110105002", name: "朝外街道" },
            { code: "110105003", name: "三里屯街道" },
            { code: "110105004", name: "CBD" },
          ]},
          { code: "110108", name: "海淀区", children: [
            { code: "110108001", name: "中关村街道" },
            { code: "110108002", name: "海淀街道" },
            { code: "110108003", name: "五道口" },
          ]},
        ],
      },
    ],
  },
  {
    code: "440000",
    name: "广东省",
    children: [
      {
        code: "440100",
        name: "广州市",
        children: [
          { code: "440103", name: "荔湾区", children: [
            { code: "440103001", name: "沙面街道" },
            { code: "440103002", name: "岭南街道" },
            { code: "440103003", name: "华林街道" },
          ]},
          { code: "440104", name: "越秀区", children: [
            { code: "440104001", name: "北京街道" },
            { code: "440104002", name: "六榕街道" },
            { code: "440104003", name: "东风街道" },
          ]},
          { code: "440105", name: "海珠区", children: [
            { code: "440105001", name: "赤岗街道" },
            { code: "440105002", name: "新港街道" },
            { code: "440105003", name: "滨江街道" },
          ]},
          { code: "440106", name: "天河区", children: [
            { code: "440106001", name: "天河南街道" },
            { code: "440106002", name: "林和街道" },
            { code: "440106003", name: "珠江新城" },
          ]},
        ],
      },
      {
        code: "440300",
        name: "深圳市",
        children: [
          { code: "440303", name: "罗湖区", children: [
            { code: "440303001", name: "桂园街道" },
            { code: "440303002", name: "东门街道" },
            { code: "440303003", name: "南湖街道" },
          ]},
          { code: "440304", name: "福田区", children: [
            { code: "440304001", name: "南园街道" },
            { code: "440304002", name: "华富街道" },
            { code: "440304003", name: "CBD中心" },
          ]},
          { code: "440305", name: "南山区", children: [
            { code: "440305001", name: "南头街道" },
            { code: "440305002", name: "南山街道" },
            { code: "440305003", name: "科技园" },
          ]},
        ],
      },
    ],
  },
]

// 常用商圈数据
export const businessDistricts: Record<string, string[]> = {
  "330782001": ["国际商贸城", "宾王商贸区", "篁园市场", "义乌之心"],
  "330782002": ["北苑工业区", "万达广场"],
  "330782004": ["江东客运站", "三挺路商业街"],
  "330106001": ["西湖景区", "北山商业街"],
  "330106002": ["西溪湿地", "文三路"],
  "310115001": ["陆家嘴金融中心", "正大广场", "IFC"],
  "310101001": ["南京路步行街", "第一百货"],
  "110105003": ["三里屯太古里", "工体"],
  "440106003": ["天环广场", "太古汇", "K11"],
}

// 获取子区域
export function getChildRegions(parentCode?: string): Region[] {
  if (!parentCode) {
    return regions
  }
  
  function findChildren(items: Region[], code: string): Region[] | undefined {
    for (const item of items) {
      if (item.code === code) {
        return item.children
      }
      if (item.children) {
        const found = findChildren(item.children, code)
        if (found) return found
      }
    }
    return undefined
  }
  
  return findChildren(regions, parentCode) || []
}

// 根据code获取区域名称路径
export function getRegionPath(code: string): string[] {
  const path: string[] = []
  
  function find(items: Region[], targetCode: string, currentPath: string[]): boolean {
    for (const item of items) {
      const newPath = [...currentPath, item.name]
      if (item.code === targetCode) {
        path.push(...newPath)
        return true
      }
      if (item.children && find(item.children, targetCode, newPath)) {
        return true
      }
    }
    return false
  }
  
  find(regions, code, [])
  return path
}

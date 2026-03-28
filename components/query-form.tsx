"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Store, Users, MapPin, CircleDot, Loader2, Navigation, Lock } from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  industries, 
  getMilkTeaBrands, 
  getCrossIndustryCategories, 
  getBrandsByCategory,
  type Brand 
} from "@/lib/data/industries"
import { getChildRegions, businessDistricts, getRegionPath } from "@/lib/data/regions"
import { useUserAccess } from "@/hooks/use-user-access"
import { Paywall } from "@/components/paywall"

const radiusOptions = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 3000, label: "3km" },
]

export function QueryForm() {
  const router = useRouter()
  const { isLoggedIn, isLoading, canQuery, freeQueryUsed, consumeFreeQuery, isPremium } = useUserAccess()
  
  // 品牌选择（目前只有奶茶）
  const [brand, setBrand] = useState("")
  const [customBrand, setCustomBrand] = useState("")
  
  // 竞品选择
  const [competitorTab, setCompetitorTab] = useState("same")
  const [crossCategory, setCrossCategory] = useState("")
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])
  
  // 地址选择
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [street, setStreet] = useState("")
  const [customLocation, setCustomLocation] = useState("")
  
  // 搜索半径
  const [radius, setRadius] = useState([1000])
  const [isQuerying, setIsQuerying] = useState(false)
  
  // 付费墙状态
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallType, setPaywallType] = useState<"login" | "upgrade">("login")

  // 奶茶品牌列表
  const brandList = getMilkTeaBrands()

  // 同行业竞品（排除已选品牌）
  const sameIndustryCompetitors = useMemo(() => {
    return brandList.filter(b => b.id !== brand)
  }, [brand, brandList])

  // 跨行业品类
  const crossCategories = getCrossIndustryCategories()

  // 根据选择的跨行业品类获取品牌
  const crossIndustryBrands = useMemo(() => {
    if (!crossCategory) return []
    return getBrandsByCategory(crossCategory)
  }, [crossCategory])

  // 地址级联数据
  const provinces = getChildRegions()
  const cities = useMemo(() => province ? getChildRegions(province) : [], [province])
  const districts = useMemo(() => city ? getChildRegions(city) : [], [city])
  const streets = useMemo(() => district ? getChildRegions(district) : [], [district])
  const availableDistricts = useMemo(() => street ? (businessDistricts[street] || []) : [], [street])

  const handleProvinceChange = (value: string) => {
    setProvince(value)
    setCity("")
    setDistrict("")
    setStreet("")
    setCustomLocation("")
  }

  const handleCityChange = (value: string) => {
    setCity(value)
    setDistrict("")
    setStreet("")
    setCustomLocation("")
  }

  const handleDistrictChange = (value: string) => {
    setDistrict(value)
    setStreet("")
    setCustomLocation("")
  }

  const handleStreetChange = (value: string) => {
    setStreet(value)
    setCustomLocation("")
  }

  const handleCompetitorChange = (competitorId: string, checked: boolean) => {
    if (checked) {
      setSelectedCompetitors([...selectedCompetitors, competitorId])
    } else {
      setSelectedCompetitors(selectedCompetitors.filter(id => id !== competitorId))
    }
  }

  const getRadiusLabel = (value: number) => {
    const option = radiusOptions.find(opt => opt.value === value)
    return option ? option.label : `${value}m`
  }

  const handleSubmit = async () => {
    // 检查登录状态
    if (!isLoggedIn) {
      setPaywallType("login")
      setShowPaywall(true)
      return
    }

    // 检查查询权限
    if (!canQuery) {
      setPaywallType("upgrade")
      setShowPaywall(true)
      return
    }

    const selectedBrand = brand || customBrand
    if (!selectedBrand || !district) {
      alert("请选择品牌和地址")
      return
    }

    setIsQuerying(true)

    // 消耗免费查询次数（免费用户）
    if (!isPremium) {
      const consumed = await consumeFreeQuery()
      if (!consumed) {
        setIsQuerying(false)
        setPaywallType("upgrade")
        setShowPaywall(true)
        return
      }
    }

    const brandName = brand 
      ? brandList.find(b => b.id === brand)?.name || brand
      : customBrand
    
    const locationPath = getRegionPath(street || district)

    const queryParams = {
      industry: "milk-tea",
      industry_name: "奶茶饮品",
      brand_id: brand || "custom",
      brand_name: brandName,
      competitor_ids: selectedCompetitors,
      province,
      city,
      district,
      street,
      location_path: locationPath.join(" > "),
      custom_location: customLocation,
      radius: radius[0],
    }
    sessionStorage.setItem("tanpu_query", JSON.stringify(queryParams))

    router.push("/results")
  }

  const canSubmit = (brand || customBrand) && district

  if (isLoading) {
    return (
      <Card className="h-fit border-border/50 bg-card shadow-sm">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-fit border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg text-card-foreground">
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              选址查询
            </span>
            {isLoggedIn && !isPremium && (
              <span className="text-xs font-normal text-muted-foreground">
                {freeQueryUsed ? (
                  <span className="flex items-center gap-1 text-destructive">
                    <Lock className="h-3 w-3" />
                    免费次数已用完
                  </span>
                ) : (
                  "剩余 1 次免费查询"
                )}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 提示信息 */}
          {!isLoggedIn && (
            <div className="rounded-lg bg-muted/50 p-3 text-center text-sm text-muted-foreground">
              <Lock className="inline h-4 w-4 mr-1" />
              请先登录后使用查询功能
            </div>
          )}

          {/* 品牌选择（目前只有奶茶） */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Store className="h-4 w-4 text-muted-foreground" />
              我要开的品牌
              <span className="text-xs text-muted-foreground">（奶茶饮品）</span>
            </Label>
            <div className="space-y-2">
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择品牌..." />
                </SelectTrigger>
                <SelectContent>
                  {brandList.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="或输入其他品牌名称..."
                value={customBrand}
                onChange={(e) => {
                  setCustomBrand(e.target.value)
                  if (e.target.value) setBrand("")
                }}
              />
            </div>
          </div>

          {/* 竞品选择 */}
          {(brand || customBrand) && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="h-4 w-4 text-muted-foreground" />
                参考竞品
              </Label>
              <Tabs value={competitorTab} onValueChange={(v) => {
                setCompetitorTab(v)
                setCrossCategory("")
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="same" className="text-xs">本行业TOP</TabsTrigger>
                  <TabsTrigger value="cross" className="text-xs">跨行业</TabsTrigger>
                </TabsList>
                
                {/* 本行业TOP品牌 */}
                <TabsContent value="same" className="mt-3">
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {sameIndustryCompetitors.map((competitor) => (
                      <label
                        key={competitor.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-border/50 p-2 transition-colors hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"
                      >
                        <Checkbox
                          checked={selectedCompetitors.includes(competitor.id)}
                          onCheckedChange={(checked) => 
                            handleCompetitorChange(competitor.id, checked as boolean)
                          }
                        />
                        <span className="text-xs text-foreground truncate">{competitor.name}</span>
                      </label>
                    ))}
                  </div>
                </TabsContent>
                
                {/* 跨行业：先选品类，再选品牌 */}
                <TabsContent value="cross" className="mt-3 space-y-3">
                  <Select value={crossCategory} onValueChange={setCrossCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择品类..." />
                    </SelectTrigger>
                    <SelectContent>
                      {crossCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {crossCategory && (
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {crossIndustryBrands.map((competitor) => (
                        <label
                          key={competitor.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-border/50 p-2 transition-colors hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"
                        >
                          <Checkbox
                            checked={selectedCompetitors.includes(competitor.id)}
                            onCheckedChange={(checked) => 
                              handleCompetitorChange(competitor.id, checked as boolean)
                            }
                          />
                          <span className="text-xs text-foreground truncate">{competitor.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              {selectedCompetitors.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  已选 {selectedCompetitors.length} 个竞品
                </p>
              )}
            </div>
          )}

          {/* 地址选择 */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              选择地址
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {/* 省 */}
              <Select value={province} onValueChange={handleProvinceChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="省份" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* 市 */}
              <Select value={city} onValueChange={handleCityChange} disabled={!province}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="城市" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* 区 */}
              <Select value={district} onValueChange={handleDistrictChange} disabled={!city}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="区/县" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.code} value={d.code}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* 街道 */}
              <Select value={street} onValueChange={handleStreetChange} disabled={!district}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="街道" />
                </SelectTrigger>
                <SelectContent>
                  {streets.map((s) => (
                    <SelectItem key={s.code} value={s.code}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* 商圈或自定义地址 */}
            {street && (
              <div className="space-y-2">
                {availableDistricts.length > 0 ? (
                  <Select value={customLocation} onValueChange={setCustomLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择商圈（可选）" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="输入具体地址或商圈（可选）"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                  />
                )}
              </div>
            )}
          </div>

          {/* 搜索半径 */}
          <div className="space-y-3">
            <Label className="flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <CircleDot className="h-4 w-4 text-muted-foreground" />
                搜索半径
              </span>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                {getRadiusLabel(radius[0])}
              </span>
            </Label>
            <Slider
              value={radius}
              onValueChange={setRadius}
              min={500}
              max={3000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {radiusOptions.map((opt) => (
                <span key={opt.value}>{opt.label}</span>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            size="lg"
            disabled={isQuerying || !canSubmit}
          >
            {isQuerying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                查询中...
              </>
            ) : !isLoggedIn ? (
              <>
                <Lock className="mr-2 h-5 w-5" />
                登录后查询
              </>
            ) : !canQuery ? (
              <>
                <Lock className="mr-2 h-5 w-5" />
                升级解锁查询
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-5 w-5" />
                开始探铺
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 付费墙弹窗 */}
      <Paywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        type={paywallType}
      />
    </>
  )
}

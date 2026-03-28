"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Store, Users, MapPin, CircleDot, Loader2, Building2, Navigation } from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { industries, getBrandsByIndustry, getCrossIndustryBrands, type Brand } from "@/lib/data/industries"
import { getChildRegions, businessDistricts, getRegionPath } from "@/lib/data/regions"

const radiusOptions = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 3000, label: "3km" },
]

export function QueryForm() {
  const router = useRouter()
  
  // 行业和品牌
  const [industry, setIndustry] = useState("")
  const [brand, setBrand] = useState("")
  const [customBrand, setCustomBrand] = useState("")
  
  // 竞品选择
  const [competitorTab, setCompetitorTab] = useState("same")
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

  // 根据行业获取品牌列表
  const brandList = useMemo(() => {
    if (!industry) return []
    return getBrandsByIndustry(industry)
  }, [industry])

  // 同行业竞品
  const sameIndustryCompetitors = useMemo(() => {
    if (!industry) return []
    return getBrandsByIndustry(industry).filter(b => b.id !== brand)
  }, [industry, brand])

  // 跨行业竞品
  const crossIndustryCompetitors = useMemo(() => {
    if (!industry) return []
    return getCrossIndustryBrands(industry)
  }, [industry])

  // 地址级联数据
  const provinces = getChildRegions()
  const cities = useMemo(() => province ? getChildRegions(province) : [], [province])
  const districts = useMemo(() => city ? getChildRegions(city) : [], [city])
  const streets = useMemo(() => district ? getChildRegions(district) : [], [district])
  const availableDistricts = useMemo(() => street ? (businessDistricts[street] || []) : [], [street])

  const handleIndustryChange = (value: string) => {
    setIndustry(value)
    setBrand("")
    setSelectedCompetitors([])
  }

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
    const selectedBrand = brand || customBrand
    if (!selectedBrand || !district) {
      alert("请选择品牌和地址")
      return
    }

    setIsQuerying(true)

    const brandName = brand 
      ? brandList.find(b => b.id === brand)?.name || brand
      : customBrand
    
    const locationPath = getRegionPath(street || district)

    const queryParams = {
      industry,
      industry_name: industries.find(i => i.id === industry)?.name || "",
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

  return (
    <Card className="h-fit border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Search className="h-5 w-5 text-primary" />
          选址查询
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 行业选择 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            选择行业
          </Label>
          <Select value={industry} onValueChange={handleIndustryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择行业类型..." />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind.id} value={ind.id}>
                  {ind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 品牌选择 */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Store className="h-4 w-4 text-muted-foreground" />
            我要开的品牌
          </Label>
          {industry ? (
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
              <div className="relative">
                <Input
                  placeholder="或输入其他品牌名称..."
                  value={customBrand}
                  onChange={(e) => {
                    setCustomBrand(e.target.value)
                    if (e.target.value) setBrand("")
                  }}
                  className="pr-8"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">请先选择行业</p>
          )}
        </div>

        {/* 竞品选择 */}
        {industry && (brand || customBrand) && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-muted-foreground" />
              参考竞品
            </Label>
            <Tabs value={competitorTab} onValueChange={setCompetitorTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="same" className="text-xs">同行业</TabsTrigger>
                <TabsTrigger value="cross" className="text-xs">跨行业</TabsTrigger>
              </TabsList>
              <TabsContent value="same" className="mt-3">
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
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
              <TabsContent value="cross" className="mt-3">
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {crossIndustryCompetitors.slice(0, 12).map((competitor) => (
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
          ) : (
            <>
              <Navigation className="mr-2 h-5 w-5" />
              开始探铺
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

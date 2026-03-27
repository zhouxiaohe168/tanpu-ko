"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, Store, Users, MapPin, CircleDot, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"

interface Brand {
  id: string
  name: string
  category: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const cities = [
  { value: "beijing", label: "北京" },
  { value: "shanghai", label: "上海" },
  { value: "guangzhou", label: "广州" },
  { value: "shenzhen", label: "深圳" },
  { value: "hangzhou", label: "杭州" },
  { value: "chengdu", label: "成都" },
  { value: "wuhan", label: "武汉" },
  { value: "nanjing", label: "南京" },
]

const radiusOptions = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 3000, label: "3km" },
]

export function QueryForm() {
  const router = useRouter()
  const [brand, setBrand] = useState("")
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([])
  const [city, setCity] = useState("")
  const [radius, setRadius] = useState([1000])
  const [isQuerying, setIsQuerying] = useState(false)

  // 从数据库获取品牌列表
  const { data: brands, isLoading: brandsLoading } = useSWR<Brand[]>("/api/brands", fetcher)

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
    if (!brand || !city) {
      alert("请选择品牌和城市")
      return
    }

    setIsQuerying(true)

    // 存储查询参数到 sessionStorage，供结果页使用
    const queryParams = {
      brand_id: brand,
      brand_name: brands?.find(b => b.id === brand)?.name || "",
      competitor_ids: selectedCompetitors,
      city,
      city_name: cities.find(c => c.value === city)?.label || "",
      radius: radius[0],
    }
    sessionStorage.setItem("tanpu_query", JSON.stringify(queryParams))

    router.push("/results")
  }

  // 过滤掉已选品牌的竞品列表
  const competitorList = brands?.filter(b => b.id !== brand) || []

  return (
    <Card className="h-fit border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Search className="h-5 w-5 text-primary" />
          选址查询
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Store className="h-4 w-4 text-muted-foreground" />
            我要开的品牌
          </Label>
          <Select value={brand} onValueChange={setBrand} disabled={brandsLoading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={brandsLoading ? "加载中..." : "选择品牌..."} />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Competitor Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            参考竞品（可多选）
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {brandsLoading ? (
              <div className="col-span-2 flex items-center justify-center py-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                加载品牌...
              </div>
            ) : (
              competitorList.map((competitor) => (
                <label
                  key={competitor.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border/50 p-2.5 transition-colors hover:bg-muted/50 has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"
                >
                  <Checkbox
                    id={competitor.id}
                    checked={selectedCompetitors.includes(competitor.id)}
                    onCheckedChange={(checked) => 
                      handleCompetitorChange(competitor.id, checked as boolean)
                    }
                  />
                  <span className="text-sm text-foreground">{competitor.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* City Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            城市
          </Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择城市..." />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Radius Slider */}
        <div className="space-y-4">
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

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
          size="lg"
          disabled={isQuerying || !brand || !city}
        >
          {isQuerying ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              查询中...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              开始查询
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

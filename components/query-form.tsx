"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, Store, Users, MapPin, CircleDot } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const brands = [
  { value: "mixue", label: "蜜雪冰城" },
  { value: "guming", label: "古茗" },
  { value: "wallace", label: "华莱士" },
  { value: "chagee", label: "霸王茶姬" },
  { value: "luckin", label: "瑞幸咖啡" },
  { value: "chabaidao", label: "茶百道" },
  { value: "nayuki", label: "奈雪的茶" },
  { value: "heytea", label: "喜茶" },
]

const competitors = [
  { id: "chagee", label: "霸王茶姬" },
  { id: "luckin", label: "瑞幸" },
  { id: "chabaidao", label: "茶百道" },
  { id: "guming", label: "古茗" },
  { id: "mixue", label: "蜜雪冰城" },
  { id: "nayuki", label: "奈雪的茶" },
  { id: "heytea", label: "喜茶" },
  { id: "starbucks", label: "星巴克" },
]

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

  const handleSubmit = () => {
    router.push("/results")
  }

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
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择品牌..." />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
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
            {competitors.map((competitor) => (
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
                <span className="text-sm text-foreground">{competitor.label}</span>
              </label>
            ))}
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
        >
          <Search className="mr-2 h-5 w-5" />
          开始查询
        </Button>
      </CardContent>
    </Card>
  )
}

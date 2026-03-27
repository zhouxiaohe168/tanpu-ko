"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Store, TrendingUp, Lock, Sparkles } from "lucide-react"

// 模拟品牌数据
const mockBrands = [
  { name: "蜜雪冰城", count: 12, color: "bg-red-500" },
  { name: "瑞幸咖啡", count: 8, color: "bg-blue-500" },
  { name: "古茗", count: 6, color: "bg-green-500" },
  { name: "霸王茶姬", count: 5, color: "bg-purple-500" },
  { name: "茶百道", count: 4, color: "bg-orange-500" },
  { name: "华莱士", count: 7, color: "bg-yellow-500" },
  { name: "正新鸡排", count: 3, color: "bg-pink-500" },
  { name: "绝味鸭脖", count: 2, color: "bg-indigo-500" },
]

export function FreeDensityQuery() {
  const [address, setAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async () => {
    if (!address.trim()) return
    
    setIsSearching(true)
    // 模拟搜索延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSearching(false)
    setShowResults(true)
  }

  const totalStores = mockBrands.reduce((acc, brand) => acc + brand.count, 0)

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* 标题区 */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            免费功能
          </Badge>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            品牌门店密度查询
          </h1>
          <p className="text-lg text-muted-foreground">
            输入任意地址，免费查看周边 1 公里内的连锁品牌门店分布
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mx-auto mb-12 max-w-xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="输入地址，如：北京市朝阳区望京SOHO"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12 pl-10 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              size="lg" 
              className="h-12 px-6"
              onClick={handleSearch}
              disabled={isSearching || !address.trim()}
            >
              {isSearching ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  查询中...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  免费查询
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 结果区 */}
        {showResults && (
          <div className="mx-auto max-w-4xl">
            {/* 概览卡片 */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>周边门店总数</CardDescription>
                  <CardTitle className="text-3xl text-primary">{totalStores}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">1 公里范围内</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>品牌数量</CardDescription>
                  <CardTitle className="text-3xl text-foreground">{mockBrands.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">连锁品牌</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>商业活跃度</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-3xl text-green-500">
                    <TrendingUp className="h-6 w-6" />
                    高
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">区域评级</p>
                </CardContent>
              </Card>
            </div>

            {/* 品牌分布 */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  品牌门店分布
                </CardTitle>
                <CardDescription>
                  周边 1 公里内检测到的连锁品牌门店
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBrands.map((brand, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full ${brand.color}`} />
                      <span className="w-24 font-medium text-foreground">{brand.name}</span>
                      <div className="flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div 
                            className={`h-full ${brand.color}`}
                            style={{ width: `${(brand.count / 12) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-12 text-right text-sm text-muted-foreground">
                        {brand.count} 家
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 升级提示 */}
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="flex flex-col items-center gap-4 py-8 md:flex-row md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">解锁完整分析</h3>
                    <p className="text-sm text-muted-foreground">
                      升级会员查看空白点、AI 研判报告、详细配套分析
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/#pricing">查看定价</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/query">开始完整查询</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 未搜索时的提示 */}
        {!showResults && (
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-xl border border-dashed border-border p-12">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                输入地址后，我们将为您分析周边的连锁品牌门店密度
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

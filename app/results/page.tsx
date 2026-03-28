"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { LocationCard } from "@/components/location-card"
import { MapContainer } from "@/components/map-container"
import { DetailsPanel } from "@/components/details-panel"
import { Paywall, BlurredContent } from "@/components/paywall"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter, Download, SlidersHorizontal, Crown, Loader2 } from "lucide-react"
import Link from "next/link"
import { useUserAccess, checkFeatureAccess } from "@/hooks/use-user-access"

// Mock data
const mockLocations = [
  {
    id: "1",
    name: "朝阳区望京SOHO西侧底商",
    grade: "S" as const,
    score: 92,
    competitors: [
      { name: "古茗", distance: "380m" },
      { name: "霸王茶姬", distance: "520m" },
      { name: "瑞幸", distance: "150m" },
      { name: "茶百道", distance: "680m" },
      { name: "蜜雪冰城", distance: "890m" }
    ],
    lat: 39.9942,
    lng: 116.4704
  },
  {
    id: "2",
    name: "海淀区中关村软件园二期",
    grade: "A" as const,
    score: 85,
    competitors: [
      { name: "瑞幸", distance: "200m" },
      { name: "星巴克", distance: "350m" },
      { name: "霸王茶姬", distance: "620m" }
    ],
    lat: 40.0508,
    lng: 116.2926
  },
  {
    id: "3",
    name: "西城区金融街购物中心",
    grade: "A" as const,
    score: 83,
    competitors: [
      { name: "喜茶", distance: "180m" },
      { name: "奈雪", distance: "420m" },
      { name: "瑞幸", distance: "90m" },
      { name: "古茗", distance: "550m" }
    ],
    lat: 39.9139,
    lng: 116.3617
  },
  {
    id: "4",
    name: "丰台区万达广场北入口",
    grade: "B" as const,
    score: 76,
    competitors: [
      { name: "蜜雪冰城", distance: "120m" },
      { name: "茶百道", distance: "380m" },
      { name: "霸王茶姬", distance: "450m" }
    ],
    lat: 39.8583,
    lng: 116.2872
  },
  {
    id: "5",
    name: "通州区万达广场B座",
    grade: "B" as const,
    score: 72,
    competitors: [
      { name: "瑞幸", distance: "280m" },
      { name: "古茗", distance: "420m" }
    ],
    lat: 39.9022,
    lng: 116.6588
  },
  {
    id: "6",
    name: "大兴区荟聚购物中心",
    grade: "C" as const,
    score: 65,
    competitors: [
      { name: "星巴克", distance: "150m" },
      { name: "喜茶", distance: "320m" },
      { name: "茶百道", distance: "480m" },
      { name: "瑞幸", distance: "200m" }
    ],
    lat: 39.7757,
    lng: 116.3391
  }
]

const mockLocationDetails = {
  name: "朝阳区望京SOHO西侧底商",
  facilities: [
    { type: "subway", name: "望京站(14号线)", distance: "280m" },
    { type: "mall", name: "望京SOHO", distance: "50m" },
    { type: "office", name: "望京科技园", distance: "320m" },
    { type: "school", name: "望京实验学校", distance: "580m" },
    { type: "hospital", name: "望京医院", distance: "920m" },
    { type: "restaurant", name: "餐饮聚集区", distance: "120m" }
  ],
  projects: [
    { name: "望京新城二期", type: "商业综合体", completion: "2025年Q2" },
    { name: "14号线东延", type: "地铁", completion: "2025年底" }
  ],
  scores: [
    { category: "人流量", score: 28, maxScore: 30 },
    { category: "竞品密度", score: 22, maxScore: 25 },
    { category: "交通便利", score: 18, maxScore: 20 },
    { category: "商业配套", score: 14, maxScore: 15 },
    { category: "租金性价比", score: 10, maxScore: 10 }
  ]
}

export default function ResultsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showUpgradeWall, setShowUpgradeWall] = useState(false)
  
  const { isLoading, isLoggedIn, isPremium, canQuery, remainingQueries, maxQueries, profile } = useUserAccess()

  // 免费用户只能看前2个结果
  const visibleLocations = isPremium ? mockLocations : mockLocations.slice(0, 2)
  const lockedLocations = isPremium ? [] : mockLocations.slice(2)

  const handleCardClick = (id: string) => {
    // 检查是否是锁定的位置
    const isLocked = lockedLocations.some(loc => loc.id === id)
    if (isLocked) {
      setShowUpgradeWall(true)
      return
    }
    
    setSelectedId(id)
    setShowDetails(true)
    setDetailsExpanded(false)
  }

  const handleViewDetails = () => {
    if (!isLoggedIn) {
      // 未登录用户提示登录
      return
    }
    setShowDetails(true)
    setDetailsExpanded(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setDetailsExpanded(false)
  }

  const handleAiAnalysis = () => {
    const membershipType = profile?.membership_type || "free"
    if (!checkFeatureAccess(membershipType, "ai_analysis")) {
      setShowUpgradeWall(true)
      return
    }
    // TODO: 实现 AI 研判功能
    alert("AI 研判功能开发中...")
  }

  const handleExport = () => {
    const membershipType = profile?.membership_type || "free"
    if (!checkFeatureAccess(membershipType, "export")) {
      setShowUpgradeWall(true)
      return
    }
    // TODO: 实现导出功能
    alert("导出功能开发中...")
  }

  // Prepare markers for map
  const markers = mockLocations.map(loc => ({
    id: loc.id,
    type: "blank" as const,
    name: loc.name,
    lat: loc.lat,
    lng: loc.lng
  }))

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 未登录且已用完免费次数
  if (!isLoggedIn && !canQuery) {
    return (
      <>
        <Paywall type="login" />
      </>
    )
  }

  // 已登录但查询次数用完
  if (isLoggedIn && !canQuery) {
    return (
      <>
        <Paywall 
          type="limit" 
          currentCount={maxQueries - remainingQueries}
          maxCount={maxQueries}
        />
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      {/* Sub header */}
      <div className="border-b border-border/40 bg-card/50 px-4 py-3">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/query">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">返回查询</span>
              </Button>
            </Link>
            <div className="hidden h-6 w-px bg-border md:block" />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                蜜雪冰城
              </Badge>
              <span className="hidden text-sm text-muted-foreground sm:inline">北京市</span>
              <span className="hidden text-sm text-muted-foreground sm:inline">·</span>
              <span className="text-sm text-muted-foreground">1km</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isPremium && (
              <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-600">
                <Crown className="h-3 w-3" />
                {remainingQueries}/{maxQueries} 次
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <Filter className="h-4 w-4" />
              筛选
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <SlidersHorizontal className="h-4 w-4" />
              排序
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">导出</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="flex flex-1 flex-col pb-20 md:pb-0 lg:flex-row">
        {/* Results List */}
        <aside className="w-full shrink-0 border-b border-border/40 bg-card/30 lg:w-96 lg:border-b-0 lg:border-r xl:w-[420px]">
          <div className="sticky top-0 z-10 border-b border-border/40 bg-card/95 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-foreground">
                发现 <span className="text-primary">{mockLocations.length}</span> 个空白点
                {!isPremium && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (显示前 {visibleLocations.length} 个)
                  </span>
                )}
              </h2>
              <span className="text-xs text-muted-foreground">按评分排序</span>
            </div>
          </div>
          <div className={`overflow-y-auto p-4 ${showDetails ? "max-h-[300px] lg:max-h-[calc(100vh-220px)]" : "max-h-[400px] lg:max-h-[calc(100vh-160px)]"}`}>
            <div className="space-y-3">
              {/* 可见的结果 */}
              {visibleLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  id={location.id}
                  name={location.name}
                  grade={location.grade}
                  score={location.score}
                  competitors={location.competitors}
                  isSelected={selectedId === location.id}
                  onClick={() => handleCardClick(location.id)}
                  onViewDetails={handleViewDetails}
                  onAiAnalysis={handleAiAnalysis}
                />
              ))}
              
              {/* 锁定的结果 (模糊显示) */}
              {lockedLocations.length > 0 && (
                <>
                  <div className="relative mt-4">
                    <div className="absolute inset-x-0 -top-2 flex items-center justify-center">
                      <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500">
                        <Crown className="h-3 w-3" />
                        升级解锁更多
                      </Badge>
                    </div>
                  </div>
                  {lockedLocations.map((location) => (
                    <BlurredContent key={location.id} blur={true}>
                      <LocationCard
                        id={location.id}
                        name={location.name}
                        grade={location.grade}
                        score={location.score}
                        competitors={location.competitors}
                        isSelected={false}
                        onClick={() => handleCardClick(location.id)}
                        onViewDetails={() => setShowUpgradeWall(true)}
                        onAiAnalysis={() => setShowUpgradeWall(true)}
                      />
                    </BlurredContent>
                  ))}
                </>
              )}
            </div>
          </div>
        </aside>
        
        {/* Map */}
        <div className={`flex-1 p-4 ${showDetails ? "pb-20" : ""}`}>
          <MapContainer 
            className="h-[350px] lg:h-full" 
            markers={markers}
            selectedMarkerId={selectedId ?? undefined}
            onMarkerClick={handleCardClick}
          />
        </div>
      </main>

      {/* Details Panel */}
      {showDetails && (
        <DetailsPanel
          isExpanded={detailsExpanded}
          onToggle={() => setDetailsExpanded(!detailsExpanded)}
          onClose={handleCloseDetails}
          location={mockLocationDetails}
        />
      )}

      {/* Upgrade Paywall */}
      {showUpgradeWall && (
        <div onClick={() => setShowUpgradeWall(false)}>
          <Paywall 
            type="upgrade" 
            title="升级会员查看完整数据"
            description="解锁全部选址结果、AI研判和数据导出功能"
          />
        </div>
      )}

      <MobileNav />
    </div>
  )
}

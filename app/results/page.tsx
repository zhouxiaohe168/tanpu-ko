"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { LocationCard } from "@/components/location-card"
import { MapContainer } from "@/components/map-container"
import { DetailsPanel } from "@/components/details-panel"
import { Paywall, BlurredContent } from "@/components/paywall"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter, Download, SlidersHorizontal, Crown, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useUserAccess, checkFeatureAccess } from "@/hooks/use-user-access"

interface Location {
  id: string
  name: string
  grade: "S" | "A" | "B" | "C" | "D"
  score: number
  competitors: { name: string; distance: string }[]
  lat: number
  lng: number
  scores?: Record<string, number>
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const [locations, setLocations] = useState<Location[]>([])
  const [isQuerying, setIsQuerying] = useState(false)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showUpgradeWall, setShowUpgradeWall] = useState(false)
  const [queryStats, setQueryStats] = useState<{ brand_stores: number; competitor_stores: number } | null>(null)

  const { isLoading, isLoggedIn, isPremium, canQuery, remainingQueries, maxQueries, profile } = useUserAccess()

  const brand = searchParams.get("brand") || ""
  const city = searchParams.get("city") || ""
  const province = searchParams.get("province") || ""
  const district = searchParams.get("district") || ""
  const radius = searchParams.get("radius") || "1000"
  const competitors = searchParams.get("competitors") || ""

  useEffect(() => {
    if (!isLoading && isLoggedIn && canQuery) {
      runQuery()
    }
  }, [isLoading, isLoggedIn, canQuery])

  async function runQuery() {
    setIsQuerying(true)
    setQueryError(null)
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand,
          city,
          province,
          district,
          radius: parseInt(radius),
          competitor_brands: competitors ? competitors.split(",") : [],
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setQueryError(data.error || "查询失败")
        return
      }
      setLocations(data.locations || [])
      setQueryStats({ brand_stores: data.brand_stores, competitor_stores: data.competitor_stores })
    } catch {
      setQueryError("网络错误，请重试")
    } finally {
      setIsQuerying(false)
    }
  }

  const visibleLocations = isPremium ? locations : locations.slice(0, 2)
  const lockedLocations = isPremium ? [] : locations.slice(2)

  const handleCardClick = (id: string) => {
    if (lockedLocations.some(loc => loc.id === id)) {
      setShowUpgradeWall(true)
      return
    }
    setSelectedId(id)
    setShowDetails(true)
    setDetailsExpanded(false)
  }

  const handleAiAnalysis = () => {
    const membershipType = profile?.membership_type || "free"
    if (!checkFeatureAccess(membershipType, "ai_analysis")) {
      setShowUpgradeWall(true)
      return
    }
    alert("AI 研判功能开发中...")
  }

  const handleExport = () => {
    const membershipType = profile?.membership_type || "free"
    if (!checkFeatureAccess(membershipType, "export")) {
      setShowUpgradeWall(true)
      return
    }
    alert("导出功能开发中...")
  }

  const selectedLocation = locations.find(l => l.id === selectedId)
  const markers = locations.map(loc => ({
    id: loc.id,
    type: "blank" as const,
    name: loc.name,
    lat: loc.lat,
    lng: loc.lng,
  }))

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Paywall type="login" />
  }

  if (isLoggedIn && !canQuery) {
    return <Paywall type="limit" currentCount={maxQueries} maxCount={maxQueries} />
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
            <div className="flex items-center gap-2 flex-wrap">
              {brand && <Badge variant="secondary" className="bg-primary/10 text-primary">{brand}</Badge>}
              {city && <span className="hidden text-sm text-muted-foreground sm:inline">{city}</span>}
              {radius && <span className="text-sm text-muted-foreground">{parseInt(radius) >= 1000 ? `${parseInt(radius) / 1000}km` : `${radius}m`}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isPremium && (
              <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-600">
                <Crown className="h-3 w-3" />
                免费体验
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <Filter className="h-4 w-4" />筛选
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <SlidersHorizontal className="h-4 w-4" />排序
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
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
                {isQuerying ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />正在分析...
                  </span>
                ) : queryError ? (
                  <span className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />{queryError}
                  </span>
                ) : (
                  <>发现 <span className="text-primary">{locations.length}</span> 个空白点</>
                )}
              </h2>
              {queryStats && (
                <span className="text-xs text-muted-foreground">
                  竞品 {queryStats.competitor_stores} 家
                </span>
              )}
            </div>
          </div>

          <div className="overflow-y-auto p-4 max-h-[400px] lg:max-h-[calc(100vh-160px)]">
            {isQuerying ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">正在分析周边竞品数据...</p>
              </div>
            ) : queryError ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">{queryError}</p>
                <Button size="sm" onClick={runQuery}>重试</Button>
              </div>
            ) : locations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-sm text-muted-foreground">暂无数据，请尝试扩大搜索范围</p>
                <Link href="/query"><Button size="sm" variant="outline">重新查询</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
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
                    onViewDetails={() => { setSelectedId(location.id); setShowDetails(true) }}
                    onAiAnalysis={handleAiAnalysis}
                  />
                ))}

                {lockedLocations.length > 0 && (
                  <>
                    <div className="relative mt-4 mb-2 flex justify-center">
                      <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500">
                        <Crown className="h-3 w-3" />
                        升级解锁 {lockedLocations.length} 个空白点
                      </Badge>
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
                          onClick={() => setShowUpgradeWall(true)}
                          onViewDetails={() => setShowUpgradeWall(true)}
                          onAiAnalysis={() => setShowUpgradeWall(true)}
                        />
                      </BlurredContent>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 p-4">
          <MapContainer
            className="h-[350px] lg:h-full"
            markers={markers}
            selectedMarkerId={selectedId ?? undefined}
            onMarkerClick={handleCardClick}
          />
        </div>
      </main>

      {showDetails && selectedLocation && (
        <DetailsPanel
          isExpanded={detailsExpanded}
          onToggle={() => setDetailsExpanded(!detailsExpanded)}
          onClose={() => { setShowDetails(false); setDetailsExpanded(false) }}
          location={{
            name: selectedLocation.name,
            facilities: [],
            projects: [],
            scores: selectedLocation.scores
              ? Object.entries(selectedLocation.scores).map(([k, v]) => ({
                  category: k === "traffic" ? "人流量" : k === "competition" ? "竞品密度" : k === "convenience" ? "交通便利" : k === "business" ? "商业配套" : "租金性价比",
                  score: v,
                  maxScore: k === "traffic" ? 30 : k === "competition" ? 25 : k === "convenience" ? 20 : k === "business" ? 15 : 10,
                }))
              : [],
          }}
        />
      )}

      {showUpgradeWall && (
        <div onClick={() => setShowUpgradeWall(false)}>
          <Paywall type="upgrade" title="升级会员查看完整数据" description="解锁全部选址结果、AI研判和数据导出功能" />
        </div>
      )}

      <MobileNav />
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <ResultsContent />
    </Suspense>
  )
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // 检查用户是否登录
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  // 检查用户权限
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_type, free_query_used, query_count")
    .eq("id", user.id)
    .single()

  const isFree = !profile?.membership_type || profile.membership_type === "free"
  if (isFree && profile?.free_query_used) {
    return NextResponse.json({ error: "免费次数已用完，请升级会员" }, { status: 403 })
  }

  const body = await request.json()
  const { brand, city, province, district, radius = 1000, competitor_brands = [] } = body

  // 查询目标品牌在指定区域的门店（作为参考竞品）
  let storesQuery = supabase
    .from("stores")
    .select("*")
    .eq("city", city || "")

  if (province) storesQuery = storesQuery.eq("province", province)
  if (district) storesQuery = storesQuery.eq("district", district)

  const { data: allStores } = await storesQuery

  // 筛选目标品牌门店和竞品门店
  const brandStores = allStores?.filter(s => s.brand_name === brand) || []
  const competitorStores = allStores?.filter(s =>
    competitor_brands.length > 0
      ? competitor_brands.includes(s.brand_name)
      : s.brand_name !== brand
  ) || []

  // 计算空白点：在竞品覆盖范围内但目标品牌未覆盖的区域
  // 基于竞品门店位置生成候选空白点
  const blankPoints = generateBlankPoints(brandStores, competitorStores, radius)

  // 标记免费查询已使用
  if (isFree) {
    await supabase
      .from("profiles")
      .update({ free_query_used: true, query_count: (profile?.query_count || 0) + 1 })
      .eq("id", user.id)
  } else {
    await supabase
      .from("profiles")
      .update({ query_count: (profile?.query_count || 0) + 1 })
      .eq("id", user.id)
  }

  // 记录查询历史
  await supabase.from("queries").insert({
    user_id: user.id,
    brand_id: brand,
    competitor_ids: competitor_brands,
    city: city,
    radius: radius,
  })

  return NextResponse.json({
    locations: blankPoints,
    total: blankPoints.length,
    brand_stores: brandStores.length,
    competitor_stores: competitorStores.length,
    query: { brand, city, radius, competitor_brands },
  })
}

function generateBlankPoints(brandStores: any[], competitorStores: any[], radius: number) {
  if (competitorStores.length === 0) return []

  const results: any[] = []
  const usedPositions: { lat: number; lng: number }[] = []

  // 基于竞品门店位置生成空白点候选
  for (const store of competitorStores.slice(0, 20)) {
    const lat = parseFloat(store.latitude)
    const lng = parseFloat(store.longitude)
    if (!lat || !lng) continue

    // 在竞品门店附近生成候选位置（偏移约300-800m）
    const offsets = [
      { dlat: 0.003, dlng: 0.004 },
      { dlat: -0.004, dlng: 0.003 },
      { dlat: 0.005, dlng: -0.003 },
      { dlat: -0.003, dlng: -0.005 },
    ]

    for (const offset of offsets) {
      const candidateLat = lat + offset.dlat
      const candidateLng = lng + offset.dlng

      // 检查候选位置是否距已有品牌门店太近
      const tooCloseToOwnBrand = brandStores.some(bs => {
        const bLat = parseFloat(bs.latitude)
        const bLng = parseFloat(bs.longitude)
        return getDistance(candidateLat, candidateLng, bLat, bLng) < radius
      })

      // 检查候选位置是否重复
      const isDuplicate = usedPositions.some(p =>
        getDistance(candidateLat, candidateLng, p.lat, p.lng) < 300
      )

      if (!tooCloseToOwnBrand && !isDuplicate) {
        usedPositions.push({ lat: candidateLat, lng: candidateLng })

        // 计算周边竞品
        const nearbyCompetitors = competitorStores
          .map(cs => ({
            name: cs.brand_name,
            distance: Math.round(getDistance(candidateLat, candidateLng,
              parseFloat(cs.latitude), parseFloat(cs.longitude)))
          }))
          .filter(c => c.distance < 1000)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 4)
          .map(c => ({ ...c, distance: `${c.distance}m` }))

        // 评分算法
        const competitorCount = nearbyCompetitors.length
        const minDistance = nearbyCompetitors[0]?.distance
          ? parseInt(nearbyCompetitors[0].distance) : 1000
        const score = Math.min(98, Math.max(55,
          85 - competitorCount * 3 + Math.floor(minDistance / 50)
        ))
        const grade = score >= 90 ? "S" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D"

        results.push({
          id: `blank_${results.length + 1}`,
          name: store.address || `${store.city}${store.district || ""}空白点${results.length + 1}`,
          latitude: candidateLat,
          longitude: candidateLng,
          lat: candidateLat,
          lng: candidateLng,
          score,
          grade,
          competitors: nearbyCompetitors,
          facilities: [],
          scores: {
            traffic: Math.floor(score * 0.32),
            competition: Math.floor(score * 0.26),
            convenience: Math.floor(score * 0.20),
            business: Math.floor(score * 0.14),
            population: Math.floor(score * 0.08),
          },
        })
      }
    }
    if (results.length >= 10) break
  }

  return results.sort((a, b) => b.score - a.score)
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // 检查用户是否登录
  const { data: { user } } = await supabase.auth.getUser()
  
  const body = await request.json()
  const { brand_id, competitor_ids, city, radius, latitude, longitude } = body
  
  // 记录查询（如果用户已登录）
  if (user) {
    await supabase.from("queries").insert({
      user_id: user.id,
      brand_id,
      competitor_ids,
      city,
      radius,
      latitude,
      longitude,
    })
  }
  
  // TODO: 这里应该调用真实的选址算法/API
  // 目前返回模拟数据
  const mockLocations = [
    {
      id: "1",
      name: "海淀区中关村软件园二期",
      latitude: 40.0587,
      longitude: 116.3038,
      score: 92,
      grade: "S",
      competitors: [
        { name: "瑞幸", distance: 200 },
        { name: "星巴克", distance: 350 },
        { name: "霸王茶姬", distance: 620 },
      ],
      facilities: {
        subway: { name: "西二旗站", distance: 280 },
        school: { name: "北京大学", distance: 1200 },
        mall: { name: "五彩城", distance: 800 },
        hospital: { name: "海淀医院", distance: 1500 },
      },
      scores: {
        traffic: 28,
        competition: 22,
        convenience: 18,
        business: 14,
        population: 10,
      },
    },
    {
      id: "2",
      name: "西城区金融街购物中心",
      latitude: 39.9147,
      longitude: 116.3625,
      score: 88,
      grade: "A",
      competitors: [
        { name: "喜茶", distance: 180 },
        { name: "奈雪", distance: 420 },
        { name: "瑞幸", distance: 90 },
        { name: "古茗", distance: 550 },
      ],
      facilities: {
        subway: { name: "金融街站", distance: 150 },
        school: { name: "北京四中", distance: 800 },
        mall: { name: "金融街购物中心", distance: 0 },
        hospital: { name: "北京医院", distance: 2000 },
      },
      scores: {
        traffic: 26,
        competition: 20,
        convenience: 19,
        business: 15,
        population: 8,
      },
    },
    {
      id: "3",
      name: "丰台区万达广场北入口",
      latitude: 39.8583,
      longitude: 116.2861,
      score: 76,
      grade: "B",
      competitors: [
        { name: "蜜雪冰城", distance: 300 },
        { name: "茶百道", distance: 450 },
      ],
      facilities: {
        subway: { name: "科怡路站", distance: 400 },
        school: { name: "丰台实验学校", distance: 600 },
        mall: { name: "万达广场", distance: 50 },
        hospital: { name: "丰台医院", distance: 1800 },
      },
      scores: {
        traffic: 22,
        competition: 18,
        convenience: 16,
        business: 12,
        population: 8,
      },
    },
    {
      id: "4",
      name: "朝阳区望京SOHO西侧底商",
      latitude: 40.0017,
      longitude: 116.4803,
      score: 85,
      grade: "A",
      competitors: [
        { name: "古茗", distance: 380 },
        { name: "霸王茶姬", distance: 520 },
        { name: "瑞幸", distance: 150 },
        { name: "茶百道", distance: 680 },
      ],
      facilities: {
        subway: { name: "望京站", distance: 280 },
        school: { name: "望京实验学校", distance: 580 },
        mall: { name: "望京SOHO", distance: 50 },
        hospital: { name: "望京医院", distance: 920 },
      },
      scores: {
        traffic: 28,
        competition: 22,
        convenience: 18,
        business: 14,
        population: 3,
      },
    },
    {
      id: "5",
      name: "东城区王府井步行街",
      latitude: 39.9147,
      longitude: 116.4103,
      score: 68,
      grade: "C",
      competitors: [
        { name: "星巴克", distance: 100 },
        { name: "瑞幸", distance: 150 },
        { name: "喜茶", distance: 200 },
        { name: "奈雪", distance: 250 },
        { name: "霸王茶姬", distance: 300 },
      ],
      facilities: {
        subway: { name: "王府井站", distance: 100 },
        school: { name: "史家胡同小学", distance: 500 },
        mall: { name: "王府井百货", distance: 100 },
        hospital: { name: "协和医院", distance: 1000 },
      },
      scores: {
        traffic: 30,
        competition: 8,
        convenience: 18,
        business: 10,
        population: 2,
      },
    },
    {
      id: "6",
      name: "通州区万达广场",
      latitude: 39.9087,
      longitude: 116.6569,
      score: 72,
      grade: "B",
      competitors: [
        { name: "蜜雪冰城", distance: 200 },
        { name: "古茗", distance: 400 },
      ],
      facilities: {
        subway: { name: "通州北关站", distance: 300 },
        school: { name: "通州区实验小学", distance: 700 },
        mall: { name: "万达广场", distance: 0 },
        hospital: { name: "通州区医院", distance: 1200 },
      },
      scores: {
        traffic: 20,
        competition: 20,
        convenience: 14,
        business: 12,
        population: 6,
      },
    },
  ]
  
  return NextResponse.json({
    locations: mockLocations,
    total: mockLocations.length,
    query: { brand_id, competitor_ids, city, radius },
  })
}

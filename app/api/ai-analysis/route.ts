import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  // 检查会员权限
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_type")
    .eq("id", user.id)
    .single()

  const membershipType = profile?.membership_type || "free"
  if (membershipType === "free") {
    return NextResponse.json({ error: "AI研判功能需要升级会员" }, { status: 403 })
  }

  const body = await request.json()
  const { location, brand, city, competitors, score, grade } = body

  const prompt = `你是一位专业的连锁品牌选址顾问，请对以下选址进行深度研判分析：

品牌：${brand}
城市：${city}
位置：${location}
评分：${score}分（${grade}级）
周边竞品：${competitors?.map((c: any) => `${c.name}(${c.distance})`).join("、") || "无"}

请从以下5个维度进行专业分析，每个维度100字左右：

1. **选址优势分析**：该位置的核心竞争力和有利条件
2. **竞品格局研判**：周边竞争态势及市场空白机会
3. **客群画像预测**：目标消费群体特征和消费潜力
4. **经营风险提示**：潜在风险点和注意事项
5. **综合建议**：是否推荐开店，以及关键成功因素

请用专业、简洁的语言输出，避免废话，直接给出有价值的判断。`

  const result = streamText({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "你是探铺AI选址顾问，专注于连锁品牌选址分析，擅长奶茶、餐饮等零售行业。回答简洁专业，直接给出结论和建议。"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    maxOutputTokens: 1000,
  })

  return result.toUIMessageStreamResponse()
}

import { NextResponse } from "next/server"
import { sendSmsCode, generateCode } from "@/lib/twilio-sms"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, message: "手机号不能为空" }, { status: 400 })
    }

    // 验证手机号格式（中国大陆或国际格式）
    const phoneRegex = /^(\+?\d{1,4})?1[3-9]\d{9}$|^\+\d{8,15}$/
    const cleanPhone = phone.replace(/\s+/g, "")
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ success: false, message: "手机号格式不正确" }, { status: 400 })
    }

    // 生成验证码
    const code = generateCode()

    // 发送短信
    const result = await sendSmsCode(cleanPhone, code)

    if (result.success) {
      // 存储验证码到数据库（5分钟有效）
      const supabase = await createClient()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      
      // 删除旧验证码
      await supabase.from("sms_codes").delete().eq("phone", cleanPhone)
      
      // 插入新验证码
      await supabase.from("sms_codes").insert({
        phone: cleanPhone,
        code,
        expires_at: expiresAt,
      })

      return NextResponse.json({ success: true, message: "验证码已发送" })
    }

    return NextResponse.json({ success: false, message: result.error || "发送失败" }, { status: 500 })
  } catch (error) {
    console.error("发送短信验证码错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}

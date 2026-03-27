import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ success: false, message: "手机号和验证码不能为空" }, { status: 400 })
    }

    const supabase = await createClient()
    const cleanPhone = phone.replace(/\s+/g, "")

    // 从数据库验证验证码
    const { data: smsCode, error: fetchError } = await supabase
      .from("sms_codes")
      .select("*")
      .eq("phone", cleanPhone)
      .eq("code", code)
      .single()

    if (fetchError || !smsCode) {
      return NextResponse.json({ success: false, message: "验证码错误" }, { status: 400 })
    }

    // 检查是否过期
    if (new Date(smsCode.expires_at) < new Date()) {
      await supabase.from("sms_codes").delete().eq("phone", cleanPhone)
      return NextResponse.json({ success: false, message: "验证码已过期" }, { status: 400 })
    }

    // 验证成功，删除验证码
    await supabase.from("sms_codes").delete().eq("phone", cleanPhone)

    // 使用手机号作为邮箱创建或登录用户
    const email = `${cleanPhone}@tanpu.phone`
    const password = `tanpu_${cleanPhone}_${process.env.SUPABASE_JWT_SECRET?.slice(0, 8) || "secret"}`

    // 先尝试登录
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInData.user) {
      return NextResponse.json({ 
        success: true, 
        message: "登录成功",
        user: signInData.user 
      })
    }

    // 如果登录失败，尝试注册
    if (signInError) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: cleanPhone,
            name: `用户${cleanPhone.slice(-4)}`,
          },
        },
      })

      if (signUpError) {
        console.error("短信登录注册失败:", signUpError)
        return NextResponse.json({ success: false, message: "登录失败，请重试" }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: "注册并登录成功",
        user: signUpData.user 
      })
    }

    return NextResponse.json({ success: false, message: "登录失败" }, { status: 500 })
  } catch (error) {
    console.error("短信验证错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}

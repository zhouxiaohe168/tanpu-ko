import { NextResponse } from "next/server"
import { checkVerifyCode } from "@/lib/twilio-sms"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ success: false, message: "手机号和验证码不能为空" }, { status: 400 })
    }

    // 格式化手机号
    let formattedPhone = phone.replace(/\s+/g, "")
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+86" + formattedPhone.replace(/^0/, "")
    }

    // 使用 Twilio Verify 验证码校验
    const result = await checkVerifyCode(formattedPhone, code)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error || "验证码错误" }, { status: 400 })
    }

    // 验证成功，使用手机号作为邮箱创建或登录用户
    const supabase = await createClient()
    const email = `${formattedPhone.replace("+", "")}@tanpu.phone`
    const password = `tanpu_${formattedPhone}_${process.env.SUPABASE_JWT_SECRET?.slice(0, 8) || "secret"}`

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
            phone: formattedPhone,
            name: `用户${formattedPhone.slice(-4)}`,
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

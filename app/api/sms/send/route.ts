import { NextResponse } from "next/server"
import { sendSmsCode, generateVerifyCode, storeVerifyCode } from "@/lib/aliyun-sms"

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, message: "手机号不能为空" }, { status: 400 })
    }

    // 验证手机号格式（中国大陆）
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ success: false, message: "手机号格式不正确" }, { status: 400 })
    }

    // 生成验证码
    const code = generateVerifyCode()

    // 发送短信
    const result = await sendSmsCode(phone, code)

    if (result.success) {
      // 存储验证码
      await storeVerifyCode(phone, code)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] 发送短信验证码错误:", error)
    return NextResponse.json({ success: false, message: "服务器错误" }, { status: 500 })
  }
}

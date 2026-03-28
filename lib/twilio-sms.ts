// Twilio Verify API - 专门用于发送验证码
// 无需购买号码，自动处理国际短信合规
// 注册地址：https://www.twilio.com/try-twilio

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID

export interface SendSmsResult {
  success: boolean
  status?: string
  error?: string
}

// 使用 Twilio Verify 发送验证码
export async function sendVerifyCode(phone: string): Promise<SendSmsResult> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    console.error("Twilio Verify 配置缺失")
    return { success: false, error: "短信服务未配置" }
  }

  // 格式化手机号（确保有国际区号）
  let formattedPhone = phone.replace(/\s+/g, "")
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+86" + formattedPhone.replace(/^0/, "")
  }

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/Verifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
        },
        body: new URLSearchParams({
          To: formattedPhone,
          Channel: "sms",
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return { success: true, status: data.status }
    } else {
      console.error("Twilio Verify 发送失败:", data)
      return { success: false, error: data.message || "发送失败" }
    }
  } catch (error) {
    console.error("Twilio Verify 请求错误:", error)
    return { success: false, error: "网络错误" }
  }
}

// 使用 Twilio Verify 验证码校验
export async function checkVerifyCode(
  phone: string,
  code: string
): Promise<SendSmsResult> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
    return { success: false, error: "短信服务未配置" }
  }

  let formattedPhone = phone.replace(/\s+/g, "")
  if (!formattedPhone.startsWith("+")) {
    formattedPhone = "+86" + formattedPhone.replace(/^0/, "")
  }

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
        },
        body: new URLSearchParams({
          To: formattedPhone,
          Code: code,
        }),
      }
    )

    const data = await response.json()

    if (response.ok && data.status === "approved") {
      return { success: true, status: "approved" }
    } else {
      return { success: false, error: "验证码错误或已过期" }
    }
  } catch (error) {
    console.error("Twilio Verify 校验错误:", error)
    return { success: false, error: "网络错误" }
  }
}

// 生成6位数字验证码（备用，Verify API 自动生成）
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

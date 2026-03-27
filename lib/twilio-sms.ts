"use server"

// Twilio 短信服务
// 注册地址：https://www.twilio.com/try-twilio
// 价格：中国大陆约 $0.05/条，香港约 $0.04/条

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER // 你的 Twilio 号码

export interface SendSmsResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendSmsCode(
  phone: string,
  code: string
): Promise<SendSmsResult> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error("Twilio 配置缺失")
    return { success: false, error: "短信服务未配置" }
  }

  // 格式化手机号（确保有国际区号）
  let formattedPhone = phone.replace(/\s+/g, "")
  if (!formattedPhone.startsWith("+")) {
    // 默认中国大陆
    formattedPhone = "+86" + formattedPhone.replace(/^0/, "")
  }

  const message = `【探铺】您的验证码是：${code}，5分钟内有效。如非本人操作，请忽略。`

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
              "base64"
            ),
        },
        body: new URLSearchParams({
          From: TWILIO_PHONE_NUMBER,
          To: formattedPhone,
          Body: message,
        }),
      }
    )

    const data = await response.json()

    if (response.ok) {
      return { success: true, messageId: data.sid }
    } else {
      console.error("Twilio 发送失败:", data)
      return { success: false, error: data.message || "发送失败" }
    }
  } catch (error) {
    console.error("Twilio 请求错误:", error)
    return { success: false, error: "网络错误" }
  }
}

// 生成6位数字验证码
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

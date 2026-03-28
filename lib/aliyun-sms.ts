"use server"

import crypto from "crypto"

// 阿里云短信服务配置
const ALIYUN_ACCESS_KEY_ID = process.env.ALIYUN_ACCESS_KEY_ID
const ALIYUN_ACCESS_KEY_SECRET = process.env.ALIYUN_ACCESS_KEY_SECRET
const ALIYUN_SMS_SIGN_NAME = process.env.ALIYUN_SMS_SIGN_NAME || "探铺"
const ALIYUN_SMS_TEMPLATE_CODE = process.env.ALIYUN_SMS_TEMPLATE_CODE || "SMS_123456789"

// 生成签名
function generateSignature(params: Record<string, string>, secret: string): string {
  const sortedKeys = Object.keys(params).sort()
  const canonicalizedQueryString = sortedKeys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")
  
  const stringToSign = `POST&${encodeURIComponent("/")}&${encodeURIComponent(canonicalizedQueryString)}`
  
  const hmac = crypto.createHmac("sha1", secret + "&")
  hmac.update(stringToSign)
  return hmac.digest("base64")
}

// 生成6位随机验证码
export function generateVerifyCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 发送短信验证码
export async function sendSmsCode(phone: string, code: string): Promise<{ success: boolean; message: string }> {
  if (!ALIYUN_ACCESS_KEY_ID || !ALIYUN_ACCESS_KEY_SECRET) {
    console.error("[v0] 阿里云短信配置缺失")
    // 开发环境模拟发送成功
    if (process.env.NODE_ENV === "development") {
      console.log(`[v0] 开发模式 - 验证码: ${code} 已发送到 ${phone}`)
      return { success: true, message: "验证码已发送（开发模式）" }
    }
    return { success: false, message: "短信服务未配置" }
  }

  const timestamp = new Date().toISOString().replace(/\.\d{3}/, "")
  const nonce = crypto.randomUUID()

  const params: Record<string, string> = {
    AccessKeyId: ALIYUN_ACCESS_KEY_ID,
    Action: "SendSms",
    Format: "JSON",
    PhoneNumbers: phone,
    RegionId: "cn-hangzhou",
    SignName: ALIYUN_SMS_SIGN_NAME,
    SignatureMethod: "HMAC-SHA1",
    SignatureNonce: nonce,
    SignatureVersion: "1.0",
    TemplateCode: ALIYUN_SMS_TEMPLATE_CODE,
    TemplateParam: JSON.stringify({ code }),
    Timestamp: timestamp,
    Version: "2017-05-25",
  }

  const signature = generateSignature(params, ALIYUN_ACCESS_KEY_SECRET)
  params.Signature = signature

  try {
    const response = await fetch("https://dysmsapi.aliyuncs.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    })

    const result = await response.json()

    if (result.Code === "OK") {
      return { success: true, message: "验证码已发送" }
    } else {
      console.error("[v0] 阿里云短信发送失败:", result)
      return { success: false, message: result.Message || "发送失败" }
    }
  } catch (error) {
    console.error("[v0] 阿里云短信请求错误:", error)
    return { success: false, message: "网络错误，请重试" }
  }
}

// 验证码存储（生产环境应使用 Redis）
const verifyCodeStore = new Map<string, { code: string; expireAt: number }>()

// 存储验证码
export async function storeVerifyCode(phone: string, code: string): Promise<void> {
  verifyCodeStore.set(phone, {
    code,
    expireAt: Date.now() + 5 * 60 * 1000, // 5分钟过期
  })
}

// 验证验证码
export async function verifyCode(phone: string, code: string): Promise<boolean> {
  const stored = verifyCodeStore.get(phone)
  if (!stored) return false
  if (Date.now() > stored.expireAt) {
    verifyCodeStore.delete(phone)
    return false
  }
  if (stored.code !== code) return false
  verifyCodeStore.delete(phone) // 验证成功后删除
  return true
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Loader2, ArrowLeft, Mail, Phone } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [authMethod, setAuthMethod] = useState<"password" | "phone">("password")
  const router = useRouter()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message === "Invalid login credentials" ? "邮箱或密码错误" : error.message)
      setLoading(false)
      return
    }
    router.push("/query")
    router.refresh()
  }

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // 发送验证码 - 使用我们自己的 Twilio Verify API
  const handleSendCode = async () => {
    if (!phone) { setError("请输入手机号码"); return }
    if (!/^1[3-9]\d{9}$/.test(phone)) { setError("请输入正确的手机号码"); return }

    setSendingCode(true)
    setError(null)

    const res = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+86${phone}` }),
    })
    const data = await res.json()

    if (!data.success) {
      setError(data.message || "发送失败，请重试")
      setSendingCode(false)
      return
    }

    setCodeSent(true)
    setSendingCode(false)
    startCountdown()
  }

  // 验证验证码并登录
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode || verificationCode.length !== 6) {
      setError("请输入6位验证码"); return
    }
    setError(null)
    setLoading(true)

    const res = await fetch("/api/sms/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+86${phone}`, code: verificationCode }),
    })
    const data = await res.json()

    if (!data.success) {
      setError(data.message || "验证码错误")
      setLoading(false)
      return
    }

    router.push("/query")
    router.refresh()
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground" asChild>
              <Link href="/"><ArrowLeft className="h-4 w-4" />返回首页</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">探铺</span>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">欢迎回来</CardTitle>
              <CardDescription>登录您的账户，开始智能选址</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={authMethod} onValueChange={(v) => {
                setAuthMethod(v as "password" | "phone")
                setError(null); setCodeSent(false); setVerificationCode("")
              }}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="password" className="gap-1">
                    <Mail className="h-4 w-4" />账号密码
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="gap-1 opacity-40 cursor-not-allowed" disabled>
                    <Phone className="h-4 w-4" />短信验证
                  </TabsTrigger>
                </TabsList>
                <p className="text-center text-xs text-muted-foreground mb-4">
                  🔧 短信登录暂时维护中，请使用账号密码登录
                </p>

                <TabsContent value="password">
                  <form onSubmit={handlePasswordLogin}>
                    <div className="grid gap-4">
                      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                      <div className="grid gap-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input id="email" type="email" placeholder="your@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">密码</Label>
                          <Link href="/auth/forgot-password" className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline">
                            忘记密码？
                          </Link>
                        </div>
                        <Input id="password" type="password" placeholder="输入密码" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />登录中...</> : "登录"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="phone">
                  <form onSubmit={handleVerifyCode}>
                    <div className="grid gap-4">
                      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                      <div className="grid gap-2">
                        <Label htmlFor="login-phone">手机号码</Label>
                        <div className="flex gap-2">
                          <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">+86</div>
                          <Input
                            id="login-phone" type="tel" placeholder="请输入手机号" maxLength={11}
                            value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            disabled={codeSent} className="flex-1"
                          />
                        </div>
                      </div>

                      {!codeSent ? (
                        <Button type="button" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" onClick={handleSendCode} disabled={sendingCode}>
                          {sendingCode ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />发送中...</> : "获取验证码"}
                        </Button>
                      ) : (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="login-code">验证码</Label>
                            <div className="flex gap-2">
                              <Input
                                id="login-code" type="text" placeholder="请输入6位验证码" maxLength={6}
                                value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                              />
                              <Button type="button" variant="outline" className="shrink-0" onClick={handleSendCode} disabled={countdown > 0 || sendingCode}>
                                {countdown > 0 ? `${countdown}s` : "重发"}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">验证码已发送至 +86 {phone}</p>
                          </div>
                          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={loading}>
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />登录中...</> : "验证并登录"}
                          </Button>
                          <Button type="button" variant="ghost" className="w-full" onClick={() => { setCodeSent(false); setVerificationCode("") }}>
                            重新输入手机号
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-sm">
                还没有账户？{" "}
                <Link href="/auth/sign-up" className="text-[#2563EB] underline-offset-4 hover:underline">立即注册</Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            登录即表示您同意我们的{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">服务条款</Link>
            {" "}和{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">隐私政策</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

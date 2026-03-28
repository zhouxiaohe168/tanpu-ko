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

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  const router = useRouter()

  // 发送验证码（邮箱）
  const handleSendEmailCode = async () => {
    if (!email) {
      setError("请输入邮箱地址")
      return
    }
    setSendingCode(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name },
      },
    })

    if (error) {
      setError(error.message)
      setSendingCode(false)
      return
    }

    setCodeSent(true)
    setSendingCode(false)
    startCountdown()
  }

  // 发送验证码（手机）
  const handleSendPhoneCode = async () => {
    if (!phone) {
      setError("请输入手机号码")
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError("请输入正确的手机号码")
      return
    }
    setSendingCode(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+86${phone}`,
      options: {
        data: { name },
      },
    })

    if (error) {
      setError(error.message)
      setSendingCode(false)
      return
    }

    setCodeSent(true)
    setSendingCode(false)
    startCountdown()
  }

  // 倒计时
  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 验证码注册/登录
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!verificationCode || verificationCode.length !== 6) {
      setError("请输入6位验证码")
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    if (authMethod === "email") {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: "email",
      })

      if (error) {
        setError("验证码错误或已过期")
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+86${phone}`,
        token: verificationCode,
        type: "sms",
      })

      if (error) {
        setError("验证码错误或已过期")
        setLoading(false)
        return
      }
    }

    router.push("/query")
    router.refresh()
  }

  // 密码注册
  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password.length < 6) {
      setError("密码至少需要6个字符")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/query`,
        data: {
          name,
        },
      },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        setError("该邮箱已被注册")
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    router.push("/auth/sign-up-success")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* 返回按钮 */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Link>
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
              <CardTitle className="text-xl">创建账户</CardTitle>
              <CardDescription>
                注册探铺，开启智能选址之旅
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={authMethod} onValueChange={(v) => {
                setAuthMethod(v as "email" | "phone")
                setError(null)
                setCodeSent(false)
                setVerificationCode("")
              }}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email" className="gap-1">
                    <Mail className="h-4 w-4" />
                    邮箱注册
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="gap-1">
                    <Phone className="h-4 w-4" />
                    手机注册
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={codeSent ? handleVerifyCode : handlePasswordSignUp}>
                    <div className="grid gap-4">
                      {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="您的姓名"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={codeSent}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={codeSent}
                        />
                      </div>

                      {!codeSent ? (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="password">密码</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="至少6个字符"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                注册中...
                              </>
                            ) : (
                              "注册"
                            )}
                          </Button>
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">或</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleSendEmailCode}
                            disabled={sendingCode}
                          >
                            {sendingCode ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                发送中...
                              </>
                            ) : (
                              "使用邮箱验证码注册"
                            )}
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="code">验证码</Label>
                            <div className="flex gap-2">
                              <Input
                                id="code"
                                type="text"
                                placeholder="请输入6位验证码"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="shrink-0"
                                onClick={handleSendEmailCode}
                                disabled={countdown > 0 || sendingCode}
                              >
                                {countdown > 0 ? `${countdown}s` : "重发"}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              验证码已发送至 {email}
                            </p>
                          </div>
                          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                验证中...
                              </>
                            ) : (
                              "验证并注册"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                              setCodeSent(false)
                              setVerificationCode("")
                            }}
                          >
                            返回密码注册
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="phone">
                  <form onSubmit={handleVerifyCode}>
                    <div className="grid gap-4">
                      {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                          {error}
                        </div>
                      )}
                      <div className="grid gap-2">
                        <Label htmlFor="phone-name">姓名</Label>
                        <Input
                          id="phone-name"
                          type="text"
                          placeholder="您的姓名"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={codeSent}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">手机号码</Label>
                        <div className="flex gap-2">
                          <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                            +86
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="请输入手机号"
                            maxLength={11}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            disabled={codeSent}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {!codeSent ? (
                        <Button
                          type="button"
                          className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                          onClick={handleSendPhoneCode}
                          disabled={sendingCode}
                        >
                          {sendingCode ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              发送中...
                            </>
                          ) : (
                            "获取验证码"
                          )}
                        </Button>
                      ) : (
                        <>
                          <div className="grid gap-2">
                            <Label htmlFor="phone-code">验证码</Label>
                            <div className="flex gap-2">
                              <Input
                                id="phone-code"
                                type="text"
                                placeholder="请输入6位验证码"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="shrink-0"
                                onClick={handleSendPhoneCode}
                                disabled={countdown > 0 || sendingCode}
                              >
                                {countdown > 0 ? `${countdown}s` : "重发"}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              验证码已发送至 +86 {phone}
                            </p>
                          </div>
                          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                验证中...
                              </>
                            ) : (
                              "验证并注册"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => {
                              setCodeSent(false)
                              setVerificationCode("")
                            }}
                          >
                            重新输入手机号
                          </Button>
                        </>
                      )}
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-center text-sm">
                已有账户？{" "}
                <Link href="/auth/login" className="text-[#2563EB] underline-offset-4 hover:underline">
                  立即登录
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            注册即表示您同意我们的{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
              服务条款
            </Link>{" "}
            和{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

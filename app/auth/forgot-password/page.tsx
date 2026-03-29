"use client"

import { useState } from "react"
import Link from "next/link"
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
import { MapPin, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError("发送失败，请检查邮箱地址是否正确")
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-secondary/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                返回登录
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
              <CardTitle className="text-xl">重置密码</CardTitle>
              <CardDescription>
                输入您的注册邮箱，我们将发送重置密码链接
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">邮件已发送</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      重置密码链接已发送至
                    </p>
                    <p className="text-sm font-medium text-[#2563EB]">{email}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      请检查收件箱（包括垃圾邮件），链接有效期为 1 小时
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { setSent(false); setEmail("") }}
                  >
                    重新发送
                  </Button>
                  <Link
                    href="/auth/login"
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    返回登录
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    {error && (
                      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="email">注册邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        "发送重置链接"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            记起密码了？{" "}
            <Link
              href="/auth/login"
              className="text-[#2563EB] underline-offset-4 hover:underline"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

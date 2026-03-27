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
import { MapPin, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message === "Invalid login credentials" ? "邮箱或密码错误" : error.message)
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
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">探铺</span>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">欢迎回来</CardTitle>
              <CardDescription>
                登录您的账户，开始智能选址
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">密码</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                      >
                        忘记密码？
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="输入密码"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        登录中...
                      </>
                    ) : (
                      "登录"
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  还没有账户？{" "}
                  <Link href="/auth/sign-up" className="text-[#2563EB] underline-offset-4 hover:underline">
                    立即注册
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            登录即表示您同意我们的{" "}
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

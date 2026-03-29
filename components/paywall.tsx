"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown, Zap, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

interface PaywallProps {
  type: "login" | "upgrade" | "limit"
  title?: string
  description?: string
  currentCount?: number
  maxCount?: number
  isLoading?: boolean
}

export function Paywall({ 
  type, 
  title, 
  description,
  currentCount = 0,
  maxCount = 3,
  isLoading = false
}: PaywallProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (type === "login") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="mx-4 w-full max-w-md border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">
              {title || "登录后查看完整数据"}
            </CardTitle>
            <CardDescription>
              {description || "登录探铺账户，解锁更多功能"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>查看完整选址分析报告</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>AI 智能研判功能</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>导出数据报告</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/auth/login">
                  登录账户
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/sign-up">免费注册</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (type === "limit") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="mx-4 w-full max-w-md border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle className="text-xl">
              {title || "今日免费查询次数已用完"}
            </CardTitle>
            <CardDescription>
              {description || `您今日已使用 ${currentCount}/${maxCount} 次免费查询`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: maxCount }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full ${
                    i < currentCount ? "bg-orange-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="space-y-3 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="font-medium">升级会员，无限查询</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 无限次数选址查询</li>
                <li>• 完整 AI 研判报告</li>
                <li>• 专属客服支持</li>
                <li>• 数据导出功能</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" size="lg" asChild>
                <Link href="/#pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  立即升级会员
                </Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">返回首页</Link>
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              免费用户每日可查询 {maxCount} 次，次日重置
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // type === "upgrade"
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-md border-border shadow-2xl">
        <CardHeader className="text-center">
          <Badge className="mx-auto mb-2 bg-gradient-to-r from-amber-500 to-orange-500">
            PRO 功能
          </Badge>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
            <Crown className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-xl">
            {title || "升级会员解锁此功能"}
          </CardTitle>
          <CardDescription>
            {description || "此功能仅对付费会员开放"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-bold text-primary">无限</p>
              <p className="text-xs text-muted-foreground">查询次数</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-bold text-primary">AI</p>
              <p className="text-xs text-muted-foreground">智能研判</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-bold text-primary">PDF</p>
              <p className="text-xs text-muted-foreground">报告导出</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-bold text-primary">VIP</p>
              <p className="text-xs text-muted-foreground">专属客服</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" size="lg" asChild>
              <Link href="/#pricing">
                <Crown className="mr-2 h-4 w-4" />
                查看会员方案
              </Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/">稍后再说</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 模糊遮罩组件，用于遮挡部分内容
export function BlurredContent({ 
  children, 
  blur = true,
  className = ""
}: { 
  children: React.ReactNode
  blur?: boolean 
  className?: string
}) {
  if (!blur) return <>{children}</>
  
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none select-none blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
        <div className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 shadow-lg">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">升级查看</span>
        </div>
      </div>
    </div>
  )
}

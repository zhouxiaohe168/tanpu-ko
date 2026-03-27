import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  const errorMessages: Record<string, string> = {
    "access_denied": "访问被拒绝",
    "invalid_request": "无效的请求",
    "unauthorized_client": "未授权的客户端",
    "server_error": "服务器错误",
  }

  const errorMessage = params?.error 
    ? (errorMessages[params.error] || `错误代码: ${params.error}`)
    : "发生了未知错误"

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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">出错了</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-sm text-muted-foreground">
                {errorMessage}
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">
                  <Link href="/auth/login">返回登录</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">返回首页</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

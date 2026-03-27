import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/10">
                <Mail className="h-8 w-8 text-[#2563EB]" />
              </div>
              <CardTitle className="text-xl">注册成功</CardTitle>
              <CardDescription>
                请查收验证邮件
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                我们已向您的邮箱发送了一封验证邮件，请点击邮件中的链接完成账户验证。
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                验证完成后即可登录使用探铺的全部功能。
              </p>
              <Button asChild className="w-full bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Link href="/auth/login">返回登录</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

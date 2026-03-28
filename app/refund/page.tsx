"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">探铺</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-foreground">退款政策</h1>
        <p className="mb-6 text-sm text-muted-foreground">最后更新日期：2024年1月1日</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. 退款原则</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              探铺致力于为用户提供优质的服务体验。我们理解在某些情况下，您可能需要申请退款。本政策说明了我们的退款条件和流程。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. 可退款情况</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">以下情况可以申请退款：</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>服务无法使用</strong>：因平台技术问题导致付费服务完全无法使用</li>
              <li><strong>重复付款</strong>：因系统故障导致的重复扣款</li>
              <li><strong>未使用的会员服务</strong>：会员服务购买后7天内，且未使用任何付费功能</li>
              <li><strong>服务严重不符</strong>：实际服务与宣传描述存在重大差异</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. 不予退款情况</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">以下情况不支持退款：</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>已使用的单次查询服务</li>
              <li>会员服务已使用超过7天或已使用付费功能</li>
              <li>因用户自身原因（如操作失误、需求变更）提出的退款</li>
              <li>违反服务条款被终止服务的账户</li>
              <li>促销活动期间购买的特价商品（除非另有说明）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. 退款金额说明</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>全额退款</strong>：符合退款条件且未使用任何服务</li>
              <li><strong>部分退款</strong>：按未使用天数比例计算（适用于月卡/年卡）</li>
              <li>退款金额将扣除第三方支付平台手续费（如有）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. 退款申请流程</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>登录您的探铺账户</li>
              <li>进入"个人中心" - "订单管理"</li>
              <li>找到需要退款的订单，点击"申请退款"</li>
              <li>填写退款原因并提交相关证明材料</li>
              <li>等待客服审核（1-3个工作日）</li>
              <li>审核通过后，退款将在5-10个工作日内原路返回</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. 退款时效</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>退款申请审核：1-3个工作日</li>
              <li>审核通过后到账时间：5-10个工作日（视支付渠道而定）</li>
              <li>微信/支付宝退款通常较快（1-3个工作日）</li>
              <li>银行卡退款可能需要更长时间（3-10个工作日）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. 特殊情况处理</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              对于本政策未涵盖的特殊情况，我们将根据具体情况酌情处理。如有争议，以探铺客服的最终解释为准。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. 联系我们</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              如有任何退款相关问题，请通过以下方式联系我们：
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>客服邮箱：refund@tanpu.com</li>
              <li>客服热线：400-XXX-XXXX（工作日 9:00-18:00）</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} 探铺. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}

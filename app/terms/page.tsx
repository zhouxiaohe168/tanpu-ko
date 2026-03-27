"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"

export default function TermsPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-foreground">服务条款</h1>
        <p className="mb-6 text-sm text-muted-foreground">最后更新日期：2024年1月1日</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. 服务说明</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              探铺（以下简称"本平台"）是一款面向连锁品牌的智能选址工具，通过大数据分析和人工智能技术，帮助用户发现潜在的商业空白点，提供周边配套分析和AI选址研判服务。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. 用户注册与账户</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>用户需提供真实、准确、完整的注册信息</li>
              <li>用户应妥善保管账户信息，对账户下的所有活动负责</li>
              <li>如发现账户被未经授权使用，应立即通知本平台</li>
              <li>本平台有权对违规账户采取限制或终止服务的措施</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. 服务内容与收费</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>免费服务</strong>：品牌密度查询、基础竞品分布查看</li>
              <li><strong>付费服务</strong>：空白点深度分析、AI选址研判、详细报告导出</li>
              <li>付费服务采用按次付费或会员订阅制，具体价格以平台公示为准</li>
              <li>已支付的费用，除法律规定外，一般不予退还</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. 数据与分析结果</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>本平台提供的数据和分析结果仅供参考，不构成任何投资建议</li>
              <li>用户应自行判断和承担基于平台数据做出决策的风险</li>
              <li>本平台不对数据的绝对准确性和实时性作出保证</li>
              <li>市场情况随时变化，历史数据不代表未来表现</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. 知识产权</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>本平台的所有内容、技术、软件、数据均受知识产权法保护</li>
              <li>未经书面授权，用户不得复制、传播、修改平台内容</li>
              <li>用户上传的内容，用户保留所有权，但授予平台使用许可</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. 用户行为规范</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">用户在使用本平台时，不得：</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>违反法律法规或侵犯他人合法权益</li>
              <li>使用自动化工具批量抓取平台数据</li>
              <li>干扰或破坏平台的正常运行</li>
              <li>利用平台从事任何非法活动</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. 免责声明</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>因不可抗力导致的服务中断，本平台不承担责任</li>
              <li>用户因自身原因导致的损失，本平台不承担责任</li>
              <li>本平台有权在必要时修改、中断或终止服务</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. 条款修改</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              本平台有权根据需要修改本服务条款。修改后的条款将在平台公示，继续使用本平台即视为接受修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. 联系方式</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              如有任何问题或建议，请通过以下方式联系我们：
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>邮箱：support@tanpu.com</li>
              <li>客服热线：400-XXX-XXXX</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. 法律适用与争议解决</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              本服务条款的解释、适用及争议解决均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方可向本平台所在地有管辖权的人民法院提起诉讼。
            </p>
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

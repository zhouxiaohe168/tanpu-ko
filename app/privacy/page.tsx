"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin } from "lucide-react"

export default function PrivacyPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-foreground">隐私政策</h1>
        <p className="mb-6 text-sm text-muted-foreground">最后更新日期：2024年1月1日</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. 引言</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              探铺（以下简称"我们"）非常重视用户的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。请在使用我们的服务前仔细阅读本政策。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. 信息收集</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">我们可能收集以下类型的信息：</p>
            
            <h3 className="mt-4 text-lg font-medium text-foreground">2.1 您主动提供的信息</h3>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>注册信息：姓名、手机号、邮箱地址</li>
              <li>查询信息：您输入的品牌、地址、查询条件</li>
              <li>支付信息：订单记录（不包括银行卡详细信息）</li>
            </ul>

            <h3 className="mt-4 text-lg font-medium text-foreground">2.2 自动收集的信息</h3>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>设备信息：设备型号、操作系统、浏览器类型</li>
              <li>日志信息：访问时间、访问页面、IP地址</li>
              <li>位置信息：仅在您授权后用于选址查询功能</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. 信息使用</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">我们使用收集的信息用于：</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>提供、维护和改进我们的服务</li>
              <li>处理您的查询请求和订单</li>
              <li>向您发送服务通知和营销信息（您可以随时退订）</li>
              <li>进行数据分析以优化产品体验</li>
              <li>防止欺诈和保障平台安全</li>
              <li>履行法律义务</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. 信息共享</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              我们不会向第三方出售您的个人信息。但在以下情况下，我们可能会共享您的信息：
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>服务提供商</strong>：与帮助我们运营的第三方服务商（如支付处理、数据分析）</li>
              <li><strong>法律要求</strong>：根据法律法规、法院命令或政府要求</li>
              <li><strong>业务转让</strong>：在公司合并、收购或资产出售时</li>
              <li><strong>您的同意</strong>：在获得您明确同意的其他情况下</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. 信息存储与安全</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>您的数据存储在安全的云服务器上，采用加密传输和存储</li>
              <li>我们实施严格的访问控制，仅授权人员可访问用户数据</li>
              <li>我们定期进行安全审计和漏洞检测</li>
              <li>尽管我们采取了合理的安全措施，但无法保证100%安全</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. 数据保留</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              我们仅在实现收集目的所需的时间内保留您的个人信息，除非法律要求更长的保留期限。当您注销账户后，我们将在合理期限内删除您的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. 您的权利</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">根据适用法律，您享有以下权利：</p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>访问权</strong>：查看我们持有的您的个人信息</li>
              <li><strong>更正权</strong>：更正不准确或不完整的信息</li>
              <li><strong>删除权</strong>：要求删除您的个人信息</li>
              <li><strong>撤回同意权</strong>：撤回之前给予的数据处理同意</li>
              <li><strong>数据可携带权</strong>：获取可机读格式的个人数据副本</li>
            </ul>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              如需行使上述权利，请通过本政策末尾的联系方式与我们联系。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Cookie 使用</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              我们使用 Cookie 和类似技术来：
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>保持您的登录状态</li>
              <li>记住您的偏好设置</li>
              <li>分析网站流量和使用情况</li>
              <li>提供个性化内容和广告</li>
            </ul>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              您可以通过浏览器设置管理或禁用 Cookie，但这可能影响部分功能的正常使用。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. 未成年人保护</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              我们的服务面向商业用户，不针对18岁以下的未成年人。如果我们发现收集了未成年人的个人信息，将立即删除相关数据。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. 隐私政策更新</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，重大变更时我们会通过邮件或站内通知告知您。请定期查阅本政策以了解最新信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. 联系我们</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>邮箱：privacy@tanpu.com</li>
              <li>客服热线：400-XXX-XXXX</li>
              <li>地址：[公司地址]</li>
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

import Link from "next/link"
import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">探铺</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              连锁品牌智能选址平台，让每一个开店决策都有数据支撑。
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">产品功能</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/query" className="transition-colors hover:text-foreground">
                  空白点查询
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  周边分析
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  AI 研判
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  竞品监控
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">支持</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  帮助中心
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  使用教程
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  API 文档
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">法律条款</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">
                  退款政策
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 探铺. 保留所有权利.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              微信公众号
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              微博
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              抖音
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

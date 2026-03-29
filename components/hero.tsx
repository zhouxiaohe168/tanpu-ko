import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>AI 驱动的智能选址平台</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            找到下一个
            <span className="text-primary">黄金铺位</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            基于海量 POI 数据与 AI 算法，为连锁品牌提供精准选址建议，快速识别竞品空白区域，降低选址风险。
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/query">
                免费体验
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/pricing">查看定价</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>热门城市：</span>
            {["上海", "北京", "深圳", "广州", "杭州", "成都", "武汉", "南京"].map((city) => (
              <Link
                key={city}
                href={`/query?city=${city}`}
                className="rounded-full border px-3 py-1 hover:border-primary hover:text-primary transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

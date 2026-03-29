import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight, MapPin } from "lucide-react"
import Link from "next/link"

const cities = ["上海", "北京", "广州", "深圳", "杭州", "成都", "武汉", "西安"]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的智能选址平台</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            发现品牌扩张的
            <span className="text-primary">黄金空白点</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            基于海量 POI 数据与 AI 算法，为连锁品牌提供精准选址建议，快速识别竞品空白区域，降低选址风险。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/query">
                免费开始选址
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/pricing">
                查看会员价格
              </Link>
            </Button>
          </div>

          {/* City Tags */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              已覆盖城市：
            </span>
            {cities.map((city) => (
              <Badge key={city} variant="secondary" className="text-xs">
                {city}
              </Badge>
            ))}
            <Badge variant="secondary" className="text-xs">更多城市持续接入</Badge>
          </div>

        </div>
      </div>
    </section>
  )
}

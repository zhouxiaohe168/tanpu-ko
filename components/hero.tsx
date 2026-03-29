import { Sparkles } from "lucide-react"
import { HeroSearch } from "@/components/hero-search"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的智能选址平台</span>
          </div>
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            连锁品牌智能选址
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              一键发现黄金空白点
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            基于海量 POI 数据与 AI 算法，为连锁品牌提供精准选址建议，快速识别竞品空白区域，降低选址风险。
          </p>
          <HeroSearch />
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Hero() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = () => {
    router.push("/query")
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>AI 驱动的智能选址平台</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            连锁品牌智能选址
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              一键发现黄金空白点
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            基于海量 POI 数据与 AI 算法，为连锁品牌提供精准选址建议，
            快速识别竞品空白区域，降低选址风险。
          </p>

          {/* Search Box */}
          <div className="mx-auto mb-8 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="输入地址或选择城市..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-12 pl-10 text-base"
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg" 
                className="h-12 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                <Search className="h-5 w-5" />
                开始探铺
              </Button>
            </div>
          </div>

          {/* Quick City Selection */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">热门城市：</span>
            {["北京", "上海", "广州", "深圳", "杭州", "成都"].map((city) => (
              <button
                key={city}
                onClick={() => setSearchValue(city)}
                className="rounded-full border border-border px-3 py-1 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

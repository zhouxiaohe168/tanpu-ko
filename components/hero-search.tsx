"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function HeroSearch() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  return (
    <>
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
          <Button onClick={() => router.push("/query")} size="lg" className="h-12 gap-2 px-8">
            <Search className="h-5 w-5" />
            开始探铺
          </Button>
        </div>
      </div>
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
    </>
  )
}

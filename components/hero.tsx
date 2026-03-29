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

  const subtitle = [
    "\u57fa\u4e8e\u6d77\u91cf POI \u6570\u636e\u4e0e AI \u7b97\u6cd5",
    "\u4e3a\u8fde\u9501\u54c1\u724c\u63d0\u4f9b\u7cbe\u51c6\u9009\u5740\u5efa\u8bae",
    "\u5feb\u901f\u8bc6\u522b\u7ade\u54c1\u7a7a\u767d\u533a\u57df",
    "\u964d\u4f4e\u9009\u5740\u98ce\u9669\u3002",
  ].join("\uff0c")

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
            <span>{"\u AI \u9a71\u52a8\u7684\u667a\u80fd\u9009\u5740\u5e73\u53f0"}</span>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {"\u8fde\u9501\u54c1\u724c\u667a\u80fd\u9009\u5740"}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {"\u4e00\u952e\u53d1\u73b0\u9ec4\u91d1\u7a7a\u767d\u70b9"}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            {subtitle}
          </p>

          <div className="mx-auto mb-8 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={"\u8f93\u5165\u5730\u5740\u6216\u9009\u62e9\u57ce\u5e02..."}
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
                {"\u5f00\u59cb\u63a2\u94fa"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">{"\u70ed\u95e8\u57ce\u5e02\uff1a"}</span>
            {["\u5317\u4eac", "\u4e0a\u6d77", "\u5e7f\u5dde", "\u6df1\u5733", "\u676d\u5dde", "\u6210\u90fd"].map((city) => (
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

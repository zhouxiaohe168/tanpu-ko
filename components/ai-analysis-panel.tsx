"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Crown, RefreshCw } from "lucide-react"
import { DefaultChatTransport } from "ai"
import { useChat } from "@ai-sdk/react"

interface AiAnalysisPanelProps {
  location: string
  brand: string
  city: string
  competitors: { name: string; distance: string }[]
  score: number
  grade: string
  isPremium: boolean
  onUpgrade?: () => void
}

export function AiAnalysisPanel({
  location,
  brand,
  city,
  competitors,
  score,
  grade,
  isPremium,
  onUpgrade,
}: AiAnalysisPanelProps) {
  const [hasStarted, setHasStarted] = useState(false)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai-analysis" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"
  const analysisText = messages
    .filter((m) => m.role === "assistant")
    .flatMap((m) => m.parts?.filter((p) => p.type === "text") ?? [])
    .map((p) => (p as any).text)
    .join("")

  const handleStart = async () => {
    if (!isPremium) {
      onUpgrade?.()
      return
    }
    setHasStarted(true)
    sendMessage({
      text: JSON.stringify({ location, brand, city, competitors, score, grade }),
    })
  }

  const handleRefresh = () => {
    sendMessage({
      text: JSON.stringify({ location, brand, city, competitors, score, grade }),
    })
  }

  if (!isPremium) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">AI 深度研判</p>
            <p className="mt-1 text-sm text-muted-foreground">
              升级会员，获取AI专业选址分析报告
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5 bg-amber-500 hover:bg-amber-600"
            onClick={onUpgrade}
          >
            <Crown className="h-4 w-4" />
            升级解锁
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI 深度研判
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              {grade}级 · {score}分
            </Badge>
            {hasStarted && !isStreaming && analysisText && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRefresh}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasStarted ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              基于周边竞品数据，AI为您生成专业选址研判报告
            </p>
            <Button size="sm" className="gap-1.5" onClick={handleStart}>
              <Sparkles className="h-4 w-4" />
              开始AI研判
            </Button>
          </div>
        ) : isStreaming && !analysisText ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI 正在分析中...
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-foreground">
            {analysisText.split("\n").map((line, i) => {
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={i} className="mt-3 font-semibold text-foreground first:mt-0">
                    {line.replace(/\*\*/g, "")}
                  </p>
                )
              }
              if (line.match(/^\d+\.\s\*\*/)) {
                const text = line.replace(/^\d+\.\s\*\*(.+?)\*\*：?/, (_, p1) => `${p1}：`)
                return (
                  <p key={i} className="mt-3 font-semibold text-foreground first:mt-0">
                    {text}
                  </p>
                )
              }
              return line ? (
                <p key={i} className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {line}
                </p>
              ) : null
            })}
            {isStreaming && (
              <span className="inline-block h-4 w-1 animate-pulse bg-primary" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

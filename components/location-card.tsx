"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Eye, Brain } from "lucide-react"

interface LocationCardProps {
  id: string
  name: string
  grade: "S" | "A" | "B" | "C" | "D"
  score: number
  competitors: Array<{ name: string; distance: string }>
  isSelected?: boolean
  onClick?: () => void
  onViewDetails?: () => void
  onAiAnalysis?: () => void
}

const gradeColors = {
  S: "bg-accent text-accent-foreground",
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-yellow-500 text-white",
  D: "bg-gray-500 text-white"
}

const gradeScoreColors = {
  S: "text-accent",
  A: "text-green-600",
  B: "text-blue-600",
  C: "text-yellow-600",
  D: "text-gray-600"
}

export function LocationCard({
  id,
  name,
  grade,
  score,
  competitors,
  isSelected,
  onClick,
  onViewDetails,
  onAiAnalysis
}: LocationCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? "border-primary bg-primary/5 ring-2 ring-primary" 
          : "border-border/50 bg-card hover:border-primary/30"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header with location name and grade */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span className="font-medium text-card-foreground leading-tight">{name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge className={`${gradeColors[grade]} px-2 py-0.5 text-xs font-bold`}>
              {grade}级
            </Badge>
            <span className={`text-lg font-bold ${gradeScoreColors[grade]}`}>
              {score}
              <span className="text-xs font-normal text-muted-foreground">分</span>
            </span>
          </div>
        </div>

        {/* Competitor tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {competitors.slice(0, 4).map((comp, index) => (
            <span 
              key={index}
              className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {comp.name} {comp.distance}
            </span>
          ))}
          {competitors.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{competitors.length - 4}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.()
            }}
          >
            <Eye className="mr-1 h-3.5 w-3.5" />
            查看详情
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-primary text-xs text-primary-foreground hover:bg-primary/90"
            onClick={(e) => {
              e.stopPropagation()
              onAiAnalysis?.()
            }}
          >
            <Brain className="mr-1 h-3.5 w-3.5" />
            AI 研判
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

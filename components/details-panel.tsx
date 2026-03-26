"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Train, 
  ShoppingBag, 
  Building2, 
  Hospital, 
  Utensils,
  Construction,
  X
} from "lucide-react"

interface DetailsPanelProps {
  isExpanded: boolean
  onToggle: () => void
  onClose: () => void
  location?: {
    name: string
    facilities: Array<{ type: string; name: string; distance: string }>
    projects: Array<{ name: string; type: string; completion: string }>
    scores: Array<{ category: string; score: number; maxScore: number }>
  }
}

const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  school: GraduationCap,
  subway: Train,
  mall: ShoppingBag,
  office: Building2,
  hospital: Hospital,
  restaurant: Utensils,
}

export function DetailsPanel({ isExpanded, onToggle, onClose, location }: DetailsPanelProps) {
  if (!location) return null

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-300 ${
        isExpanded ? "h-[60vh] md:h-[50vh]" : "h-16"
      }`}
    >
      {/* Toggle bar */}
      <div 
        className="flex h-16 cursor-pointer items-center justify-between border-b border-border/40 px-4"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{location.name}</h3>
            <p className="text-xs text-muted-foreground">点击展开详细分析</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Facilities */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  周边配套设施
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {location.facilities.map((facility, index) => {
                    const Icon = facilityIcons[facility.type] || Building2
                    return (
                      <div 
                        key={index}
                        className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{facility.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{facility.distance}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Under construction projects */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
                  <Construction className="h-4 w-4 text-accent" />
                  在建项目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {location.projects.map((project, index) => (
                    <div 
                      key={index}
                      className="rounded-md border border-border/50 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{project.name}</span>
                        <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-foreground">
                          {project.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        预计完工：{project.completion}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score breakdown */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-card-foreground">评分明细</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {location.scores.map((item, index) => (
                    <div key={index}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.category}</span>
                        <span className="font-medium text-primary">
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <Progress 
                        value={(item.score / item.maxScore) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Building2, Brain } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "品牌空白点发现",
    description: "智能分析目标品牌在各区域的覆盖密度，精准识别竞品尚未进入的黄金位置，抢占市场先机。",
    highlight: "精准定位"
  },
  {
    icon: Building2,
    title: "周边配套分析",
    description: "全面评估目标位置周边的商业配套，包括地铁、商场、学校、写字楼等，综合评判选址价值。",
    highlight: "全面分析"
  },
  {
    icon: Brain,
    title: "AI 选址研判",
    description: "基于机器学习模型，结合历史开店数据与区域特征，为每个空白点给出专业的选址评分与建议。",
    highlight: "智能决策"
  }
]

export function Features() {
  return (
    <section className="border-t border-border/40 bg-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            核心功能
          </h2>
          <p className="text-lg text-muted-foreground">
            一站式解决连锁品牌选址难题，让每一个开店决策都有数据支撑
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-2 inline-block w-fit rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
                  {feature.highlight}
                </div>
                <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

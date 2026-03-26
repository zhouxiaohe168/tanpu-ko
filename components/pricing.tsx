import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "单次查询",
    price: "9.9",
    period: "次",
    description: "适合偶尔查询的用户",
    features: [
      "单次完整查询",
      "空白点发现报告",
      "周边配套分析",
      "基础 AI 评分"
    ],
    popular: false
  },
  {
    name: "月卡会员",
    price: "199",
    period: "月",
    description: "适合频繁选址的品牌",
    features: [
      "无限次查询",
      "高级 AI 研判报告",
      "竞品动态监控",
      "数据导出功能",
      "优先客服支持"
    ],
    popular: true
  },
  {
    name: "年卡会员",
    price: "1499",
    period: "年",
    description: "最高性价比选择",
    features: [
      "月卡全部功能",
      "历史数据回溯",
      "多品牌对比分析",
      "定制化报告",
      "1 对 1 选址顾问",
      "API 接口支持"
    ],
    popular: false
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/40 bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            简单透明的定价
          </h2>
          <p className="text-lg text-muted-foreground">
            选择适合您的方案，开启智能选址之旅
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative flex flex-col ${
                plan.popular 
                  ? "border-primary bg-card shadow-lg ring-2 ring-primary" 
                  : "border-border/50 bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  最受欢迎
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-card-foreground">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6 text-center">
                  <span className="text-sm text-muted-foreground">¥</span>
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.price === "9.9" ? "立即购买" : "开通会员"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

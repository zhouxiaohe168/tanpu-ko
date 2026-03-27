"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { PRODUCTS } from "@/lib/products"

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
          {PRODUCTS.map((product) => (
            <Card 
              key={product.id} 
              className={`relative flex flex-col ${
                product.popular 
                  ? "border-primary bg-card shadow-lg ring-2 ring-primary" 
                  : "border-border/50 bg-card"
              }`}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  最受欢迎
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-card-foreground">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-foreground">{product.priceDisplay}</span>
                  <span className="text-muted-foreground">
                    /{product.type === 'one_time' ? '次' : product.type === 'monthly' ? '月' : '年'}
                  </span>
                </div>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
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
                    product.popular 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  asChild
                >
                  <Link href={`/checkout/${product.id}`}>
                    {product.type === 'one_time' ? '立即购买' : '开通会员'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

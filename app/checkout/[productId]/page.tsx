import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, MapPin } from 'lucide-react'

import { getProductById, PRODUCTS } from '@/lib/products'
import Checkout from '@/components/checkout'

interface CheckoutPageProps {
  params: Promise<{ productId: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { productId } = await params
  const product = getProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">探铺</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link 
          href="/#pricing" 
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回选择套餐
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* 订单摘要 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">订单摘要</h2>
            
            <div className="mb-6 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{product.priceDisplay}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">包含权益：</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">合计</span>
                <span className="text-xl font-bold text-foreground">{product.priceDisplay}</span>
              </div>
            </div>
          </div>

          {/* Stripe Checkout */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">支付方式</h2>
            <Checkout productId={productId} />
          </div>
        </div>
      </main>
    </div>
  )
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    productId: product.id,
  }))
}

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// 使用 service role 绕过 RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${errorMessage}`)
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // 处理支付成功事件
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === 'paid') {
      const { productId, productType, userId } = session.metadata || {}

      if (userId && productId) {
        // 计算会员到期时间
        let membershipExpiry: Date | null = null
        let membershipType = 'free'

        if (productType === 'one_time') {
          // 单次查询不更新会员状态，只增加查询次数
          membershipType = 'single'
        } else if (productType === 'monthly') {
          membershipExpiry = new Date()
          membershipExpiry.setMonth(membershipExpiry.getMonth() + 1)
          membershipType = 'monthly'
        } else if (productType === 'yearly') {
          membershipExpiry = new Date()
          membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1)
          membershipType = 'yearly'
        }

        // 更新用户会员状态
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            membership_type: membershipType,
            membership_expiry: membershipExpiry?.toISOString(),
            queries_remaining: productType === 'one_time' 
              ? supabaseAdmin.rpc('increment_queries', { user_id: userId })
              : null,
          })
          .eq('id', userId)

        if (profileError) {
          console.error('Error updating profile:', profileError)
        }

        // 记录订单
        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            product_id: productId,
            amount: session.amount_total,
            currency: session.currency,
            status: 'completed',
            stripe_session_id: session.id,
          })

        if (orderError) {
          console.error('Error creating order:', orderError)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}

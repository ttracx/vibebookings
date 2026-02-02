import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionData = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as Stripe.Subscription

        await prisma.subscription.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            stripeSubscriptionId: subscriptionData.id,
            stripePriceId: subscriptionData.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              (subscriptionData as any).current_period_end * 1000
            ),
            status: 'ACTIVE',
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        if (!invoice.subscription) break
        
        const subscriptionData = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        ) as Stripe.Subscription

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscriptionData.id },
          data: {
            stripePriceId: subscriptionData.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              (subscriptionData as any).current_period_end * 1000
            ),
            status: 'ACTIVE',
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: 'CANCELLED',
          },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

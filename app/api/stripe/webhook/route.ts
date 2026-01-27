import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const businessSlug = session.metadata?.businessSlug

        if (businessSlug) {
          // Get leander location
          const { data: location } = await supabase
            .from('locations')
            .select('id')
            .eq('slug', 'leander')
            .single()

          if (location) {
            // Upgrade business to featured tier
            await supabase
              .from('businesses')
              .update({
                listing_tier: 'featured',
                is_featured: true,
                premium_since: new Date().toISOString(),
                last_updated: new Date().toISOString(),
              })
              .eq('location_id', location.id)
              .eq('slug', businessSlug)

            console.log(`Business ${businessSlug} upgraded to featured tier`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription cancellation - downgrade business
        console.log('Subscription cancelled:', subscription.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

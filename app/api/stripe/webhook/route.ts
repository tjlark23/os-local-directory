import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

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

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('Checkout completed:', {
        businessId: session.metadata?.businessId,
        businessName: session.metadata?.businessName,
      })

      // Update business listing tier to 'featured' if businessId exists
      if (session.metadata?.businessId) {
        // Get location ID
        const { data: location } = await supabase
          .from('locations')
          .select('id')
          .eq('slug', 'leander')
          .single()

        if (location) {
          await supabase
            .from('businesses')
            .update({
              listing_tier: 'featured',
              is_featured: true,
              premium_since: new Date().toISOString(),
              backlink_enabled: true,
            })
            .eq('location_id', location.id)
            .eq('slug', session.metadata.businessId)
        }
      }

      // Also save to inquiries for tracking
      const { data: location } = await supabase
        .from('locations')
        .select('id')
        .eq('slug', 'leander')
        .single()

      await supabase
        .from('business_inquiries')
        .insert({
          location_id: location?.id || null,
          business_name: session.metadata?.businessName || 'Unknown',
          contact_name: 'Stripe Customer',
          email: session.customer_email || '',
          interested_in: 'Featured Listing ($49/mo) - PAID',
          message: `Stripe subscription activated. Session ID: ${session.id}`,
          status: 'paid',
        })

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription updated:', subscription.id)
      // Handle subscription updates (e.g., payment method changes)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription canceled:', subscription.id)

      // Downgrade the business listing to free
      if (subscription.metadata?.businessId) {
        const { data: location } = await supabase
          .from('locations')
          .select('id')
          .eq('slug', 'leander')
          .single()

        if (location) {
          await supabase
            .from('businesses')
            .update({
              listing_tier: 'free',
              is_featured: false,
              backlink_enabled: false,
            })
            .eq('location_id', location.id)
            .eq('slug', subscription.metadata.businessId)
        }
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Payment failed:', invoice.id)
      // Could send notification email here
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

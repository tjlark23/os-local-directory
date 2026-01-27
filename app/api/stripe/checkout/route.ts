import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_FEATURED_PRICE_ID } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, businessId, businessSlug, email, returnUrl } = body

    // Accept either businessId or businessSlug
    const slug = businessSlug || businessId || 'new-listing'

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    if (!STRIPE_FEATURED_PRICE_ID) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured' },
        { status: 500 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_FEATURED_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      metadata: {
        businessSlug: slug,
        businessName,
      },
      success_url: `${siteUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}&business=${encodeURIComponent(slug)}`,
      cancel_url: returnUrl || `${siteUrl}/upgrade?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

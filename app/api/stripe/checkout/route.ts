import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_FEATURED_PRICE_ID } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, email, businessId } = body

    // Create Stripe checkout session for Featured Listing ($49/month)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_FEATURED_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        businessId: businessId || '',
        businessName: businessName,
        plan: 'featured',
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/upgrade?canceled=true`,
      subscription_data: {
        metadata: {
          businessId: businessId || '',
          businessName: businessName,
          plan: 'featured',
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

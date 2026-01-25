import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { businessName, contactName, email, phone, plan, businessId } = body

    // Get the location ID for Leander
    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', 'leander')
      .single()

    // Save the inquiry to the business_inquiries table
    const { error } = await supabase
      .from('business_inquiries')
      .insert({
        location_id: location?.id || null,
        business_name: businessName,
        contact_name: contactName,
        email: email,
        phone: phone || null,
        currently_listed: !!businessId,
        interested_in: plan === 'featured' ? 'Featured Listing ($99/mo)' : 'Premium Listing ($50/mo)',
        message: businessId ? `Upgrade request for existing listing: ${businessId}` : 'New premium listing inquiry',
        status: 'pending',
      })

    if (error) {
      console.error('Error saving upgrade inquiry:', error)
      return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing upgrade request:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

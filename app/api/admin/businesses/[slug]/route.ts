import { NextRequest, NextResponse } from 'next/server'
import { updateBusiness, getBusinessBySlugForAdmin } from '@/lib/db'

type RouteContext = {
  params: Promise<{ slug: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { slug } = await context.params

  try {
    const business = await getBusinessBySlugForAdmin(slug)

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json(business)
  } catch (error) {
    console.error('Error fetching business:', error)
    return NextResponse.json({ error: 'Failed to fetch business' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { slug } = await context.params

  try {
    const body = await request.json()

    // Map the form data to database columns
    const updates: Record<string, unknown> = {}

    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.customDescription !== undefined) updates.custom_description = body.customDescription
    if (body.category !== undefined) updates.category = body.category
    if (body.subcategory !== undefined) updates.subcategory = body.subcategory
    if (body.phone !== undefined) updates.phone = body.phone
    if (body.email !== undefined) updates.email = body.email
    if (body.website !== undefined) updates.website = body.website
    if (body.priceRange !== undefined) updates.price_range = body.priceRange
    if (body.photos !== undefined) updates.photos = body.photos
    if (body.videos !== undefined) updates.videos = body.videos
    if (body.hours !== undefined) updates.hours = body.hours
    if (body.specialties !== undefined) updates.specialties = body.specialties
    if (body.listingTier !== undefined) updates.listing_tier = body.listingTier
    if (body.isFeatured !== undefined) updates.is_featured = body.isFeatured
    if (body.backlinkEnabled !== undefined) updates.backlink_enabled = body.backlinkEnabled
    if (body.premiumSince !== undefined) updates.premium_since = body.premiumSince
    if (body.socialLinks !== undefined) updates.social_links = body.socialLinks
    if (body.dealsBanner !== undefined) updates.deals_banner = body.dealsBanner

    // Handle address fields
    if (body.address) {
      if (body.address.street !== undefined) updates.address_street = body.address.street
      if (body.address.city !== undefined) updates.address_city = body.address.city
      if (body.address.state !== undefined) updates.address_state = body.address.state
      if (body.address.zip !== undefined) updates.address_zip = body.address.zip
    }

    const result = await updateBusiness(slug, updates as Parameters<typeof updateBusiness>[1])

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating business:', error)
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 })
  }
}

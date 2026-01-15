import { supabase } from './supabase'
import type { Location, Business, BusinessInsert, BusinessInquiryInsert } from './database.types'
import type { Business as AppBusiness, ListingTier } from './types'

// Transform database business to app business format
function transformBusiness(dbBusiness: Business): AppBusiness {
  return {
    id: dbBusiness.slug,
    name: dbBusiness.name,
    description: dbBusiness.description,
    customDescription: dbBusiness.custom_description || undefined,
    category: dbBusiness.category,
    subcategory: dbBusiness.subcategory || undefined,
    image: dbBusiness.image,
    photos: dbBusiness.photos,
    videos: dbBusiness.videos,
    phone: dbBusiness.phone,
    email: dbBusiness.email || undefined,
    website: dbBusiness.website || undefined,
    address: {
      street: dbBusiness.address_street,
      city: dbBusiness.address_city,
      state: dbBusiness.address_state,
      zip: dbBusiness.address_zip,
    },
    coordinates: dbBusiness.latitude && dbBusiness.longitude ? {
      lat: Number(dbBusiness.latitude),
      lng: Number(dbBusiness.longitude),
    } : undefined,
    hours: dbBusiness.hours as AppBusiness['hours'],
    rating: Number(dbBusiness.rating),
    reviewCount: dbBusiness.review_count,
    priceRange: dbBusiness.price_range || undefined,
    yearEstablished: dbBusiness.year_established || undefined,
    owner: dbBusiness.owner || undefined,
    specialties: dbBusiness.specialties,
    amenities: (dbBusiness.amenities || []).map(a => {
      const amenity = a as { name: string; icon: string }
      return { name: amenity.name, icon: amenity.icon }
    }),
    tags: dbBusiness.tags,
    socialLinks: dbBusiness.social_links as AppBusiness['socialLinks'],
    listingTier: dbBusiness.listing_tier as ListingTier,
    isFeatured: dbBusiness.is_featured,
    premiumSince: dbBusiness.premium_since || undefined,
    backlinkEnabled: dbBusiness.backlink_enabled,
    lastUpdated: dbBusiness.last_updated,
  }
}

// Location-related queries
export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data
}

export async function getLocationByDomain(domain: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('domain', domain)
    .single()

  if (error || !data) return null
  return data
}

export async function getAllLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name')

  if (error || !data) return []
  return data
}

// Business-related queries
export async function getBusinessesByLocation(locationId: string): Promise<AppBusiness[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', locationId)
    .order('name')

  if (error || !data) return []
  return data.map(transformBusiness)
}

export async function getBusinessBySlug(locationId: string, slug: string): Promise<AppBusiness | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', locationId)
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return transformBusiness(data)
}

export async function getFeaturedBusinesses(locationId: string, limit = 6): Promise<AppBusiness[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', locationId)
    .in('listing_tier', ['premium', 'featured'])
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data.map(transformBusiness)
}

export async function searchBusinesses(
  locationId: string,
  options: {
    query?: string
    category?: string
    city?: string
    tier?: ListingTier
    limit?: number
    offset?: number
  } = {}
): Promise<AppBusiness[]> {
  let queryBuilder = supabase
    .from('businesses')
    .select('*')
    .eq('location_id', locationId)

  if (options.category) {
    queryBuilder = queryBuilder.eq('category', options.category)
  }

  if (options.city) {
    queryBuilder = queryBuilder.eq('address_city', options.city)
  }

  if (options.tier) {
    queryBuilder = queryBuilder.eq('listing_tier', options.tier)
  }

  if (options.query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${options.query}%,description.ilike.%${options.query}%,tags.cs.{${options.query}}`)
  }

  queryBuilder = queryBuilder.order('is_featured', { ascending: false })
    .order('listing_tier', { ascending: false })
    .order('rating', { ascending: false })

  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit)
  }

  if (options.offset) {
    queryBuilder = queryBuilder.range(options.offset, options.offset + (options.limit || 20) - 1)
  }

  const { data, error } = await queryBuilder

  if (error || !data) return []
  return data.map(transformBusiness)
}

export async function getBusinessStats(locationId: string): Promise<{
  total: number
  free: number
  premium: number
  featured: number
}> {
  const { data, error } = await supabase
    .from('businesses')
    .select('listing_tier')
    .eq('location_id', locationId)

  if (error || !data) {
    return { total: 0, free: 0, premium: 0, featured: 0 }
  }

  return {
    total: data.length,
    free: data.filter(b => b.listing_tier === 'free').length,
    premium: data.filter(b => b.listing_tier === 'premium').length,
    featured: data.filter(b => b.listing_tier === 'featured').length,
  }
}

// Business inquiry submission
export async function submitBusinessInquiry(inquiry: BusinessInquiryInsert): Promise<boolean> {
  const { error } = await supabase
    .from('business_inquiries')
    .insert(inquiry)

  return !error
}

// Categories - these are static for now
export const CATEGORIES = [
  { id: "restaurants", name: "Restaurants & Dining", icon: "utensils", count: 0 },
  { id: "shopping", name: "Shopping & Retail", icon: "shopping-bag", count: 0 },
  { id: "services", name: "Professional Services", icon: "briefcase", count: 0 },
  { id: "health", name: "Health & Wellness", icon: "heart", count: 0 },
  { id: "automotive", name: "Automotive", icon: "car", count: 0 },
  { id: "home", name: "Home & Garden", icon: "home", count: 0 },
  { id: "entertainment", name: "Entertainment", icon: "music", count: 0 },
  { id: "beauty", name: "Beauty & Spa", icon: "scissors", count: 0 },
  { id: "education", name: "Education", icon: "graduation-cap", count: 0 },
  { id: "pets", name: "Pets & Animals", icon: "paw-print", count: 0 },
  { id: "fitness", name: "Fitness & Sports", icon: "dumbbell", count: 0 },
  { id: "financial", name: "Financial Services", icon: "landmark", count: 0 },
]

export async function getCategoriesWithCounts(locationId: string): Promise<typeof CATEGORIES> {
  const { data, error } = await supabase
    .from('businesses')
    .select('category')
    .eq('location_id', locationId)

  if (error || !data) return CATEGORIES

  const counts = data.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return CATEGORIES.map(cat => ({
    ...cat,
    count: counts[cat.id] || 0,
  }))
}

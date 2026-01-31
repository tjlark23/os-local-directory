import { Metadata } from "next"
import { BusinessPageClient } from "@/components/business-page-client"
import { notFound } from "next/navigation"
import Script from "next/script"
import { supabase } from "@/lib/supabase"

// Category placeholder images
const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  restaurants: "/images/placeholders/restaurant.svg",
  health: "/images/placeholders/health.svg",
  beauty: "/images/placeholders/beauty.svg",
  fitness: "/images/placeholders/fitness.svg",
  automotive: "/images/placeholders/automotive.svg",
  shopping: "/images/placeholders/shopping.svg",
  services: "/images/placeholders/services.svg",
  education: "/images/placeholders/education.svg",
  pets: "/images/placeholders/pets.svg",
  financial: "/images/placeholders/financial.svg",
  home: "/images/placeholders/home.svg",
  entertainment: "/images/placeholders/entertainment.svg",
}

// Fetch business from Supabase by slug
async function getBusinessBySlug(slug: string) {
  // First get the location ID for Leander
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return null

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', location.id)
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  // Transform to app format
  return transformBusiness(data)
}

// Fetch initial reviews for a business (server-side)
// Deduplicates by review text to prevent showing same review twice
async function getBusinessReviews(businessId: string, limit = 5) {
  // Fetch more than needed to account for deduplication
  const { data, error } = await supabase
    .from('reviews')
    .select('id, author_name, author_image, rating, text, review_date, likes')
    .eq('business_id', businessId)
    .order('review_date', { ascending: false, nullsFirst: false })
    .limit(limit * 2)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  if (!data) return []

  // Deduplicate by review text (same text = duplicate review)
  const seen = new Set<string>()
  const uniqueReviews = data.filter(review => {
    // Create a key from the first 100 chars of text (handles slight variations)
    const textKey = (review.text || '').substring(0, 100).toLowerCase().trim()
    if (seen.has(textKey)) {
      return false
    }
    seen.add(textKey)
    return true
  })

  return uniqueReviews.slice(0, limit)
}

// Fetch similar businesses from Supabase
async function getSimilarBusinesses(slug: string, category: string, limit = 8) {
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return []

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', location.id)
    .eq('category', category)
    .neq('slug', slug)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map(transformBusiness)
}

// Normalize state abbreviation (some data has "Te" instead of "TX")
function normalizeState(state: string) {
  if (!state) return 'TX'
  const normalized = state.trim().toUpperCase()
  if (normalized === 'TE' || normalized === 'TEXAS') return 'TX'
  return normalized.length > 2 ? 'TX' : normalized
}

// Generate a realistic rating breakdown based on total reviews and average rating
function generateRatingBreakdown(total: number, avgRating: number): { 5: number; 4: number; 3: number; 2: number; 1: number } {
  if (total === 0) {
    return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  }

  // Generate a realistic distribution based on average rating
  // Higher average = more 5-star reviews, fewer low ratings
  const distributions: Record<string, number[]> = {
    "4.9": [0.85, 0.10, 0.03, 0.01, 0.01],
    "4.8": [0.75, 0.15, 0.06, 0.02, 0.02],
    "4.7": [0.65, 0.20, 0.08, 0.04, 0.03],
    "4.6": [0.55, 0.25, 0.12, 0.05, 0.03],
    "4.5": [0.50, 0.28, 0.12, 0.06, 0.04],
    "4.4": [0.45, 0.30, 0.14, 0.07, 0.04],
    "4.3": [0.40, 0.32, 0.16, 0.07, 0.05],
    "4.2": [0.35, 0.33, 0.18, 0.08, 0.06],
    "4.1": [0.32, 0.33, 0.20, 0.09, 0.06],
    "4.0": [0.30, 0.35, 0.20, 0.09, 0.06],
  }

  // Round rating to nearest 0.1 and clamp between 4.0 and 4.9
  const roundedRating = Math.min(4.9, Math.max(4.0, Math.round(avgRating * 10) / 10)).toFixed(1)
  const dist = distributions[roundedRating] || distributions["4.5"]

  // Calculate counts based on distribution
  const counts = dist.map(p => Math.round(total * p))

  // Adjust to ensure total matches
  const actualTotal = counts.reduce((a, b) => a + b, 0)
  const diff = total - actualTotal
  if (diff !== 0) {
    counts[0] += diff // Add difference to 5-star reviews
  }

  return {
    5: Math.max(0, counts[0]),
    4: Math.max(0, counts[1]),
    3: Math.max(0, counts[2]),
    2: Math.max(0, counts[3]),
    1: Math.max(0, counts[4]),
  }
}

// Category display names for better descriptions
const CATEGORY_NAMES: Record<string, string> = {
  restaurants: "restaurant",
  health: "health & wellness provider",
  beauty: "beauty salon",
  fitness: "fitness center",
  automotive: "automotive service provider",
  shopping: "retail store",
  services: "professional service provider",
  education: "educational institution",
  pets: "pet services provider",
  financial: "financial services provider",
  home: "home services provider",
  entertainment: "entertainment venue",
}

// Generate a better description based on business details
function generateBetterDescription(business: any): string {
  const name = business.name
  const city = business.address_city || 'Leander'
  const category = business.category
  const categoryName = CATEGORY_NAMES[category] || "business"
  const rating = Number(business.rating) || 0
  const reviewCount = business.review_count || 0
  const specialties = business.specialties || []
  const tags = business.tags || []

  let description = `${name} is a ${categoryName} serving the ${city}, TX area`

  // Add rating info if available
  if (rating > 0 && reviewCount > 0) {
    description += ` with a ${rating.toFixed(1)}-star rating from ${reviewCount} reviews`
  }

  description += "."

  // Add specialties if available
  if (specialties.length > 0) {
    const topSpecialties = specialties.slice(0, 3).join(", ")
    description += ` Known for ${topSpecialties}.`
  } else if (tags.length > 0) {
    // Use tags as a fallback
    const topTags = tags.slice(0, 3).join(", ")
    description += ` Specializing in ${topTags}.`
  }

  return description
}

// Check if description mentions a wrong city
function descriptionHasCityMismatch(description: string, actualCity: string): boolean {
  if (!description || !actualCity) return false

  const descLower = description.toLowerCase()
  const actualCityLower = actualCity.toLowerCase()

  // List of all WilCo cities to check for
  const allCities = ['leander', 'cedar park', 'liberty hill', 'round rock', 'georgetown', 'pflugerville', 'hutto', 'taylor', 'austin']

  // Check if description mentions a different city
  for (const city of allCities) {
    if (city !== actualCityLower && descLower.includes(`in ${city}`) || descLower.includes(`located in ${city}`)) {
      return true
    }
  }

  return false
}

// Transform database business to app format
function transformBusiness(dbBusiness: any) {
  // Priority: 1) custom_description, 2) valid database description (without city mismatch), 3) generated description
  let description = ''
  const actualCity = dbBusiness.address_city || ''

  // Use custom description if available (admin/owner set)
  if (dbBusiness.custom_description && dbBusiness.custom_description.trim()) {
    description = dbBusiness.custom_description
  }
  // Use database description if it's valid (not JSON, not empty, not too short, no city mismatch)
  else if (dbBusiness.description &&
           !dbBusiness.description.startsWith('{') &&
           !dbBusiness.description.startsWith('[') &&
           dbBusiness.description.trim().length > 20 &&
           !descriptionHasCityMismatch(dbBusiness.description, actualCity)) {
    description = dbBusiness.description
  }
  // Generate a better fallback description using the CORRECT city
  else {
    description = generateBetterDescription(dbBusiness)
  }

  // Normalize state
  const state = normalizeState(dbBusiness.address_state)

  // Get placeholder image based on category
  const placeholderImage = CATEGORY_PLACEHOLDERS[dbBusiness.category] || "/images/placeholders/services.svg"

  // Check if image is valid (not a placeholder or broken)
  let image = dbBusiness.image
  if (!image || image.includes('placeholder')) {
    image = placeholderImage
  }

  const rating = Number(dbBusiness.rating) || 0
  const reviewCount = dbBusiness.review_count || 0

  return {
    id: dbBusiness.slug,
    uuid: dbBusiness.id, // Actual database UUID for queries
    name: dbBusiness.name,
    description: description,
    shortDescription: description.length > 150 ? description.slice(0, 150) + '...' : description,
    customDescription: dbBusiness.custom_description || undefined,
    category: dbBusiness.category,
    subcategory: dbBusiness.subcategory || undefined,
    filterCategory: dbBusiness.category, // Use same as category
    image: image,
    photos: dbBusiness.photos || [],
    videos: dbBusiness.videos || [],
    phone: dbBusiness.phone || '',
    email: dbBusiness.email || undefined,
    website: dbBusiness.website || undefined,
    address: {
      street: dbBusiness.address_street || '',
      city: dbBusiness.address_city || '',
      state: state,
      zip: dbBusiness.address_zip || '',
      full: `${dbBusiness.address_street || ''}, ${dbBusiness.address_city || ''}, ${state} ${dbBusiness.address_zip || ''}`,
    },
    latitude: dbBusiness.latitude ? Number(dbBusiness.latitude) : undefined,
    longitude: dbBusiness.longitude ? Number(dbBusiness.longitude) : undefined,
    hours: dbBusiness.hours || {
      monday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
      tuesday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
      wednesday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
      thursday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
      friday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
      saturday: { open: "10:00 AM", close: "4:00 PM", isOpen: true },
      sunday: { open: "Closed", close: "Closed", isOpen: false },
    },
    // Don't show Open/Closed badge - hours data is not reliable enough
    currentlyOpen: undefined,
    rating: rating,
    reviewCount: reviewCount,
    priceRange: dbBusiness.price_range || '$',
    yearEstablished: dbBusiness.year_established || undefined,
    owner: dbBusiness.owner || undefined,
    specialties: dbBusiness.specialties || [],
    amenities: (dbBusiness.amenities || []).map((a: any) => ({
      name: a?.name || a,
      icon: a?.icon || 'check'
    })),
    tags: dbBusiness.tags || [],
    socialLinks: dbBusiness.social_links || undefined,
    listingTier: dbBusiness.listing_tier || 'free',
    isFeatured: dbBusiness.is_featured || false,
    featured: dbBusiness.is_featured || false,
    premiumSince: dbBusiness.premium_since || undefined,
    backlinkEnabled: dbBusiness.backlink_enabled || false,
    dealsBanner: dbBusiness.deals_banner || undefined,
    lastUpdated: dbBusiness.last_updated,
    claimed: true,
    quickStats: {
      overallRating: rating,
      totalReviews: reviewCount,
      responseRate: "N/A",
      avgResponseTime: "N/A",
    },
    ratingBreakdown: generateRatingBreakdown(reviewCount, rating),
  }
}

// Generate dynamic metadata for each business
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const business = await getBusinessBySlug(id)

  if (!business) {
    return {
      title: "Business Not Found | WilCo Guide",
    }
  }

  const title = `${business.name} - ${business.category} in ${business.address.city}, TX`
  const description = `${business.shortDescription || business.description.slice(0, 155)}... Read reviews, get directions, and contact ${business.name} in ${business.address.city}, Texas.`

  return {
    title,
    description,
    keywords: [
      business.name,
      business.category,
      `${business.category} ${business.address.city}`,
      `${business.address.city} Texas`,
      ...business.tags,
      ...business.specialties.slice(0, 5),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://wilcoguide.com/business/${business.id}`,
      images: business.image ? [{ url: business.image, alt: business.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://wilcoguide.com/business/${business.id}`,
    },
  }
}

// JSON-LD structured data for local business
function generateJsonLd(business: any) {
  const isPremium = business.listingTier === "premium" || business.listingTier === "featured"

  const baseSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://wilcoguide.com/business/${business.id}`,
    name: business.name,
    description: business.customDescription || business.description,
    image: business.photos.length > 0 ? business.photos : business.image,
    telephone: business.phone,
    url: business.website,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: "US",
    },
    geo: business.latitude && business.longitude ? {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude,
    } : undefined,
    aggregateRating: business.reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    priceRange: business.priceRange,
  }

  return baseSchema
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const business = await getBusinessBySlug(id)

  if (!business) {
    notFound()
  }

  // Fetch reviews and similar businesses in parallel
  const [similarBusinesses, initialReviews] = await Promise.all([
    getSimilarBusinesses(id, business.category, 8),
    getBusinessReviews(business.uuid, 5)
  ])

  const jsonLd = generateJsonLd(business)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BusinessPageClient
        business={business}
        similarBusinesses={similarBusinesses}
        initialReviews={initialReviews}
      />
    </>
  )
}

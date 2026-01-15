import { Metadata } from "next"
import { BusinessPageHeader } from "@/components/business-page-header"
import { BusinessPageContent } from "@/components/business-page-content"
import { BusinessSidebar } from "@/components/business-sidebar"
import { BusinessReviewsSection } from "@/components/business-reviews-section"
import { SimilarBusinesses } from "@/components/similar-businesses"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
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

// Fetch similar businesses from Supabase
async function getSimilarBusinesses(slug: string, category: string, limit = 4) {
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

// Transform database business to app format
function transformBusiness(dbBusiness: any) {
  // Clean up description - remove JSON if present
  let description = dbBusiness.description || ''
  if (description.startsWith('{') || description.startsWith('[')) {
    description = `${dbBusiness.name} is a local business in ${dbBusiness.address_city}, TX.`
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

  return {
    id: dbBusiness.slug,
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
    currentlyOpen: true,
    rating: Number(dbBusiness.rating) || 0,
    reviewCount: dbBusiness.review_count || 0,
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
    lastUpdated: dbBusiness.last_updated,
    claimed: true,
    quickStats: {
      overallRating: Number(dbBusiness.rating) || 0,
      totalReviews: dbBusiness.review_count || 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
    },
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  }
}

// Generate dynamic metadata for each business
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const business = await getBusinessBySlug(id)

  if (!business) {
    return {
      title: "Business Not Found | Leander Scoop Directory",
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
      url: `https://directory.leanderscoop.com/business/${business.id}`,
      images: business.image ? [{ url: business.image, alt: business.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://directory.leanderscoop.com/business/${business.id}`,
    },
  }
}

// JSON-LD structured data for local business
function generateJsonLd(business: any) {
  const isPremium = business.listingTier === "premium" || business.listingTier === "featured"

  const baseSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://directory.leanderscoop.com/business/${business.id}`,
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

  const similarBusinesses = await getSimilarBusinesses(id, business.category, 4)
  const jsonLd = generateJsonLd(business)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Script
        id="business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-muted/30">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>
          </Button>
        </div>

        <BusinessPageHeader business={business} />

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <BusinessPageContent business={business} />
              <BusinessReviewsSection business={business} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <BusinessSidebar business={business} />
                {similarBusinesses.length > 0 && (
                  <SimilarBusinesses businesses={similarBusinesses} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

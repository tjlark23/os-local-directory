/**
 * Programmatic SEO Page: /[category]/[city]
 *
 * Dynamic route that generates unique pages for each category+city combination.
 * Example URLs:
 * - /restaurants/cedar-park-tx
 * - /dentists/round-rock-tx
 * - /plumbers/georgetown-tx
 *
 * Each page is unique because it:
 * 1. Uses real aggregate stats from the database
 * 2. Generates unique intro text based on data
 * 3. Shows top picks with reasoning
 * 4. Includes city-specific facts
 * 5. Has proper schema markup
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryCityTemplate } from '@/components/programmatic/CategoryCityTemplate'
import {
  getAggregatedStats,
  generateUniqueContent,
} from '@/components/programmatic/DataAggregator'
import {
  generatePageMeta,
  generateSchemaMarkup,
  generateFAQSchema,
} from '@/lib/seo/programmatic'
import { CITIES, getCityBySlug, type CityConfig } from '@/lib/locations-config'
import { createServerClient } from '@/lib/supabase'

// ============================================================
// CONFIGURATION
// ============================================================

// All valid categories
const VALID_CATEGORIES = [
  'restaurants',
  'health',
  'beauty',
  'fitness',
  'automotive',
  'shopping',
  'services',
  'education',
  'pets',
  'financial',
  'home',
  'entertainment',
] as const

type ValidCategory = typeof VALID_CATEGORIES[number]

// Category display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'restaurants': 'Restaurants',
  'health': 'Health & Wellness',
  'beauty': 'Beauty & Spa',
  'fitness': 'Fitness & Sports',
  'automotive': 'Auto Services',
  'shopping': 'Shopping & Retail',
  'services': 'Professional Services',
  'education': 'Education',
  'pets': 'Pets & Animals',
  'financial': 'Financial Services',
  'home': 'Home Services',
  'entertainment': 'Entertainment',
}

// ============================================================
// STATIC PARAMS GENERATION
// ============================================================

/**
 * Generate static params for all category+city combinations
 * This enables static generation for better performance
 */
export async function generateStaticParams() {
  const params: { category: string; city: string }[] = []

  for (const city of CITIES) {
    for (const category of VALID_CATEGORIES) {
      params.push({
        category,
        city: city.slug,
      })
    }
  }

  return params
}

// ============================================================
// METADATA GENERATION
// ============================================================

/**
 * Generate unique metadata for each page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; city: string }>
}): Promise<Metadata> {
  const { category, city: citySlug } = await params

  // Validate category
  if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
    return {
      title: 'Category Not Found | WilCo Guide',
      description: 'The category you are looking for does not exist.',
    }
  }

  // Validate city
  const city = getCityBySlug(citySlug)
  if (!city) {
    return {
      title: 'City Not Found | WilCo Guide',
      description: 'The city you are looking for does not exist.',
    }
  }

  // Get stats for unique description
  const stats = await getAggregatedStats(category, city.name)
  const categoryDisplay = CATEGORY_DISPLAY_NAMES[category] || category

  // Generate meta using our SEO utility
  const meta = generatePageMeta(
    category,
    categoryDisplay,
    city,
    stats || {
      totalBusinesses: 0,
      totalReviews: 0,
      averageRating: 0,
      highestRating: 0,
      lowestRating: 0,
      pricingDistribution: { '$': 0, '$$': 0, '$$$': 0, '$$$$': 0, unknown: 0 },
      ratingDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
      topRatedBusinesses: [],
      mostReviewedBusinesses: [],
      recentlyAddedBusinesses: [],
      categoryInsights: {
        avgReviewsPerBusiness: 0,
        percentWithWebsite: 0,
        percentWithPhone: 0,
        percentFeatured: 0,
        percentWithPhotos: 0,
        mostCommonPriceRange: 'Unknown',
        topSubcategories: [],
      },
    }
  )

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.openGraph.title,
      description: meta.openGraph.description,
      url: meta.openGraph.url,
      siteName: meta.openGraph.siteName,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: meta.canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default async function CategoryCityPage({
  params,
}: {
  params: Promise<{ category: string; city: string }>
}) {
  const { category, city: citySlug } = await params

  // Validate category
  if (!VALID_CATEGORIES.includes(category as ValidCategory)) {
    notFound()
  }

  // Validate city
  const city = getCityBySlug(citySlug)
  if (!city) {
    notFound()
  }

  const categoryDisplay = CATEGORY_DISPLAY_NAMES[category] || category

  // Get aggregated stats
  const stats = await getAggregatedStats(category, city.name)

  // If no stats, use empty defaults
  const finalStats = stats || {
    totalBusinesses: 0,
    totalReviews: 0,
    averageRating: 0,
    highestRating: 0,
    lowestRating: 0,
    pricingDistribution: { '$': 0, '$$': 0, '$$$': 0, '$$$$': 0, unknown: 0 },
    ratingDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
    topRatedBusinesses: [],
    mostReviewedBusinesses: [],
    recentlyAddedBusinesses: [],
    categoryInsights: {
      avgReviewsPerBusiness: 0,
      percentWithWebsite: 0,
      percentWithPhone: 0,
      percentFeatured: 0,
      percentWithPhotos: 0,
      mostCommonPriceRange: 'Unknown',
      topSubcategories: [],
    },
  }

  // Generate unique content
  const uniqueContent = generateUniqueContent(category, city.name, finalStats)

  // Fetch businesses for listing
  const businesses = await getBusinessesForListing(category, city.name)

  // Generate schema markup
  const schema = generateSchemaMarkup(category, categoryDisplay, city, finalStats)
  const faqSchema = generateFAQSchema(categoryDisplay, city, finalStats)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.collectionPage) }}
      />
      {schema.itemList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.itemList) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Page Content */}
      <CategoryCityTemplate
        category={category}
        categoryDisplay={categoryDisplay}
        city={city}
        stats={finalStats}
        businesses={businesses}
        uniqueContent={uniqueContent}
      />
    </>
  )
}

// ============================================================
// DATA FETCHING
// ============================================================

/**
 * Fetch businesses for the listing section
 */
async function getBusinessesForListing(category: string, cityName: string) {
  const supabase = createServerClient()

  // Get location ID
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return []

  // Fetch businesses
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, slug, name, description, category, image, address_city, address_state, rating, review_count, is_featured')
    .eq('location_id', location.id)
    .eq('category', category)
    .ilike('address_city', cityName)
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  // Dedupe by name
  const seen = new Set<string>()
  const unique: typeof businesses = []

  for (const biz of businesses || []) {
    const normalizedName = biz.name.toLowerCase().trim()
    if (!seen.has(normalizedName)) {
      seen.add(normalizedName)
      unique.push(biz)
    }
  }

  return unique.map(biz => ({
    id: biz.id,
    slug: biz.slug,
    name: biz.name,
    description: biz.description || '',
    category: biz.category,
    image: biz.image || '',
    address_city: biz.address_city,
    address_state: biz.address_state,
    rating: biz.rating,
    review_count: biz.review_count,
    is_featured: biz.is_featured,
  }))
}

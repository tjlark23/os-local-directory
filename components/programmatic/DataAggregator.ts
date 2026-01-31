/**
 * Data Aggregator for Programmatic SEO Pages
 * Aggregates business statistics for category+city combinations
 *
 * Key metrics:
 * - Business count
 * - Total reviews
 * - Average rating
 * - Pricing distribution
 * - Top rated businesses
 * - Review highlights
 */

import { createServerClient } from '@/lib/supabase'

// Types
export interface AggregatedStats {
  totalBusinesses: number
  totalReviews: number
  averageRating: number
  highestRating: number
  lowestRating: number
  pricingDistribution: PricingDistribution
  ratingDistribution: RatingDistribution
  topRatedBusinesses: TopBusiness[]
  mostReviewedBusinesses: TopBusiness[]
  recentlyAddedBusinesses: TopBusiness[]
  categoryInsights: CategoryInsights
}

export interface PricingDistribution {
  '$': number
  '$$': number
  '$$$': number
  '$$$$': number
  unknown: number
}

export interface RatingDistribution {
  '5': number
  '4': number
  '3': number
  '2': number
  '1': number
}

export interface TopBusiness {
  id: string
  slug: string
  name: string
  rating: number
  reviewCount: number
  priceRange: string | null
  image: string | null
  description: string | null
  address: string
  city: string
  phone: string | null
  website: string | null
  isFeatured: boolean
  highlights?: string[]
}

export interface CategoryInsights {
  avgReviewsPerBusiness: number
  percentWithWebsite: number
  percentWithPhone: number
  percentFeatured: number
  percentWithPhotos: number
  mostCommonPriceRange: string
  topSubcategories: string[]
}

export interface BusinessRecord {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  subcategory: string | null
  image: string | null
  photos: string[] | null
  phone: string | null
  email: string | null
  website: string | null
  address_street: string | null
  address_city: string
  address_state: string
  address_zip: string | null
  latitude: number | null
  longitude: number | null
  rating: number
  review_count: number
  price_range: string | null
  listing_tier: string | null
  is_featured: boolean
  tags: string[] | null
  created_at: string
  last_updated: string | null
}

/**
 * Fetch aggregated stats for a category+city combination
 */
export async function getAggregatedStats(
  category: string,
  cityName: string
): Promise<AggregatedStats | null> {
  const supabase = createServerClient()

  // First get the location
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) {
    console.error('Location not found')
    return null
  }

  // Fetch all businesses for this category and city
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', location.id)
    .eq('category', category)
    .ilike('address_city', cityName)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching businesses:', error)
    return null
  }

  if (!businesses || businesses.length === 0) {
    return createEmptyStats()
  }

  // Dedupe by name
  const uniqueBusinesses = dedupeBusinesses(businesses as BusinessRecord[])

  // Calculate all aggregations
  return calculateAggregations(uniqueBusinesses)
}

/**
 * Remove duplicate businesses by name
 */
function dedupeBusinesses(businesses: BusinessRecord[]): BusinessRecord[] {
  const seen = new Set<string>()
  const unique: BusinessRecord[] = []

  for (const biz of businesses) {
    const normalizedName = biz.name.toLowerCase().trim()
    if (!seen.has(normalizedName)) {
      seen.add(normalizedName)
      unique.push(biz)
    }
  }

  return unique
}

/**
 * Calculate all aggregations from business data
 */
function calculateAggregations(businesses: BusinessRecord[]): AggregatedStats {
  // Basic counts
  const totalBusinesses = businesses.length
  const totalReviews = businesses.reduce((sum, b) => sum + (b.review_count || 0), 0)

  // Ratings
  const validRatings = businesses.filter(b => b.rating > 0)
  const averageRating = validRatings.length > 0
    ? validRatings.reduce((sum, b) => sum + b.rating, 0) / validRatings.length
    : 0
  const highestRating = validRatings.length > 0
    ? Math.max(...validRatings.map(b => b.rating))
    : 0
  const lowestRating = validRatings.length > 0
    ? Math.min(...validRatings.map(b => b.rating))
    : 0

  // Pricing distribution
  const pricingDistribution = calculatePricingDistribution(businesses)

  // Rating distribution
  const ratingDistribution = calculateRatingDistribution(businesses)

  // Top businesses
  const topRatedBusinesses = getTopRatedBusinesses(businesses, 5)
  const mostReviewedBusinesses = getMostReviewedBusinesses(businesses, 5)
  const recentlyAddedBusinesses = getRecentlyAddedBusinesses(businesses, 5)

  // Category insights
  const categoryInsights = calculateCategoryInsights(businesses)

  return {
    totalBusinesses,
    totalReviews,
    averageRating: Math.round(averageRating * 100) / 100,
    highestRating,
    lowestRating,
    pricingDistribution,
    ratingDistribution,
    topRatedBusinesses,
    mostReviewedBusinesses,
    recentlyAddedBusinesses,
    categoryInsights,
  }
}

/**
 * Calculate pricing distribution
 */
function calculatePricingDistribution(businesses: BusinessRecord[]): PricingDistribution {
  const distribution: PricingDistribution = {
    '$': 0,
    '$$': 0,
    '$$$': 0,
    '$$$$': 0,
    unknown: 0,
  }

  for (const biz of businesses) {
    const price = biz.price_range?.trim()
    if (price === '$') distribution['$']++
    else if (price === '$$') distribution['$$']++
    else if (price === '$$$') distribution['$$$']++
    else if (price === '$$$$') distribution['$$$$']++
    else distribution.unknown++
  }

  return distribution
}

/**
 * Calculate rating distribution (bucketed by whole number)
 */
function calculateRatingDistribution(businesses: BusinessRecord[]): RatingDistribution {
  const distribution: RatingDistribution = {
    '5': 0,
    '4': 0,
    '3': 0,
    '2': 0,
    '1': 0,
  }

  for (const biz of businesses) {
    if (biz.rating >= 4.5) distribution['5']++
    else if (biz.rating >= 3.5) distribution['4']++
    else if (biz.rating >= 2.5) distribution['3']++
    else if (biz.rating >= 1.5) distribution['2']++
    else if (biz.rating > 0) distribution['1']++
  }

  return distribution
}

/**
 * Get top rated businesses
 */
function getTopRatedBusinesses(businesses: BusinessRecord[], limit: number): TopBusiness[] {
  return businesses
    .filter(b => b.rating > 0 && b.review_count > 0)
    .sort((a, b) => {
      // Primary sort by rating
      if (b.rating !== a.rating) return b.rating - a.rating
      // Secondary sort by review count
      return b.review_count - a.review_count
    })
    .slice(0, limit)
    .map(mapToTopBusiness)
}

/**
 * Get most reviewed businesses
 */
function getMostReviewedBusinesses(businesses: BusinessRecord[], limit: number): TopBusiness[] {
  return businesses
    .filter(b => b.review_count > 0)
    .sort((a, b) => b.review_count - a.review_count)
    .slice(0, limit)
    .map(mapToTopBusiness)
}

/**
 * Get recently added businesses
 */
function getRecentlyAddedBusinesses(businesses: BusinessRecord[], limit: number): TopBusiness[] {
  return businesses
    .filter(b => b.created_at)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
    .map(mapToTopBusiness)
}

/**
 * Map business record to TopBusiness
 */
function mapToTopBusiness(biz: BusinessRecord): TopBusiness {
  // Generate highlights based on business data
  const highlights: string[] = []

  if (biz.rating >= 4.5) highlights.push('Highly Rated')
  if (biz.review_count >= 50) highlights.push('Popular Choice')
  if (biz.is_featured) highlights.push('Featured')
  if (biz.website) highlights.push('Online Booking')

  return {
    id: biz.id,
    slug: biz.slug,
    name: biz.name,
    rating: biz.rating,
    reviewCount: biz.review_count,
    priceRange: biz.price_range,
    image: biz.image,
    description: biz.description,
    address: `${biz.address_street || ''}, ${biz.address_city}, ${biz.address_state} ${biz.address_zip || ''}`.trim(),
    city: biz.address_city,
    phone: biz.phone,
    website: biz.website,
    isFeatured: biz.is_featured,
    highlights,
  }
}

/**
 * Calculate category insights
 */
function calculateCategoryInsights(businesses: BusinessRecord[]): CategoryInsights {
  const total = businesses.length

  if (total === 0) {
    return {
      avgReviewsPerBusiness: 0,
      percentWithWebsite: 0,
      percentWithPhone: 0,
      percentFeatured: 0,
      percentWithPhotos: 0,
      mostCommonPriceRange: 'Unknown',
      topSubcategories: [],
    }
  }

  // Average reviews
  const avgReviewsPerBusiness = businesses.reduce((sum, b) => sum + (b.review_count || 0), 0) / total

  // Percentages
  const percentWithWebsite = (businesses.filter(b => b.website).length / total) * 100
  const percentWithPhone = (businesses.filter(b => b.phone).length / total) * 100
  const percentFeatured = (businesses.filter(b => b.is_featured).length / total) * 100
  const percentWithPhotos = (businesses.filter(b => {
    const photos = b.photos
    return photos && Array.isArray(photos) && photos.length > 1
  }).length / total) * 100

  // Most common price range
  const priceCounts: Record<string, number> = { '$': 0, '$$': 0, '$$$': 0, '$$$$': 0 }
  for (const biz of businesses) {
    const price = biz.price_range?.trim()
    if (price && price in priceCounts) {
      priceCounts[price]++
    }
  }
  const mostCommonPriceRange = Object.entries(priceCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([, count]) => count > 0)[0]?.[0] || 'Varies'

  // Top subcategories
  const subcategoryCounts: Record<string, number> = {}
  for (const biz of businesses) {
    if (biz.subcategory) {
      const sub = biz.subcategory.trim()
      subcategoryCounts[sub] = (subcategoryCounts[sub] || 0) + 1
    }
  }
  const topSubcategories = Object.entries(subcategoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name)

  return {
    avgReviewsPerBusiness: Math.round(avgReviewsPerBusiness * 10) / 10,
    percentWithWebsite: Math.round(percentWithWebsite),
    percentWithPhone: Math.round(percentWithPhone),
    percentFeatured: Math.round(percentFeatured),
    percentWithPhotos: Math.round(percentWithPhotos),
    mostCommonPriceRange,
    topSubcategories,
  }
}

/**
 * Create empty stats for cities with no data
 */
function createEmptyStats(): AggregatedStats {
  return {
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
}

/**
 * Get all category+city combinations with data
 */
export async function getAllCategoryCityCombinations(): Promise<{ category: string; city: string; count: number }[]> {
  const supabase = createServerClient()

  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return []

  // Get counts by category and city
  const { data, error } = await supabase
    .from('businesses')
    .select('category, address_city')
    .eq('location_id', location.id)

  if (error || !data) return []

  // Aggregate counts
  const counts: Record<string, number> = {}
  for (const row of data) {
    if (row.category && row.address_city) {
      const key = `${row.category}|${row.address_city}`
      counts[key] = (counts[key] || 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([key, count]) => {
      const [category, city] = key.split('|')
      return { category, city, count }
    })
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
}

/**
 * Get unique content generation data
 * This creates city-specific content that makes each page unique
 */
export function generateUniqueContent(
  category: string,
  cityName: string,
  stats: AggregatedStats
): UniquePageContent {
  const year = new Date().getFullYear()
  const categoryDisplay = getCategoryDisplayName(category)

  // Generate unique intro based on data
  const intro = generateIntroText(categoryDisplay, cityName, stats)

  // Generate unique value propositions
  const valueProps = generateValuePropositions(stats, categoryDisplay, cityName)

  // Generate unique facts about this specific category+city
  const facts = generateUniqueFacts(stats, categoryDisplay, cityName)

  // Generate comparison context
  const comparisonContext = generateComparisonContext(stats)

  return {
    title: `${categoryDisplay} in ${cityName}, TX | WilCo Guide`,
    h1: `Best ${categoryDisplay} in ${cityName}, TX ${year}`,
    intro,
    valueProps,
    facts,
    comparisonContext,
  }
}

export interface UniquePageContent {
  title: string
  h1: string
  intro: string
  valueProps: string[]
  facts: string[]
  comparisonContext: string
}

function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
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
  return displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

function generateIntroText(category: string, city: string, stats: AggregatedStats): string {
  if (stats.totalBusinesses === 0) {
    return `We're actively expanding our ${category.toLowerCase()} listings in ${city}. Check back soon or explore nearby cities.`
  }

  const avgRating = stats.averageRating.toFixed(1)
  const reviewText = stats.totalReviews > 0
    ? `backed by ${stats.totalReviews.toLocaleString()} reviews from local customers`
    : ''

  if (stats.totalBusinesses >= 20) {
    return `${city} offers an impressive selection of ${stats.totalBusinesses} ${category.toLowerCase()} options, ${reviewText ? reviewText + ', ' : ''}with an average rating of ${avgRating} stars. Whether you're a longtime resident or new to Williamson County, you'll find exactly what you're looking for.`
  } else if (stats.totalBusinesses >= 5) {
    return `Discover ${stats.totalBusinesses} trusted ${category.toLowerCase()} in ${city}, Texas. ${reviewText ? 'With ' + reviewText + ' and ' : 'With '}an average rating of ${avgRating} stars, these local businesses are ready to serve you.`
  } else {
    return `Explore ${stats.totalBusinesses} ${category.toLowerCase()} option${stats.totalBusinesses > 1 ? 's' : ''} in ${city}. Our directory features verified information to help you make the best choice.`
  }
}

function generateValuePropositions(stats: AggregatedStats, category: string, city: string): string[] {
  const props: string[] = []

  if (stats.totalReviews >= 100) {
    props.push(`${stats.totalReviews.toLocaleString()}+ verified reviews from ${city} customers`)
  }

  if (stats.averageRating >= 4.0) {
    props.push(`Average ${stats.averageRating.toFixed(1)}-star rating across all listings`)
  }

  if (stats.categoryInsights.percentWithWebsite >= 70) {
    props.push(`${stats.categoryInsights.percentWithWebsite}% offer online booking or websites`)
  }

  if (stats.categoryInsights.percentWithPhone >= 80) {
    props.push('Direct phone numbers for easy contact')
  }

  if (stats.topRatedBusinesses.length > 0 && stats.topRatedBusinesses[0].rating >= 4.8) {
    props.push(`Top-rated options with ${stats.topRatedBusinesses[0].rating}-star reviews`)
  }

  return props.slice(0, 4)
}

function generateUniqueFacts(stats: AggregatedStats, category: string, city: string): string[] {
  const facts: string[] = []

  if (stats.totalBusinesses > 0) {
    facts.push(`There are ${stats.totalBusinesses} ${category.toLowerCase()} serving the ${city} area.`)
  }

  if (stats.averageRating > 0) {
    facts.push(`The average rating for ${category.toLowerCase()} in ${city} is ${stats.averageRating.toFixed(1)} stars.`)
  }

  if (stats.categoryInsights.mostCommonPriceRange !== 'Unknown' && stats.categoryInsights.mostCommonPriceRange !== 'Varies') {
    facts.push(`Most ${category.toLowerCase()} in ${city} fall in the ${stats.categoryInsights.mostCommonPriceRange} price range.`)
  }

  if (stats.mostReviewedBusinesses.length > 0) {
    const top = stats.mostReviewedBusinesses[0]
    facts.push(`The most reviewed ${category.toLowerCase().replace(/s$/, '')} is ${top.name} with ${top.reviewCount} reviews.`)
  }

  if (stats.categoryInsights.topSubcategories.length > 0) {
    facts.push(`Popular types include: ${stats.categoryInsights.topSubcategories.slice(0, 3).join(', ')}.`)
  }

  return facts
}

function generateComparisonContext(stats: AggregatedStats): string {
  if (stats.totalBusinesses === 0) return ''

  const priceDist = stats.pricingDistribution
  const totalWithPrice = priceDist['$'] + priceDist['$$'] + priceDist['$$$'] + priceDist['$$$$']

  if (totalWithPrice === 0) return ''

  const budgetPercent = Math.round(((priceDist['$'] + priceDist['$$']) / totalWithPrice) * 100)
  const premiumPercent = Math.round(((priceDist['$$$'] + priceDist['$$$$']) / totalWithPrice) * 100)

  if (budgetPercent > 60) {
    return 'Great selection of budget-friendly options available.'
  } else if (premiumPercent > 40) {
    return 'Mix of premium and value options to fit any budget.'
  } else {
    return 'Balanced selection across all price points.'
  }
}

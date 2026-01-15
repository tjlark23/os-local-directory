import { businesses as rawBusinesses, BUSINESS_COUNT } from "./businesses"
import type { Business, BusinessCard, SearchFilters, FilterCategory, City, OutScraperRow, ListingTier } from "../types"
import { CATEGORIES, CITIES } from "../types"

// Add default listingTier to all businesses that don't have it
const businesses: Business[] = rawBusinesses.map(b => ({
  ...b,
  listingTier: b.listingTier || "free" as ListingTier,
  lastUpdated: b.lastUpdated || new Date().toISOString(),
}))

// Re-export for convenience
export { businesses, BUSINESS_COUNT, CATEGORIES, CITIES }
export type { Business, BusinessCard, SearchFilters, FilterCategory, City }

// ============ DATA ACCESS FUNCTIONS ============

/**
 * Get all businesses
 */
export function getAllBusinesses(): Business[] {
  return businesses
}

/**
 * Get a business by ID
 */
export function getBusinessById(id: string): Business | undefined {
  return businesses.find((b) => b.id === id)
}

/**
 * Get featured businesses (for homepage)
 */
export function getFeaturedBusinesses(limit?: number): Business[] {
  const featured = businesses.filter((b) => b.featured)
  return limit ? featured.slice(0, limit) : featured
}

/**
 * Get premium businesses (paid listings)
 */
export function getPremiumBusinesses(limit?: number): Business[] {
  const premium = businesses.filter((b) => b.listingTier === "premium" || b.listingTier === "featured")
  // Sort by featured tier first, then by rating
  premium.sort((a, b) => {
    if (a.listingTier === "featured" && b.listingTier !== "featured") return -1
    if (b.listingTier === "featured" && a.listingTier !== "featured") return 1
    return b.rating - a.rating
  })
  return limit ? premium.slice(0, limit) : premium
}

/**
 * Get businesses by filter category (for homepage tabs)
 */
export function getBusinessesByFilterCategory(category: FilterCategory | "all"): Business[] {
  if (category === "all") return businesses
  return businesses.filter((b) => b.filterCategory === category)
}

/**
 * Get businesses by city
 */
export function getBusinessesByCity(city: City): Business[] {
  return businesses.filter((b) => b.address.city === city)
}

/**
 * Search and filter businesses
 */
export function searchBusinesses(filters: SearchFilters): Business[] {
  let results = [...businesses]

  // Text search (name, category, description, tags)
  if (filters.query) {
    const query = filters.query.toLowerCase()
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query)) ||
        b.specialties.some((s) => s.toLowerCase().includes(query))
    )
  }

  // Location filter (city)
  if (filters.location) {
    const location = filters.location.toLowerCase()
    results = results.filter(
      (b) =>
        b.address.city.toLowerCase().includes(location) ||
        b.address.full.toLowerCase().includes(location)
    )
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    results = results.filter((b) => b.filterCategory === filters.category)
  }

  // Minimum rating filter
  if (filters.minRating) {
    results = results.filter((b) => b.rating >= filters.minRating!)
  }

  // Open now filter
  if (filters.isOpen) {
    results = results.filter((b) => b.currentlyOpen)
  }

  // Has photos filter
  if (filters.hasPhotos) {
    results = results.filter((b) => b.photos.length > 0 && !b.photos[0].includes("placeholder"))
  }

  // Price range filter
  if (filters.priceRange && filters.priceRange.length > 0) {
    results = results.filter((b) => filters.priceRange!.includes(b.priceRange))
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        results.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "relevance":
      default:
        // Featured first, then by rating
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
    }
  }

  return results
}

/**
 * Get similar businesses (same category, different business)
 */
export function getSimilarBusinesses(businessId: string, limit = 4): Business[] {
  const business = getBusinessById(businessId)
  if (!business) return []

  return businesses
    .filter((b) => b.id !== businessId && b.filterCategory === business.filterCategory)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

/**
 * Get business counts by city
 */
export function getBusinessCountsByCity(): Record<City, number> {
  return {
    Leander: businesses.filter((b) => b.address.city === "Leander").length,
    "Cedar Park": businesses.filter((b) => b.address.city === "Cedar Park").length,
    "Liberty Hill": businesses.filter((b) => b.address.city === "Liberty Hill").length,
  }
}

/**
 * Get business counts by category
 */
export function getBusinessCountsByCategory(): Record<FilterCategory, number> {
  const counts: Partial<Record<FilterCategory, number>> = {}
  for (const category of CATEGORIES) {
    counts[category.id] = businesses.filter((b) => b.filterCategory === category.id).length
  }
  return counts as Record<FilterCategory, number>
}

/**
 * Convert Business to BusinessCard format (for listings)
 */
export function toBusinessCard(business: Business): BusinessCard {
  return {
    id: business.id,
    name: business.name,
    category: business.category,
    filterCategory: business.filterCategory,
    categoryTag: getCategoryTag(business.filterCategory),
    rating: business.rating,
    reviewCount: business.reviewCount,
    priceRange: business.priceRange,
    featured: business.featured,
    image: business.image,
    address: business.address.full,
    city: business.address.city,
    description: business.shortDescription || business.description,
    isOpen: business.currentlyOpen,
    phone: business.phone,
    website: business.website,
    tags: business.tags,
    distance: business.distance,
  }
}

/**
 * Get category display tag
 */
function getCategoryTag(filterCategory: FilterCategory): string {
  const category = CATEGORIES.find((c) => c.id === filterCategory)
  return category?.name || filterCategory
}

// ============ CSV IMPORT UTILITIES (for OutScraper data) ============

/**
 * Parse OutScraper CSV row to Business object
 * This will be used tomorrow when you provide the real CSV data
 */
export function parseOutScraperRow(row: OutScraperRow, index: number): Business {
  // Determine filter category from Google category
  const filterCategory = mapGoogleCategoryToFilter(row.category || "", row.subtypes || "")

  // Parse working hours (OutScraper format: "Monday: 9:00 AM - 5:00 PM, Tuesday: ...")
  const hours = parseWorkingHours(row.working_hours || "")

  // Parse price range
  const priceRange = parsePriceRange(row.price_range || "")

  // Parse city from address
  const city = parseCityFromAddress(row.city || row.full_address || "")

  // Generate ID from name
  const id = generateBusinessId(row.name || `business-${index}`)

  // Parse reviews per score for rating breakdown
  const ratingBreakdown = parseReviewsPerScore(row.reviews_per_score || "")

  return {
    id,
    name: row.name || "Unknown Business",
    category: row.category || "Business",
    subcategory: row.subtypes?.split(",")[0]?.trim(),
    filterCategory,
    rating: row.rating || 0,
    reviewCount: row.reviews || 0,
    priceRange,
    featured: (row.rating || 0) >= 4.5 && (row.reviews || 0) >= 50,
    claimed: row.verified || false,
    address: {
      street: row.street || "",
      city: city,
      state: "TX",
      zip: row.postal_code || "",
      full: row.full_address || "",
    },
    phone: row.phone || "",
    website: row.site || "",
    hours,
    currentlyOpen: true, // Would need real-time check
    description: row.description || `${row.name} located in ${city}, Texas.`,
    shortDescription: row.description?.slice(0, 150),
    specialties: parseSubtypes(row.subtypes || ""),
    amenities: [], // Would need to be parsed from additional data
    tags: parseSubtypes(row.subtypes || "").slice(0, 5),
    photos: row.photo ? [row.photo] : [],
    videos: [],
    quickStats: {
      overallRating: row.rating || 0,
      totalReviews: row.reviews || 0,
      responseRate: "N/A",
      avgResponseTime: "N/A",
    },
    ratingBreakdown,
    image: row.photo || "/placeholder.svg?height=400&width=600",
    googlePlaceId: row.place_id,
    googleMapsUrl: row.reviews_link?.replace("/reviews", ""),
    latitude: row.latitude,
    longitude: row.longitude,
  }
}

/**
 * Map Google category to our filter categories
 */
function mapGoogleCategoryToFilter(category: string, subtypes: string): FilterCategory {
  const text = `${category} ${subtypes}`.toLowerCase()

  if (text.includes("restaurant") || text.includes("cafe") || text.includes("food") ||
      text.includes("pizza") || text.includes("bbq") || text.includes("coffee") ||
      text.includes("bakery") || text.includes("bar") || text.includes("grill")) {
    return "food"
  }
  if (text.includes("health") || text.includes("spa") || text.includes("gym") ||
      text.includes("fitness") || text.includes("yoga") || text.includes("dental") ||
      text.includes("doctor") || text.includes("medical") || text.includes("salon") ||
      text.includes("beauty") || text.includes("chiropractic")) {
    return "health-beauty"
  }
  if (text.includes("auto") || text.includes("car") || text.includes("tire") ||
      text.includes("mechanic") || text.includes("vehicle") || text.includes("dealer")) {
    return "auto-services"
  }
  if (text.includes("store") || text.includes("shop") || text.includes("retail") ||
      text.includes("boutique") || text.includes("market") || text.includes("hardware")) {
    return "shopping"
  }
  if (text.includes("entertainment") || text.includes("theater") || text.includes("music") ||
      text.includes("dance") || text.includes("event") || text.includes("winery")) {
    return "entertainment"
  }
  if (text.includes("pet") || text.includes("vet") || text.includes("animal") ||
      text.includes("grooming")) {
    return "pets"
  }
  if (text.includes("real estate") || text.includes("realty") || text.includes("property") ||
      text.includes("home") || text.includes("apartment")) {
    return "real-estate"
  }
  if (text.includes("plumb") || text.includes("electric") || text.includes("hvac") ||
      text.includes("landscap") || text.includes("roof") || text.includes("contractor")) {
    return "home-services"
  }

  return "services"
}

/**
 * Parse OutScraper working hours string
 */
function parseWorkingHours(hoursString: string): Business["hours"] {
  const defaultHours = {
    monday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
    tuesday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
    wednesday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
    thursday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
    friday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
    saturday: { open: "10:00 AM", close: "4:00 PM", isOpen: true },
    sunday: { open: "Closed", close: "Closed", isOpen: false },
  }

  if (!hoursString) return defaultHours

  // Parse format like "Monday: 9:00 AM - 5:00 PM, Tuesday: 9:00 AM - 5:00 PM, ..."
  // This is a simplified parser - adjust based on actual OutScraper format
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const
  const result = { ...defaultHours }

  for (const day of days) {
    const regex = new RegExp(`${day}:\\s*([^,]+)`, "i")
    const match = hoursString.match(regex)
    if (match) {
      const timeRange = match[1].trim()
      if (timeRange.toLowerCase() === "closed") {
        result[day] = { open: "Closed", close: "Closed", isOpen: false }
      } else {
        const times = timeRange.split("-").map(t => t.trim())
        if (times.length === 2) {
          result[day] = { open: times[0], close: times[1], isOpen: true }
        }
      }
    }
  }

  return result
}

/**
 * Parse price range
 */
function parsePriceRange(priceRange: string): Business["priceRange"] {
  const count = (priceRange.match(/\$/g) || []).length
  if (count >= 4) return "$$$$"
  if (count >= 3) return "$$$"
  if (count >= 2) return "$$"
  return "$"
}

/**
 * Parse city from address
 */
function parseCityFromAddress(address: string): City {
  const lower = address.toLowerCase()
  if (lower.includes("cedar park")) return "Cedar Park"
  if (lower.includes("liberty hill")) return "Liberty Hill"
  return "Leander" // Default
}

/**
 * Generate URL-safe business ID
 */
function generateBusinessId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Parse subtypes string to array
 */
function parseSubtypes(subtypes: string): string[] {
  if (!subtypes) return []
  return subtypes.split(",").map(s => s.trim()).filter(Boolean)
}

/**
 * Parse reviews per score (OutScraper format: "1: 5, 2: 10, 3: 20, 4: 50, 5: 100")
 */
function parseReviewsPerScore(reviewsPerScore: string): Business["ratingBreakdown"] {
  const defaults = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  if (!reviewsPerScore) return defaults

  const result = { ...defaults }
  const matches = reviewsPerScore.matchAll(/(\d):\s*(\d+)/g)
  for (const match of matches) {
    const score = parseInt(match[1]) as 1 | 2 | 3 | 4 | 5
    const count = parseInt(match[2])
    if (score >= 1 && score <= 5) {
      result[score] = count
    }
  }

  return result
}

/**
 * Import businesses from OutScraper CSV data
 * Call this with your parsed CSV array tomorrow
 */
export function importFromOutScraper(rows: OutScraperRow[]): Business[] {
  // Filter to only include businesses in our target cities
  const targetCities = ["leander", "cedar park", "liberty hill"]

  const filtered = rows.filter(row => {
    const city = (row.city || row.full_address || "").toLowerCase()
    return targetCities.some(tc => city.includes(tc))
  })

  return filtered.map((row, index) => parseOutScraperRow(row, index))
}

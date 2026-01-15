// Business Directory Types
// Structured for easy OutScraper CSV import

export interface BusinessAddress {
  street: string
  city: "Leander" | "Cedar Park" | "Liberty Hill"
  state: "TX"
  zip: string
  full: string
}

export interface BusinessHours {
  open: string
  close: string
  isOpen: boolean
}

export interface WeeklyHours {
  monday: BusinessHours
  tuesday: BusinessHours
  wednesday: BusinessHours
  thursday: BusinessHours
  friday: BusinessHours
  saturday: BusinessHours
  sunday: BusinessHours
}

export interface Amenity {
  name: string
  icon: string
}

export interface QuickStats {
  overallRating: number
  totalReviews: number
  responseRate: string
  avgResponseTime: string
}

export interface RatingBreakdown {
  5: number
  4: number
  3: number
  2: number
  1: number
}

// Premium listing tier
export type ListingTier = "free" | "premium" | "featured"

// Business update/announcement
export interface BusinessUpdate {
  id: string
  date: string
  type: "announcement" | "promotion" | "event" | "news"
  title: string
  content: string
  expiresAt?: string
  image?: string
}

// Main Business interface - comprehensive for detail pages
export interface Business {
  id: string
  name: string
  category: string
  subcategory?: string
  filterCategory: FilterCategory
  rating: number
  reviewCount: number
  priceRange: "$" | "$$" | "$$$" | "$$$$"
  featured: boolean
  claimed: boolean
  address: BusinessAddress
  phone: string
  website: string
  email?: string
  hours: WeeklyHours
  currentlyOpen: boolean
  description: string
  shortDescription?: string
  specialties: string[]
  amenities: Amenity[]
  tags: string[]
  photos: string[]
  videos: string[]
  quickStats: QuickStats
  ratingBreakdown: RatingBreakdown
  // For search results
  image: string
  distance?: string
  // OutScraper fields (will be populated from CSV)
  googlePlaceId?: string
  googleMapsUrl?: string
  latitude?: number
  longitude?: number
  // Premium listing fields
  listingTier: ListingTier
  isPremium?: boolean
  premiumSince?: string
  lastUpdated?: string
  customDescription?: string  // Override auto-generated description
  updates?: BusinessUpdate[]  // Announcements, promotions, etc.
  socialLinks?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
  // Backlink for premium (SEO value)
  backlinkEnabled?: boolean
}

// Filter categories for the homepage tabs
export type FilterCategory =
  | "food"
  | "health-beauty"
  | "auto-services"
  | "shopping"
  | "entertainment"
  | "pets"
  | "real-estate"
  | "services"
  | "home-services"

// Category display info
export interface CategoryInfo {
  id: FilterCategory
  name: string
  icon: string
  description: string
}

// Search/filter types
export interface SearchFilters {
  query?: string
  location?: string
  category?: FilterCategory | "all"
  minRating?: number
  maxDistance?: number
  isOpen?: boolean
  hasPhotos?: boolean
  priceRange?: string[]
  sortBy?: "relevance" | "rating" | "reviews" | "distance"
}

// Simplified business for cards/lists
export interface BusinessCard {
  id: string
  name: string
  category: string
  filterCategory: FilterCategory
  categoryTag: string
  rating: number
  reviewCount: number
  priceRange: string
  featured: boolean
  image: string
  address: string
  city: string
  description: string
  isOpen: boolean
  phone: string
  website: string
  tags: string[]
  distance?: string
}

// OutScraper CSV row structure (for tomorrow's import)
export interface OutScraperRow {
  name: string
  site?: string
  phone?: string
  full_address?: string
  street?: string
  city?: string
  state?: string
  postal_code?: string
  country_code?: string
  latitude?: number
  longitude?: number
  category?: string
  subtypes?: string
  rating?: number
  reviews?: number
  reviews_link?: string
  photos_count?: number
  photo?: string
  working_hours?: string
  business_status?: string
  verified?: boolean
  owner_title?: string
  price_range?: string
  description?: string
  place_id?: string
  google_id?: string
  cid?: string
  reviews_per_score?: string
  located_in?: string
}

// Categories configuration
export const CATEGORIES: CategoryInfo[] = [
  { id: "food", name: "Food & Dining", icon: "🍽️", description: "Restaurants, cafes, bars" },
  { id: "health-beauty", name: "Health & Beauty", icon: "💆", description: "Wellness, fitness, spas" },
  { id: "auto-services", name: "Auto Services", icon: "🚗", description: "Repair, dealers, car wash" },
  { id: "shopping", name: "Shopping", icon: "🛍️", description: "Retail, boutiques, malls" },
  { id: "entertainment", name: "Entertainment", icon: "🎭", description: "Events, activities, venues" },
  { id: "pets", name: "Pets", icon: "🐾", description: "Vets, grooming, supplies" },
  { id: "real-estate", name: "Real Estate", icon: "🏠", description: "Agents, property, rentals" },
  { id: "services", name: "Professional Services", icon: "💼", description: "Legal, finance, business" },
  { id: "home-services", name: "Home Services", icon: "🔧", description: "Plumbing, electric, HVAC" },
]

// City configuration
export const CITIES = ["Leander", "Cedar Park", "Liberty Hill"] as const
export type City = typeof CITIES[number]

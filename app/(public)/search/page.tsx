import { Suspense } from "react"
import { Metadata } from "next"
import { SearchPageContent } from "./search-content"
import { CATEGORIES, CITIES } from "@/lib/types"

// Category display names for SEO
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  "food": "Restaurants & Dining",
  "health-beauty": "Health & Beauty",
  "auto-services": "Auto Services",
  "shopping": "Shopping & Retail",
  "entertainment": "Entertainment",
  "pets": "Pet Services",
  "real-estate": "Real Estate",
  "services": "Professional Services",
  "home-services": "Home Services",
}

// Generate dynamic metadata based on search params
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; city?: string; query?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const { category, city, query } = params

  // Build dynamic title
  let title = "Search Local Businesses"
  let description = "Find trusted local businesses in Leander, Cedar Park, and Liberty Hill, Texas. Browse restaurants, services, shops, and more with reviews and ratings."

  const categoryName = category ? CATEGORY_DISPLAY_NAMES[category] || category : null
  const cityName = city && CITIES.includes(city as typeof CITIES[number]) ? city : null

  if (categoryName && cityName) {
    // Both category and city: "Restaurants in Leander, TX"
    title = `${categoryName} in ${cityName}, TX`
    description = `Discover the best ${categoryName.toLowerCase()} in ${cityName}, Texas. Browse local businesses with reviews, ratings, hours, and contact information. Find your next favorite spot!`
  } else if (categoryName) {
    // Category only: "Restaurants in Leander, Cedar Park & Liberty Hill"
    title = `${categoryName} in Leander, Cedar Park & Liberty Hill, TX`
    description = `Find the best ${categoryName.toLowerCase()} in the Leander area. Browse restaurants, shops, and services in Leander, Cedar Park, and Liberty Hill, Texas with reviews and ratings.`
  } else if (cityName) {
    // City only: "Local Businesses in Leander, TX"
    title = `Local Businesses in ${cityName}, TX`
    description = `Explore local businesses in ${cityName}, Texas. Find restaurants, services, shops, and more with reviews, ratings, and contact information from your neighbors.`
  } else if (query) {
    // Search query: "Search results for 'pizza'"
    title = `Search Results for "${query}"`
    description = `Search results for "${query}" in Leander, Cedar Park, and Liberty Hill, Texas. Find local businesses matching your search.`
  }

  // Build keywords array
  const keywords = [
    "local businesses",
    "Leander Texas",
    "Cedar Park Texas",
    "Liberty Hill Texas",
    "business directory",
  ]

  if (categoryName) {
    keywords.push(categoryName.toLowerCase())
    keywords.push(`${categoryName.toLowerCase()} near me`)
  }

  if (cityName) {
    keywords.push(`${cityName} businesses`)
    keywords.push(`${cityName} TX`)
    if (categoryName) {
      keywords.push(`${categoryName.toLowerCase()} ${cityName}`)
      keywords.push(`best ${categoryName.toLowerCase()} ${cityName}`)
    }
  }

  // Build canonical URL
  const baseUrl = "https://directory.leanderscoop.com"
  let canonicalPath = "/search"
  const urlParams = new URLSearchParams()
  if (category) urlParams.set("category", category)
  if (city) urlParams.set("city", city)
  if (urlParams.toString()) {
    canonicalPath += `?${urlParams.toString()}`
  }

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: `${title} | Leander Scoop Directory`,
      description,
      type: "website",
      url: `${baseUrl}${canonicalPath}`,
      siteName: "Leander Scoop Directory",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Leander Scoop Directory`,
      description,
    },
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
  }
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

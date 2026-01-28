"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, ExternalLink } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { BusinessCardVertical } from "@/components/business-card-vertical"
import { SearchFiltersHorizontal } from "@/components/search-filters-horizontal"
import { siteConfig } from "@/lib/site-config"

// Map navbar categories to database categories
const CATEGORY_MAP: Record<string, string[]> = {
  "food": ["restaurants"],
  "restaurants": ["restaurants"],
  "health-beauty": ["health", "beauty", "fitness"],
  "auto-services": ["automotive"],
  "automotive": ["automotive"],
  "shopping": ["shopping"],
  "entertainment": ["entertainment"],
  "pets": ["pets"],
  "real-estate": ["services"],
  "home-services": ["home"],
  "services": ["services", "financial", "education"],
}

// Category display names for page titles
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  "food": "Food & Dining",
  "restaurants": "Restaurants",
  "health-beauty": "Health & Beauty",
  "auto-services": "Auto Services",
  "automotive": "Automotive",
  "shopping": "Shopping",
  "entertainment": "Entertainment",
  "pets": "Pets & Animals",
  "real-estate": "Real Estate",
  "home-services": "Home Services",
  "services": "Professional Services",
  "health": "Health & Wellness",
  "beauty": "Beauty & Spa",
  "fitness": "Fitness",
  "financial": "Financial Services",
  "education": "Education",
  "home": "Home Services",
}

interface Business {
  id: string
  slug: string
  name: string
  description: string
  category: string
  subcategory: string | null
  image: string
  phone: string
  website: string | null
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
  rating: number
  review_count: number
  price_range: string | null
  tags: string[]
  is_featured: boolean
  listing_tier: string
}

interface FiltersState {
  category: string
  city: string
  rating: number
  sort: string
}

export function SearchPageContent() {
  const searchParams = useSearchParams()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  // Get initial values from URL
  const urlQuery = searchParams.get("q") || ""
  const urlCategory = searchParams.get("category") || "all"
  const urlCity = searchParams.get("city") || "all"
  const urlSource = searchParams.get("source") as "leander" | "roundrock" | null

  // Get source configuration for filtering
  const sourceConfig = urlSource ? siteConfig.sources[urlSource] : null

  const [filters, setFilters] = useState<FiltersState>({
    category: urlCategory,
    city: urlCity,
    rating: 0,
    sort: "relevance",
  })

  const fetchBusinesses = useCallback(async () => {
    setLoading(true)

    try {
      // First get the location ID for Leander
      const { data: location } = await supabase
        .from('locations')
        .select('id')
        .eq('slug', 'leander')
        .single()

      if (!location) {
        console.error('Location not found')
        setLoading(false)
        return
      }

      // Build query
      let query = supabase
        .from('businesses')
        .select('*', { count: 'exact' })
        .eq('location_id', location.id)

      // Apply category filter
      if (filters.category && filters.category !== "all") {
        // Map frontend category to database categories
        const dbCategories = CATEGORY_MAP[filters.category] || [filters.category]
        query = query.in('category', dbCategories)
      }

      // Apply city filter
      if (filters.city && filters.city !== "all") {
        query = query.eq('address_city', filters.city)
      } else if (sourceConfig) {
        // If source parameter is set, filter to only those cities
        query = query.in('address_city', sourceConfig.cities)
      }

      // Apply rating filter
      if (filters.rating > 0) {
        query = query.gte('rating', filters.rating)
      }

      // Apply text search
      if (urlQuery) {
        query = query.or(`name.ilike.%${urlQuery}%,description.ilike.%${urlQuery}%`)
      }

      // Apply sorting
      switch (filters.sort) {
        case "rating":
          query = query.order('rating', { ascending: false })
          break
        case "reviews":
          query = query.order('review_count', { ascending: false })
          break
        default:
          // Relevance: featured first, then by rating
          query = query
            .order('is_featured', { ascending: false })
            .order('rating', { ascending: false })
      }

      // Limit results
      query = query.limit(50)

      const { data, count, error } = await query

      if (error) {
        console.error('Error fetching businesses:', error)
        return
      }

      // Dedupe by name to remove duplicate businesses
      const uniqueBusinesses: Business[] = []
      const seenNames = new Set<string>()

      for (const biz of (data || [])) {
        const normalizedName = biz.name.toLowerCase().trim()
        if (!seenNames.has(normalizedName)) {
          seenNames.add(normalizedName)
          uniqueBusinesses.push(biz)
        }
      }

      setBusinesses(uniqueBusinesses)
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, urlQuery, sourceConfig])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  // Update filters when URL changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: urlCategory,
      city: urlCity,
    }))
  }, [urlCategory, urlCity])

  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: "all",
      city: "all",
      rating: 0,
      sort: "relevance",
    })
  }

  const toggleFavorite = (businessId: string) => {
    setFavorites(prev =>
      prev.includes(businessId) ? prev.filter(id => id !== businessId) : [...prev, businessId]
    )
  }

  // Generate dynamic page title
  const getPageTitle = () => {
    const parts: string[] = []

    if (urlQuery) {
      return `Results for "${urlQuery}"`
    }

    if (filters.category !== "all") {
      parts.push(CATEGORY_DISPLAY_NAMES[filters.category] || filters.category)
    } else {
      parts.push("All Businesses")
    }

    if (filters.city !== "all") {
      parts.push(`in ${filters.city}`)
    }

    return parts.join(" ")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Source Attribution Banner */}
      {sourceConfig && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-foreground">{sourceConfig.attribution}</span>
              <a
                href={sourceConfig.attributionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                Visit Site
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {getPageTitle()}
          </h1>
          {sourceConfig && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing businesses in {sourceConfig.cities.join(", ")}
            </p>
          )}
        </div>

        {/* Horizontal Filters */}
        <SearchFiltersHorizontal
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          resultCount={businesses.length}
          totalCount={totalCount}
          loading={loading}
          source={urlSource}
        />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[380px] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && businesses.length === 0 && (
          <div className="bg-background border border-border rounded-lg p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Button variant="outline" onClick={resetFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Results Grid - 2 columns on desktop, 1 on mobile */}
        {!loading && businesses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {businesses.map((business) => (
              <BusinessCardVertical
                key={business.id}
                business={business}
                isFavorite={favorites.includes(business.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

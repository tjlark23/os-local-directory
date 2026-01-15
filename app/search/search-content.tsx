"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Star, MapPin, Clock, Heart, Phone, ExternalLink, Building2, SlidersHorizontal, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
  "real-estate": ["services"], // Real estate goes to services
  "home-services": ["home"],
  "services": ["services", "financial", "education"],
}

// All database categories for the filter dropdown
const DB_CATEGORIES = [
  { id: "restaurants", name: "Restaurants & Dining" },
  { id: "health", name: "Health & Wellness" },
  { id: "beauty", name: "Beauty & Spa" },
  { id: "fitness", name: "Fitness & Sports" },
  { id: "automotive", name: "Automotive" },
  { id: "shopping", name: "Shopping & Retail" },
  { id: "services", name: "Professional Services" },
  { id: "education", name: "Education" },
  { id: "pets", name: "Pets & Animals" },
  { id: "financial", name: "Financial Services" },
  { id: "home", name: "Home Services" },
  { id: "entertainment", name: "Entertainment" },
]

const CITIES = ["Austin", "Cedar Park", "Georgetown", "Leander", "Liberty Hill", "Pflugerville", "Round Rock"]

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Get initial values from URL
  const urlQuery = searchParams.get("q") || ""
  const urlCategory = searchParams.get("category") || "all"
  const urlCity = searchParams.get("city") || "all"

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
  }, [filters, urlQuery])

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

  const hasActiveFilters = filters.category !== "all" || filters.city !== "all" || filters.rating > 0

  const toggleFavorite = (businessId: string) => {
    setFavorites(prev =>
      prev.includes(businessId) ? prev.filter(id => id !== businessId) : [...prev, businessId]
    )
  }

  const getPlaceholderImage = (category: string) => {
    return CATEGORY_PLACEHOLDERS[category] || "/images/placeholders/services.svg"
  }

  // Normalize state abbreviation (some data has "Te" instead of "TX")
  const normalizeState = (state: string) => {
    if (!state) return 'TX'
    const normalized = state.trim().toUpperCase()
    if (normalized === 'TE' || normalized === 'TEXAS') return 'TX'
    return normalized.length > 2 ? 'TX' : normalized
  }

  const FiltersComponent = () => (
    <div className="space-y-3">
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Filters
        </Button>
      )}

      {/* Sort */}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium">Sort by</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <Select value={filters.sort} onValueChange={(value) => updateFilter("sort", value)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* City */}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium">City</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <Select value={filters.city} onValueChange={(value) => updateFilter("city", value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category */}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium">Category</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DB_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="space-y-2">
            {[4.5, 4, 3.5, 3].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => updateFilter("rating", checked ? rating : 0)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 cursor-pointer text-sm">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : i < rating ? "fill-amber-400/50 text-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{rating}+</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Results</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersComponent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <FiltersComponent />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {urlQuery ? `Results for "${urlQuery}"` : "All Businesses"}
                    {filters.city !== "all" && ` in ${filters.city}`}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {loading ? "Loading..." : `${businesses.length} of ${totalCount} businesses`}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && businesses.length === 0 && (
                <Card className="p-12 text-center">
                  <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No businesses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to find what you&apos;re looking for.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Clear all filters
                  </Button>
                </Card>
              )}

              {/* Results List */}
              {!loading && (
                <div className="space-y-4">
                  {businesses.map((business) => (
                    <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                          {/* Image */}
                          <div className="md:col-span-3 relative">
                            <Image
                              src={business.image && !business.image.includes('placeholder') ? business.image : getPlaceholderImage(business.category)}
                              alt={business.name}
                              width={300}
                              height={200}
                              className="w-full h-48 md:h-full object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                              onClick={() => toggleFavorite(business.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  favorites.includes(business.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                            {business.is_featured && (
                              <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                                Featured
                              </Badge>
                            )}
                          </div>

                          {/* Content */}
                          <div className="md:col-span-9 p-4 md:p-6">
                            <div className="flex flex-col h-full">
                              {/* Header */}
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                <div>
                                  <Link href={`/business/${business.slug}`}>
                                    <h3 className="text-xl font-semibold hover:text-primary cursor-pointer transition-colors">
                                      {business.name}
                                    </h3>
                                  </Link>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-muted-foreground capitalize">{business.category}</span>
                                    {business.price_range && (
                                      <>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-muted-foreground">{business.price_range}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                  <span className="font-semibold text-lg">{Number(business.rating).toFixed(1)}</span>
                                  <span className="text-muted-foreground">({business.review_count})</span>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {business.description && !business.description.startsWith('{') && !business.description.startsWith('[')
                                  ? business.description
                                  : `${business.name} is a local business in ${business.address_city}, TX.`}
                              </p>

                              {/* Tags */}
                              {business.tags && business.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {business.tags.slice(0, 4).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Location */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {business.address_street}, {business.address_city}, {normalizeState(business.address_state)} {business.address_zip}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-2 mt-auto">
                                {business.phone && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={`tel:${business.phone}`}>
                                      <Phone className="w-4 h-4 mr-2" />
                                      Call
                                    </a>
                                  </Button>
                                )}
                                {business.website && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Website
                                    </a>
                                  </Button>
                                )}
                                <Button size="sm" asChild>
                                  <Link href={`/business/${business.slug}`}>View Details</Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

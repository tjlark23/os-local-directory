"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CategoryFilterTabs } from "@/components/category-filter-tabs"
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

// Map frontend categories to database categories
const CATEGORY_MAP: Record<string, string[]> = {
  "all": [],
  "food": ["restaurants"],
  "health-beauty": ["health", "beauty", "fitness"],
  "auto-services": ["automotive"],
  "shopping": ["shopping"],
  "entertainment": ["entertainment"],
  "pets": ["pets"],
  "real-estate": ["services"],
  "home-services": ["home"],
  "services": ["services", "financial", "education"],
}

type FilterCategory = "all" | "food" | "health-beauty" | "auto-services" | "shopping" | "entertainment" | "pets" | "real-estate" | "services" | "home-services"

interface Business {
  id: string
  slug: string
  name: string
  description: string
  category: string
  image: string
  rating: number
  review_count: number
  price_range: string | null
  address_street: string
  address_city: string
  address_state: string
  is_featured: boolean
  tags: string[]
}

export function FeaturedBusinessesWithFilter() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true)

      try {
        // First get the location ID for Leander
        const { data: location } = await supabase
          .from('locations')
          .select('id')
          .eq('slug', 'leander')
          .single()

        if (!location) {
          setLoading(false)
          return
        }

        // When "all" is selected, get diverse businesses from different categories
        if (activeCategory === "all") {
          const categoriesToFeature = ['restaurants', 'health', 'automotive', 'home', 'shopping', 'services', 'entertainment', 'pets', 'beauty', 'financial', 'education', 'fitness']
          const diverseBusinesses: Business[] = []
          const seenNames = new Set<string>()

          for (const category of categoriesToFeature) {
            if (diverseBusinesses.length >= 8) break

            const { data: categoryBusinesses } = await supabase
              .from('businesses')
              .select('*')
              .eq('location_id', location.id)
              .eq('category', category)
              .order('rating', { ascending: false })
              .order('review_count', { ascending: false })
              .limit(5)

            if (categoryBusinesses) {
              // Find first unique business in this category
              for (const biz of categoryBusinesses) {
                const normalizedName = biz.name.toLowerCase().trim()
                if (!seenNames.has(normalizedName)) {
                  seenNames.add(normalizedName)
                  diverseBusinesses.push(biz)
                  break
                }
              }
            }
          }

          // If we don't have enough diverse businesses, fetch top-rated businesses overall
          if (diverseBusinesses.length < 8) {
            const { data: topBusinesses } = await supabase
              .from('businesses')
              .select('*')
              .eq('location_id', location.id)
              .order('is_featured', { ascending: false })
              .order('rating', { ascending: false })
              .order('review_count', { ascending: false })
              .limit(30)

            if (topBusinesses) {
              for (const biz of topBusinesses) {
                if (diverseBusinesses.length >= 8) break
                const normalizedName = biz.name.toLowerCase().trim()
                if (!seenNames.has(normalizedName)) {
                  seenNames.add(normalizedName)
                  diverseBusinesses.push(biz)
                }
              }
            }
          }

          setBusinesses(diverseBusinesses)
          setTotalCount(diverseBusinesses.length)
        } else {
          // For specific category, get businesses from that category
          const dbCategories = CATEGORY_MAP[activeCategory] || []

          let query = supabase
            .from('businesses')
            .select('*', { count: 'exact' })
            .eq('location_id', location.id)

          if (dbCategories.length > 0) {
            query = query.in('category', dbCategories)
          }

          query = query
            .order('rating', { ascending: false })
            .order('review_count', { ascending: false })
            .limit(50)

          const { data, count, error } = await query

          if (error) {
            console.error('Error fetching businesses:', error)
            return
          }

          // Dedupe by name
          const uniqueBusinesses: Business[] = []
          const seenNames = new Set<string>()

          for (const biz of (data || [])) {
            const normalizedName = biz.name.toLowerCase().trim()
            if (!seenNames.has(normalizedName) && uniqueBusinesses.length < 8) {
              seenNames.add(normalizedName)
              uniqueBusinesses.push(biz)
            }
          }

          setBusinesses(uniqueBusinesses)
          setTotalCount(count || 0)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [activeCategory])

  const getPlaceholderImage = (category: string) => {
    return CATEGORY_PLACEHOLDERS[category] || "/images/placeholders/services.svg"
  }

  const getImageSrc = (business: Business) => {
    if (business.image && !business.image.includes('placeholder')) {
      return business.image
    }
    return getPlaceholderImage(business.category)
  }

  // Clean description - remove JSON if present and generate a better fallback
  const cleanDescription = (business: Business) => {
    const desc = business.description
    const name = business.name
    const city = business.address_city

    // If description is valid (not JSON, not too short), use it
    if (desc && !desc.startsWith('{') && !desc.startsWith('[') && desc.trim().length > 20) {
      return desc.length > 120 ? desc.slice(0, 120) + '...' : desc
    }

    // Generate a better description
    const categoryNames: Record<string, string> = {
      restaurants: "restaurant",
      health: "health & wellness provider",
      beauty: "beauty salon",
      fitness: "fitness center",
      automotive: "automotive service",
      shopping: "retail store",
      services: "professional service provider",
      pets: "pet services",
      home: "home services provider",
      entertainment: "entertainment venue",
    }
    const categoryName = categoryNames[business.category] || "business"
    const rating = Number(business.rating) || 0

    let fallback = `${name} is a top-rated ${categoryName} in ${city}, TX`
    if (rating > 0) {
      fallback += ` with a ${rating.toFixed(1)}-star rating.`
    } else {
      fallback += "."
    }

    return fallback
  }

  // Normalize state abbreviation (some data has "Te" instead of "TX")
  const normalizeState = (state: string) => {
    if (!state) return 'TX'
    const normalized = state.trim().toUpperCase()
    if (normalized === 'TE' || normalized === 'TEXAS') return 'TX'
    return normalized.length > 2 ? 'TX' : normalized
  }

  return (
    <section className="bg-background">
      <CategoryFilterTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {activeCategory === "all" ? "Featured Businesses" : `${getCategoryName(activeCategory)} Businesses`}
            </h2>
            <p className="text-muted-foreground">
              {activeCategory === "all"
                ? "Discover top-rated local favorites"
                : `Browse ${totalCount} businesses in this category`}
            </p>
          </div>
          <Link href="/search">
            <Button variant="ghost" className="group text-primary hover:text-primary/80">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No businesses found in this category.</p>
            <Button variant="outline" onClick={() => setActiveCategory("all")}>
              View All Businesses
            </Button>
          </div>
        )}

        {/* Business Grid */}
        {!loading && businesses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business, index) => (
              <Card
                key={business.id}
                className={`group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-card`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(business.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={getImageSrc(business)}
                    alt={business.name}
                    width={600}
                    height={400}
                    className="w-full h-48 sm:h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={95}
                    unoptimized={getImageSrc(business).startsWith('http')}
                  />
                  {/* Overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-foreground/20 transition-opacity duration-300 ${hoveredCard === business.id ? "opacity-100" : "opacity-0"}`}
                  />

                  {business.is_featured && (
                    <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                      Featured
                    </Badge>
                  )}
                  {/* Price range badge */}
                  {business.price_range && (
                    <Badge
                      variant="secondary"
                      className="absolute bottom-3 right-3 bg-card/90 text-card-foreground font-medium"
                    >
                      {business.price_range}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-3">
                    <Link href={`/business/${business.slug}`}>
                      <h3 className="font-bold text-lg text-card-foreground hover:text-primary cursor-pointer mb-2 transition-colors line-clamp-1">
                        {business.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(Number(business.rating)) ? "fill-amber-400 text-amber-400" : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-sm text-card-foreground">{Number(business.rating).toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">({business.review_count})</span>
                    </div>
                    <div className="text-primary text-sm font-semibold mb-2 capitalize">{business.category}</div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {cleanDescription(business)}
                  </p>

                  <div className="flex items-start text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                    <span className="line-clamp-1">{business.address_street}, {business.address_city}, {normalizeState(business.address_state)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                      {business.address_city}
                    </Badge>
                    <Link href={`/business/${business.slug}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group/btn p-0">
                        View Details
                        <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function getCategoryName(category: FilterCategory): string {
  const names: Record<FilterCategory, string> = {
    all: "All",
    food: "Food & Dining",
    "health-beauty": "Health & Beauty",
    "auto-services": "Auto Services",
    shopping: "Shopping",
    entertainment: "Entertainment",
    pets: "Pets",
    "real-estate": "Real Estate",
    services: "Professional Services",
    "home-services": "Home Services",
  }
  return names[category] || category
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CategoryFilterTabs } from "@/components/category-filter-tabs"

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

// Mock businesses data
const MOCK_BUSINESSES: Business[] = [
  {
    id: "1",
    slug: "bluebonnet-bbq",
    name: "Bluebonnet BBQ",
    description: "Authentic Texas barbecue with slow-smoked brisket, ribs, and all the classic sides. Family-owned since 2010.",
    category: "restaurants",
    image: "/texas-bbq-restaurant-smoky-brisket-rustic-interior.jpg",
    rating: 4.7,
    review_count: 127,
    price_range: "$$",
    address_street: "123 Main St",
    address_city: "Leander",
    address_state: "TX",
    is_featured: true,
    tags: ["BBQ", "Family Friendly", "Catering"],
  },
  {
    id: "2",
    slug: "hill-country-cafe",
    name: "Hill Country Cafe",
    description: "Farm-to-table dining featuring locally sourced ingredients and fresh breakfast favorites every morning.",
    category: "restaurants",
    image: "/cozy-american-cafe-interior-breakfast-brunch.jpg",
    rating: 4.6,
    review_count: 89,
    price_range: "$$",
    address_street: "789 Bell Blvd",
    address_city: "Cedar Park",
    address_state: "TX",
    is_featured: true,
    tags: ["Breakfast", "Brunch", "Local Favorite"],
  },
  {
    id: "3",
    slug: "serenity-wellness-spa",
    name: "Serenity Wellness Spa",
    description: "Full-service spa offering massage therapy, facials, and holistic wellness treatments in a peaceful setting.",
    category: "health",
    image: "/modern-wellness-spa-massage-therapy-center.jpg",
    rating: 4.9,
    review_count: 63,
    price_range: "$$$",
    address_street: "654 Wellness Way",
    address_city: "Leander",
    address_state: "TX",
    is_featured: true,
    tags: ["Massage", "Facials", "Relaxation"],
  },
  {
    id: "4",
    slug: "joes-pizza",
    name: "Joe's Pizza",
    description: "New York-style pizza made with authentic ingredients and traditional recipes. Delivery available.",
    category: "restaurants",
    image: "/new-york-pizza-slice-italian-restaurant-brick-oven.jpg",
    rating: 4.6,
    review_count: 94,
    price_range: "$",
    address_street: "890 Pizza Lane",
    address_city: "Leander",
    address_state: "TX",
    is_featured: false,
    tags: ["Pizza", "Italian", "Delivery"],
  },
  {
    id: "5",
    slug: "leander-pet-clinic",
    name: "Leander Pet Clinic",
    description: "Full-service veterinary clinic providing comprehensive care for dogs, cats, and exotic pets.",
    category: "pets",
    image: "/veterinary-clinic-happy-dog-cat-modern-clean-pet-c.jpg",
    rating: 4.9,
    review_count: 89,
    price_range: "$$",
    address_street: "456 Pet Care Lane",
    address_city: "Leander",
    address_state: "TX",
    is_featured: true,
    tags: ["Emergency Care", "Boarding", "Grooming"],
  },
  {
    id: "6",
    slug: "hill-country-realty",
    name: "Hill Country Realty",
    description: "Premier real estate agency specializing in residential properties throughout the greater Austin area.",
    category: "services",
    image: "/texas-hill-country-home-real-estate-beautiful-hous.jpg",
    rating: 4.8,
    review_count: 156,
    price_range: null,
    address_street: "789 Realty Row",
    address_city: "Cedar Park",
    address_state: "TX",
    is_featured: true,
    tags: ["Buying", "Selling", "Rentals"],
  },
  {
    id: "7",
    slug: "artisan-coffee-roasters",
    name: "Artisan Coffee Roasters",
    description: "Locally roasted specialty coffee with a cozy atmosphere. WiFi available and outdoor seating.",
    category: "restaurants",
    image: "/artisan-coffee-shop-latte-art-cozy-cafe-interior.jpg",
    rating: 4.8,
    review_count: 156,
    price_range: "$",
    address_street: "321 Coffee Blvd",
    address_city: "Leander",
    address_state: "TX",
    is_featured: false,
    tags: ["Coffee", "WiFi", "Outdoor Seating"],
  },
  {
    id: "8",
    slug: "precision-auto-care",
    name: "Precision Auto Care",
    description: "Full-service auto repair and maintenance. ASE certified technicians and honest pricing.",
    category: "automotive",
    image: "/professional-auto-repair-shop-mechanic-car-service.jpg",
    rating: 4.7,
    review_count: 112,
    price_range: "$$",
    address_street: "555 Auto Drive",
    address_city: "Leander",
    address_state: "TX",
    is_featured: false,
    tags: ["Oil Change", "Brakes", "AC Repair"],
  },
]

export function FeaturedBusinessesWithFilter() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(MOCK_BUSINESSES.length)

  // Filter businesses based on selected category
  useEffect(() => {
    if (activeCategory === "all") {
      setBusinesses(MOCK_BUSINESSES)
      setTotalCount(MOCK_BUSINESSES.length)
    } else {
      const categoryMap: Record<string, string[]> = {
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
      const dbCategories = categoryMap[activeCategory] || []
      const filtered = MOCK_BUSINESSES.filter(b => dbCategories.includes(b.category))
      setBusinesses(filtered)
      setTotalCount(filtered.length)
    }
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
                    width={800}
                    height={500}
                    className="w-full h-48 sm:h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={100}
                    unoptimized
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

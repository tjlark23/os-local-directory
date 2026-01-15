"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Sparkles, Star, MapPin } from "lucide-react"
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

interface Business {
  id: string
  slug: string
  name: string
  description: string
  category: string
  image: string
  rating: number
  review_count: number
  address_city: string
  address_state: string
  tags: string[]
  is_featured: boolean
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([])
  const [sponsoredBusinesses, setSponsoredBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const { data: location } = await supabase
          .from('locations')
          .select('id')
          .eq('slug', 'leander')
          .single()

        if (!location) return

        // Fetch top-rated businesses - get more than we need to dedupe (database has many duplicates)
        const { data: allTopBusinesses } = await supabase
          .from('businesses')
          .select('*')
          .eq('location_id', location.id)
          .order('rating', { ascending: false })
          .order('review_count', { ascending: false })
          .limit(50)

        if (allTopBusinesses && allTopBusinesses.length > 0) {
          // Dedupe by name (database has duplicate entries with different slugs)
          const uniqueBusinesses: Business[] = []
          const seenNames = new Set<string>()

          for (const biz of allTopBusinesses) {
            const normalizedName = biz.name.toLowerCase().trim()
            if (!seenNames.has(normalizedName)) {
              seenNames.add(normalizedName)
              uniqueBusinesses.push(biz)
            }
          }

          // First 3 unique businesses for carousel, next 3 for sidebar
          setFeaturedBusinesses(uniqueBusinesses.slice(0, 3))
          setSponsoredBusinesses(uniqueBusinesses.slice(3, 6))
        }
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  useEffect(() => {
    if (featuredBusinesses.length === 0) return

    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % featuredBusinesses.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [currentSlide, featuredBusinesses.length])

  const handleSlideChange = (index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  const nextSlide = () => {
    if (featuredBusinesses.length === 0) return
    handleSlideChange((currentSlide + 1) % featuredBusinesses.length)
  }

  const prevSlide = () => {
    if (featuredBusinesses.length === 0) return
    handleSlideChange((currentSlide - 1 + featuredBusinesses.length) % featuredBusinesses.length)
  }

  const getImageSrc = (business: Business) => {
    if (business.image && !business.image.includes('placeholder')) {
      return business.image
    }
    return CATEGORY_PLACEHOLDERS[business.category] || "/images/placeholders/services.svg"
  }

  const cleanDescription = (desc: string, name: string, city: string) => {
    if (!desc || desc.startsWith('{') || desc.startsWith('[')) {
      return `${name} is a top-rated business in ${city}, TX.`
    }
    return desc.length > 100 ? desc.slice(0, 100) + '...' : desc
  }

  // Normalize state abbreviation (some data has "Te" instead of "TX")
  const normalizeState = (state: string) => {
    if (!state) return 'TX'
    const normalized = state.trim().toUpperCase()
    if (normalized === 'TE' || normalized === 'TEXAS') return 'TX'
    return normalized.length > 2 ? 'TX' : normalized
  }

  if (loading) {
    return (
      <div className="relative bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[60%] h-[400px] lg:h-[480px] rounded-2xl bg-muted animate-pulse" />
            <div className="lg:w-[40%] flex flex-col gap-4 h-[400px] lg:h-[480px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (featuredBusinesses.length === 0) {
    return null
  }

  const currentBusiness = featuredBusinesses[currentSlide]

  return (
    <div className="relative bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Hero Image - 60% width */}
          <div className="lg:w-[60%] relative h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            >
              <Image
                src={getImageSrc(currentBusiness)}
                alt={currentBusiness.name}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            </div>

            {/* Business Info - Embedded in bottom left */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div
                className={`transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/90 text-primary-foreground text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                  <span className="text-primary-foreground/80 text-sm capitalize">{currentBusiness.category}</span>
                </div>
                <Link href={`/business/${currentBusiness.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2 hover:underline cursor-pointer">
                    {currentBusiness.name}
                  </h2>
                </Link>
                <p className="text-primary-foreground/80 text-lg mb-3 max-w-md">
                  {cleanDescription(currentBusiness.description, currentBusiness.name, currentBusiness.address_city)}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-primary-foreground font-semibold">{Number(currentBusiness.rating).toFixed(1)}</span>
                    <span className="text-primary-foreground/70">({currentBusiness.review_count})</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-foreground/80">
                    <MapPin className="w-4 h-4" />
                    <span>{currentBusiness.address_city}, {normalizeState(currentBusiness.address_state)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/30 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-foreground hover:bg-card/50 transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/30 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-foreground hover:bg-card/50 transition-all duration-300 z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Dots */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 z-20">
              {featuredBusinesses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-primary-foreground/50 hover:bg-primary-foreground/70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sponsored Cards - 40% width, aligned with hero */}
          <div className="lg:w-[40%] flex flex-col gap-4 h-[400px] lg:h-[480px]">
            {sponsoredBusinesses.map((business, index) => (
              <Link key={business.id} href={`/business/${business.slug}`} className="flex-1 min-h-0">
                <Card
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up border-border/50 h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex h-full">
                      <div className="relative w-36 flex-shrink-0">
                        <Image
                          src={getImageSrc(business)}
                          alt={business.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-sm">
                              {business.name}
                            </h4>
                            <div className="flex items-center gap-0.5 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded flex-shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-xs">{Number(business.rating).toFixed(1)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">{business.category}</p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {(business.tags || []).slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{business.address_city}, {normalizeState(business.address_state)}</span>
                            </div>
                            <span className="text-green-600 dark:text-green-400 font-medium flex-shrink-0">
                              {business.review_count} reviews
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

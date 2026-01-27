'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Sparkles, Star, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Category placeholder images
const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  restaurants: '/images/placeholders/restaurant.svg',
  health: '/images/placeholders/health.svg',
  beauty: '/images/placeholders/beauty.svg',
  fitness: '/images/placeholders/fitness.svg',
  automotive: '/images/placeholders/automotive.svg',
  services: '/images/placeholders/services.svg',
  education: '/images/placeholders/education.svg',
  pets: '/images/placeholders/pets.svg',
  financial: '/images/placeholders/financial.svg',
  home: '/images/placeholders/home.svg',
  entertainment: '/images/placeholders/entertainment.svg',
}

interface Business {
  id: string
  slug: string
  name: string
  description?: string
  category: string
  image: string
  rating: number
  review_count: number
  city: string
  tags?: string[]
  is_featured?: boolean
}

interface HeroCarouselProps {
  businesses: Business[]
}

export default function HeroCarousel({ businesses }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Split businesses: first 3 for carousel, next 2 for sidebar
  const featuredBusinesses = businesses.slice(0, 3)
  const sidebarBusinesses = businesses.slice(3, 5)

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
      // Upgrade Google image URLs to higher resolution (1600x1000 instead of 800x500)
      if (business.image.includes('googleusercontent.com')) {
        return business.image.replace(/=w\d+-h\d+/, '=w1600-h1000')
      }
      return business.image
    }
    return CATEGORY_PLACEHOLDERS[business.category.toLowerCase()] || '/images/placeholders/services.svg'
  }

  const cleanDescription = (business: Business) => {
    const desc = business.description
    const name = business.name
    const city = business.city

    // If description is valid, use it
    if (desc && !desc.startsWith('{') && !desc.startsWith('[') && desc.trim().length > 20) {
      return desc.length > 100 ? desc.slice(0, 100) + '...' : desc
    }

    // Generate fallback description
    return `${name} is a top-rated ${business.category} in ${city}, TX with a ${Number(business.rating).toFixed(1)}-star rating.`
  }

  if (featuredBusinesses.length === 0) {
    return null
  }

  const currentBusiness = featuredBusinesses[currentSlide]

  return (
    <div className="relative bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Hero Carousel - 60% width */}
          <div className="lg:w-[60%] relative h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Image
                src={getImageSrc(currentBusiness)}
                alt={currentBusiness.name}
                fill
                className="object-cover"
                quality={100}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                unoptimized
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* City Badge - Top Right */}
            <div className="absolute top-5 right-5 z-20">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-sm font-medium text-gray-800">
                  📍 {currentBusiness.city}, TX
                </span>
              </div>
            </div>

            {/* Business Info - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div
                className={`transition-all duration-500 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {currentBusiness.is_featured && (
                    <Badge className="bg-red-600 text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <span className="text-white/80 text-sm capitalize">{currentBusiness.category}</span>
                </div>
                <Link href={`/business/${currentBusiness.slug}`}>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 hover:underline cursor-pointer">
                    {currentBusiness.name}
                  </h2>
                </Link>
                <p className="text-white/80 text-lg mb-3 max-w-md">
                  {cleanDescription(currentBusiness)}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-semibold">
                      {Number(currentBusiness.rating).toFixed(1)}
                    </span>
                    <span className="text-white/70">({currentBusiness.review_count})</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span>{currentBusiness.city}, TX</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all duration-300 z-20"
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
                      ? 'w-6 h-2 bg-red-600'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sidebar Cards - 40% width, 2 cards stacked */}
          <div className="lg:w-[40%] flex flex-col gap-4 h-[400px] lg:h-[480px]">
            {sidebarBusinesses.map((business, index) => (
              <Link key={business.id} href={`/business/${business.slug}`} className="flex-1 min-h-0">
                <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 h-full rounded-xl">
                  {/* Full-bleed background image */}
                  <div className="absolute inset-0">
                    <Image
                      src={getImageSrc(business)}
                      alt={business.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      quality={100}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      unoptimized
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/85 transition-all duration-500" />
                  </div>

                  {/* Rating badge - top right */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm text-gray-900">
                        {Number(business.rating).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Category badge - top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-red-600 text-white text-xs font-medium shadow-lg">
                      {business.category}
                    </Badge>
                  </div>

                  {/* Content overlay - bottom */}
                  <CardContent className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h4 className="font-bold text-white text-xl mb-1 group-hover:text-red-500 transition-colors duration-300 drop-shadow-lg">
                      {business.name}
                    </h4>

                    {business.description && (
                      <p className="text-white/80 text-sm mb-3 line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    {/* Tags */}
                    {business.tags && business.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {business.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{business.city}, TX</span>
                      </div>
                      <span className="text-sm text-green-400 font-medium">
                        {business.review_count} review{business.review_count !== 1 ? 's' : ''}
                      </span>
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

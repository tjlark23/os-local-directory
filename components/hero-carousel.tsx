"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Sparkles, Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredBusinesses = [
  {
    id: "bluebonnet-bbq",
    name: "Bluebonnet BBQ",
    image: "/texas-bbq-restaurant-smoky-brisket-rustic-interior.jpg",
    description: "Award-winning Texas BBQ with slow-smoked perfection",
    tagline: "Authentic Texas Flavor",
    rating: 4.8,
    reviewCount: 127,
    category: "BBQ Restaurant",
    location: "Leander, TX",
  },
  {
    id: "hill-country-cafe",
    name: "Hill Country Cafe",
    image: "/cozy-american-cafe-breakfast-brunch-rustic-interio.jpg",
    description: "Farm-to-table dining with local ingredients",
    tagline: "Fresh & Local",
    rating: 4.6,
    reviewCount: 89,
    category: "American Cafe",
    location: "Cedar Park, TX",
  },
  {
    id: "wellness-center-leander",
    name: "Wellness Center",
    image: "/modern-yoga-studio-wellness-spa-peaceful-minimalis.jpg",
    description: "Find your inner peace and strength",
    tagline: "Mind, Body, Soul",
    rating: 4.9,
    reviewCount: 156,
    category: "Wellness & Spa",
    location: "Leander, TX",
  },
]

const sponsoredBusinesses = [
  {
    id: "artisan-coffee-roasters",
    name: "Artisan Coffee Roasters",
    image: "/artisan-coffee-shop-latte-art-cozy-cafe-interior.jpg",
    rating: 4.8,
    reviewCount: 94,
    category: "Coffee Shop",
    location: "Leander, TX",
    hours: "Open until 8PM",
    tags: ["WiFi", "Outdoor Seating"],
  },
  {
    id: "joes-pizza",
    name: "Joe's Pizza",
    image: "/new-york-pizza-slice-italian-restaurant-brick-oven.jpg",
    rating: 4.6,
    reviewCount: 112,
    category: "Italian",
    location: "Cedar Park, TX",
    hours: "Open until 10PM",
    tags: ["Delivery", "Family Friendly"],
  },
  {
    id: "leander-pet-clinic",
    name: "Leander Pet Clinic",
    image: "/veterinary-clinic-happy-dog-cat-modern-clean-pet-c.jpg",
    rating: 4.9,
    reviewCount: 78,
    category: "Veterinary",
    location: "Leander, TX",
    hours: "Open until 6PM",
    tags: ["Emergency Care", "Boarding"],
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((currentSlide + 1) % featuredBusinesses.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [currentSlide])

  const handleSlideChange = (index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  const nextSlide = () => {
    handleSlideChange((currentSlide + 1) % featuredBusinesses.length)
  }

  const prevSlide = () => {
    handleSlideChange((currentSlide - 1 + featuredBusinesses.length) % featuredBusinesses.length)
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
                src={currentBusiness.image || "/placeholder.svg"}
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
                  <span className="text-primary-foreground/80 text-sm">{currentBusiness.category}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">{currentBusiness.name}</h2>
                <p className="text-primary-foreground/80 text-lg mb-3 max-w-md">{currentBusiness.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-primary-foreground font-semibold">{currentBusiness.rating}</span>
                    <span className="text-primary-foreground/70">({currentBusiness.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-foreground/80">
                    <MapPin className="w-4 h-4" />
                    <span>{currentBusiness.location}</span>
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
              <Link key={business.id} href={`/business/${business.id}`} className="flex-1 min-h-0">
                <Card
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up border-border/50 h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0 h-full">
                    <div className="flex h-full">
                      <div className="relative w-36 flex-shrink-0">
                        <Image
                          src={business.image || "/placeholder.svg"}
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
                              <span className="font-semibold text-xs">{business.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{business.category}</p>
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {business.tags.map((tag) => (
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
                              <span className="truncate">{business.location}</span>
                            </div>
                            <span className="text-green-600 dark:text-green-400 font-medium flex-shrink-0">
                              {business.hours}
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

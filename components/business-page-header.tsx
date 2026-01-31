"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Share2, MessageSquare, MapPin, Globe, Clock, CheckCircle2, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/site-config"

// Category display names (singular)
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  restaurants: "Restaurant",
  health: "Health & Wellness",
  beauty: "Beauty & Spa",
  fitness: "Fitness & Sports",
  automotive: "Auto Service",
  shopping: "Shopping & Retail",
  services: "Professional Service",
  education: "Education",
  pets: "Pet Service",
  financial: "Financial Service",
  home: "Home Service",
  entertainment: "Entertainment",
}

interface BusinessPageHeaderProps {
  business: {
    id: string
    name: string
    category: string
    rating: number
    reviewCount: number
    priceRange: string
    featured: boolean
    claimed: boolean
    currentlyOpen?: boolean
    phone?: string
    website?: string
    address: {
      full: string
    }
    photos?: string[]
    listingTier?: 'free' | 'premium' | 'featured'
    dealsBanner?: string
  }
  onContactClick?: () => void
}

export function BusinessPageHeader({ business, onContactClick }: BusinessPageHeaderProps) {
  const [copied, setCopied] = useState(false)

  // Filter out invalid/empty photo URLs
  const validPhotos = (business.photos || []).filter(photo =>
    photo && photo.trim() !== '' && !photo.includes('placeholder')
  )

  const heroImage = validPhotos[0] || "/images/placeholders/business-default.jpg"
  const hasMultiplePhotos = validPhotos.length > 1
  // Only get gallery images that actually exist
  const galleryImages = hasMultiplePhotos ? validPhotos.slice(1, 5) : []

  // Only show deals banner for premium/featured listings
  const showDealsBanner = business.dealsBanner &&
    (business.listingTier === 'premium' || business.listingTier === 'featured')

  return (
    <div className="bg-background">
      {/* Deals Banner - Premium Feature */}
      {showDealsBanner && (
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-center">
              <Tag className="w-5 h-5 animate-pulse" />
              <span className="font-semibold text-lg">{business.dealsBanner}</span>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-6">
        {/* Photo grid - 50/50 split: large image left, 2x2 grid right */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
          {/* Back to Search button - positioned top-left over the image */}
          <Link
            href="/search"
            className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:text-gray-900 transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>

          {/* Left: Main large image (50%) */}
          <div className="relative group cursor-pointer">
            <Image
              src={heroImage}
              alt={business.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              quality={75}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Right: 2x2 grid of smaller images (50%) - only show if we have additional photos */}
          {galleryImages.length > 0 && (
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2">
              {[0, 1, 2, 3].map((index) => {
                const photo = galleryImages[index]
                const isLastWithMore = index === galleryImages.length - 1 && validPhotos.length > 5

                // Don't render empty slots
                if (!photo) {
                  return <div key={index} className="bg-muted/30 rounded-lg" />
                }

                return (
                  <div key={index} className="relative group cursor-pointer overflow-hidden bg-muted rounded-lg">
                    <Image
                      src={photo}
                      alt={`${business.name} photo ${index + 2}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      quality={75}
                      onError={(e) => {
                        // Hide broken images
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                    {isLastWithMore && (
                      <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-lg">
                          +{validPhotos.length - 5} more
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            {/* Title and badges */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{business.name}</h1>
              {business.featured && <Badge className="bg-primary text-primary-foreground">Featured</Badge>}
              {business.claimed && (
                <Badge variant="outline" className="border-green-500 text-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold text-lg">{business.rating}</span>
                </div>
                <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground font-medium">{CATEGORY_DISPLAY_NAMES[business.category] || business.category}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground">{business.priceRange}</span>
            </div>

            {/* Quick info row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {business.currentlyOpen !== undefined && (
                <Badge
                  variant={business.currentlyOpen ? "default" : "secondary"}
                  className={business.currentlyOpen ? "bg-green-600" : ""}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {business.currentlyOpen ? "Open Now" : "Closed"}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{business.address.full}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Primary CTA - Message Business */}
            <Button
              size="lg"
              onClick={onContactClick}
              className="bg-[#eb7b1c] hover:bg-[#d66a10] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Business
            </Button>

            {business.website && (
              <Button size="lg" variant="outline" className="hover:bg-muted bg-transparent" asChild>
                <a href={business.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="hover:bg-muted bg-transparent"
              onClick={() => {
                navigator.clipboard.writeText(`${siteConfig.url}/business/${business.id}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Share"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

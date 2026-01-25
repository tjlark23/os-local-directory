"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Share2, MessageSquare, MapPin, Phone, Globe, Clock, CheckCircle2, Tag } from "lucide-react"
import Image from "next/image"

interface BusinessPageHeaderProps {
  business: {
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
}

export function BusinessPageHeader({ business }: BusinessPageHeaderProps) {
  const [isSaved, setIsSaved] = useState(false)

  const heroImage = business.photos?.[0] || "/images/placeholders/business-default.jpg"
  const hasMultiplePhotos = business.photos && business.photos.length > 1
  const galleryImages = hasMultiplePhotos ? business.photos.slice(1, 5) : []

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
        {/* Photo grid - adapts based on number of photos */}
        {hasMultiplePhotos && galleryImages.length >= 4 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-2xl overflow-hidden">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer">
              <Image
                src={heroImage}
                alt={business.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* Gallery images */}
            {galleryImages.map((img, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden">
                <Image
                  src={img}
                  alt={`${business.name} photo ${index + 2}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                {index === 3 && business.photos && business.photos.length > 5 && (
                  <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold text-lg">
                      +{business.photos.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Single image layout when not enough photos */
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={heroImage}
              alt={business.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
          </div>
        )}
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
              <span className="text-foreground font-medium">{business.category}</span>
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
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Get Quote
            </Button>

            {business.phone && (
              <Button size="lg" variant="outline" className="hover:bg-muted bg-transparent">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}

            {business.website && (
              <Button size="lg" variant="outline" className="hover:bg-muted bg-transparent">
                <Globe className="w-4 h-4 mr-2" />
                Website
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? "border-red-500 text-red-500 hover:bg-red-50" : "hover:bg-muted"}
            >
              <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-red-500" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <Button size="lg" variant="outline" className="hover:bg-muted bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

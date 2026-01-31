"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

// Category display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  restaurants: "Restaurant",
  health: "Health & Wellness",
  beauty: "Beauty & Spa",
  fitness: "Fitness",
  automotive: "Automotive",
  shopping: "Shopping",
  services: "Services",
  education: "Education",
  pets: "Pets",
  financial: "Financial",
  home: "Home Services",
  entertainment: "Entertainment",
}

interface BusinessCardVerticalProps {
  business: {
    id: string
    slug: string
    name: string
    description: string
    category: string
    image: string
    address_city: string
    address_state: string
    rating: number
    review_count: number
    is_featured: boolean
  }
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
}

export function BusinessCardVertical({ business, isFavorite = false, onToggleFavorite }: BusinessCardVerticalProps) {
  const getPlaceholderImage = (category: string) => {
    return CATEGORY_PLACEHOLDERS[category] || "/images/placeholders/services.svg"
  }

  const getCategoryDisplayName = (category: string) => {
    return CATEGORY_DISPLAY_NAMES[category] || category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Normalize state abbreviation (some data has "Te" instead of "TX")
  const normalizeState = (state: string) => {
    if (!state) return 'TX'
    const normalized = state.trim().toUpperCase()
    if (normalized === 'TE' || normalized === 'TEXAS') return 'TX'
    return normalized.length > 2 ? 'TX' : normalized
  }

  // Clean description - handle JSON or invalid data
  const getCleanDescription = (desc: string) => {
    if (!desc || desc.startsWith('{') || desc.startsWith('[')) {
      return `${business.name} is a local business in ${business.address_city}, ${normalizeState(business.address_state)}.`
    }
    return desc
  }

  const imageUrl = business.image && !business.image.includes('placeholder')
    ? business.image
    : getPlaceholderImage(business.category)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
      {/* Image Container - aspect ratio ensures consistent sizing without white space */}
      <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={business.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
        />

        {/* Rating Badge - Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{Number(business.rating).toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({business.review_count})</span>
        </div>

        {/* Featured Badge */}
        {business.is_featured && (
          <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 bg-background/80 hover:bg-background h-8 w-8"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite(business.id)
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Business Name */}
        <Link href={`/business/${business.slug}`}>
          <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
            {business.name}
          </h3>
        </Link>

        {/* Description - 2 lines max */}
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
          {getCleanDescription(business.description)}
        </p>

        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground mt-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{business.address_city}, {normalizeState(business.address_state)}</span>
        </div>

        {/* View Business Button */}
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90" asChild>
          <Link href={`/business/${business.slug}`}>
            View Business
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

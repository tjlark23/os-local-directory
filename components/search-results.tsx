"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Heart, Phone, ExternalLink, Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { searchBusinesses, BUSINESS_COUNT } from "@/lib/data"
import type { Business, SearchFilters } from "@/lib/types"
import type { SearchFiltersState } from "./search-filters"

interface SearchResultsProps {
  query: string
  location: string
  filters: SearchFiltersState
}

export function SearchResults({ query, location, filters }: SearchResultsProps) {
  const [favorites, setFavorites] = useState<string[]>([])

  // Convert component filters to data layer filters and search
  const results = useMemo(() => {
    const searchFilters: SearchFilters = {
      query: query || undefined,
      location: filters.city !== "all" ? filters.city : location || undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      minRating: filters.rating > 0 ? filters.rating : undefined,
      isOpen: filters.openNow || undefined,
      hasPhotos: filters.hasPhotos || undefined,
      priceRange: filters.priceRange.length > 0 ? filters.priceRange : undefined,
      sortBy: filters.sort,
    }

    return searchBusinesses(searchFilters)
  }, [query, location, filters])

  const toggleFavorite = (businessId: string) => {
    setFavorites((prev) =>
      prev.includes(businessId) ? prev.filter((id) => id !== businessId) : [...prev, businessId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {query ? `Results for "${query}"` : "All Businesses"}
            {filters.city !== "all" && ` in ${filters.city}`}
            {filters.city === "all" && location && ` in ${location}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {results.length} of {BUSINESS_COUNT} businesses
          </p>
        </div>
      </div>

      {/* No Results */}
      {results.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No businesses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" asChild>
            <Link href="/search">Clear all filters</Link>
          </Button>
        </Card>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            isFavorite={favorites.includes(business.id)}
            onToggleFavorite={() => toggleFavorite(business.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface BusinessCardProps {
  business: Business
  isFavorite: boolean
  onToggleFavorite: () => void
}

function BusinessCard({ business, isFavorite, onToggleFavorite }: BusinessCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Image */}
          <div className="md:col-span-3 relative">
            <Image
              src={business.image || "/placeholder.svg"}
              alt={business.name}
              width={300}
              height={200}
              className="w-full h-48 md:h-full object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              onClick={onToggleFavorite}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </Button>
            {business.featured && (
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
                  <Link href={`/business/${business.id}`}>
                    <h3 className="text-xl font-semibold hover:text-primary cursor-pointer transition-colors">
                      {business.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">{business.category}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{business.priceRange}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-lg">{business.rating}</span>
                  <span className="text-muted-foreground">({business.reviewCount})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {business.shortDescription || business.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {business.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Location & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{business.address.full}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className={business.currentlyOpen ? "text-green-600" : "text-red-600"}>
                    {business.currentlyOpen ? "Open now" : "Closed"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${business.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </Button>
                {business.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                <Button size="sm" asChild>
                  <Link href={`/business/${business.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

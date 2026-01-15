"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Star, RotateCcw } from "lucide-react"
import { CATEGORIES, CITIES } from "@/lib/data"
import type { FilterCategory } from "@/lib/types"

export interface SearchFiltersState {
  category: FilterCategory | "all"
  city: string
  rating: number
  openNow: boolean
  hasPhotos: boolean
  priceRange: string[]
  sort: "relevance" | "rating" | "reviews"
}

interface SearchFiltersProps {
  filters: SearchFiltersState
  onFiltersChange: (filters: SearchFiltersState) => void
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = <K extends keyof SearchFiltersState>(key: K, value: SearchFiltersState[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const togglePriceRange = (price: string) => {
    const current = filters.priceRange
    if (current.includes(price)) {
      updateFilter("priceRange", current.filter(p => p !== price))
    } else {
      updateFilter("priceRange", [...current, price])
    }
  }

  const resetFilters = () => {
    onFiltersChange({
      category: "all",
      city: "all",
      rating: 0,
      openNow: false,
      hasPhotos: false,
      priceRange: [],
      sort: "relevance",
    })
  }

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.city !== "all" ||
    filters.rating > 0 ||
    filters.openNow ||
    filters.hasPhotos ||
    filters.priceRange.length > 0

  return (
    <div className="space-y-3">
      {/* Reset Button */}
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
          <Select value={filters.sort} onValueChange={(value) => updateFilter("sort", value as SearchFiltersState["sort"])}>
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
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value as FilterCategory | "all")}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
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

      {/* Price Range */}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="grid grid-cols-4 gap-1">
            {["$", "$$", "$$$", "$$$$"].map((price) => (
              <Button
                key={price}
                variant={filters.priceRange.includes(price) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePriceRange(price)}
                className="h-8 text-xs px-2"
              >
                {price}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card className="shadow-sm">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-medium">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="open-now"
              checked={filters.openNow}
              onCheckedChange={(checked) => updateFilter("openNow", !!checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="open-now" className="cursor-pointer text-sm">Open now</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-photos"
              checked={filters.hasPhotos}
              onCheckedChange={(checked) => updateFilter("hasPhotos", !!checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="has-photos" className="cursor-pointer text-sm">Has photos</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

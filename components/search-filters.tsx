"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"

interface SearchFiltersProps {
  filters: {
    category: string
    rating: number
    openNow: boolean
    distance: number
    hasPhotos: boolean
    sort: string
  }
  onFiltersChange: (filters: any) => void
}

const categories = ["Restaurants", "Services", "Shopping", "Healthcare", "Education", "Automotive", "Beauty", "Fitness"]

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort by</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.sort} onValueChange={(value) => updateFilter("sort", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => updateFilter("rating", checked ? rating : 0)}
                />
                <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span>& up</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => updateFilter("distance", value[0])}
              max={25}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">Within {filters.distance} miles</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="open-now"
              checked={filters.openNow}
              onCheckedChange={(checked) => updateFilter("openNow", checked)}
            />
            <Label htmlFor="open-now">Open now</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-photos"
              checked={filters.hasPhotos}
              onCheckedChange={(checked) => updateFilter("hasPhotos", checked)}
            />
            <Label htmlFor="has-photos">Has photos</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

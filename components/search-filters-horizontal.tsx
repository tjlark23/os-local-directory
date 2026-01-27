"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw } from "lucide-react"

// All database categories for the filter dropdown
const DB_CATEGORIES = [
  { id: "restaurants", name: "Restaurants & Dining" },
  { id: "health", name: "Health & Wellness" },
  { id: "beauty", name: "Beauty & Spa" },
  { id: "fitness", name: "Fitness & Sports" },
  { id: "automotive", name: "Automotive" },
  { id: "shopping", name: "Shopping & Retail" },
  { id: "services", name: "Professional Services" },
  { id: "education", name: "Education" },
  { id: "pets", name: "Pets & Animals" },
  { id: "financial", name: "Financial Services" },
  { id: "home", name: "Home Services" },
  { id: "entertainment", name: "Entertainment" },
]

const CITIES = ["Austin", "Cedar Park", "Georgetown", "Leander", "Liberty Hill", "Pflugerville", "Round Rock"]

const RATINGS = [
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3.5", label: "3.5+ Stars" },
  { value: "3", label: "3+ Stars" },
]

interface FiltersState {
  category: string
  city: string
  rating: number
  sort: string
}

interface SearchFiltersHorizontalProps {
  filters: FiltersState
  onFilterChange: <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => void
  onReset: () => void
  resultCount: number
  totalCount: number
  loading?: boolean
}

export function SearchFiltersHorizontal({
  filters,
  onFilterChange,
  onReset,
  resultCount,
  totalCount,
  loading = false,
}: SearchFiltersHorizontalProps) {
  const hasActiveFilters = filters.category !== "all" || filters.city !== "all" || filters.rating > 0

  return (
    <div className="bg-background border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Category Select */}
          <Select
            value={filters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {DB_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* City Select */}
          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange("city", value)}
          >
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="All Cities" />
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

          {/* Rating Select */}
          <Select
            value={filters.rating > 0 ? String(filters.rating) : "all"}
            onValueChange={(value) => onFilterChange("rating", value === "all" ? 0 : parseFloat(value))}
          >
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              {RATINGS.map((rating) => (
                <SelectItem key={rating.value} value={rating.value}>
                  {rating.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select
            value={filters.sort}
            onValueChange={(value) => onFilterChange("sort", value)}
          >
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {loading ? (
            "Loading..."
          ) : (
            <>
              Showing <span className="font-medium text-foreground">{resultCount}</span> of{" "}
              <span className="font-medium text-foreground">{totalCount}</span> businesses
            </>
          )}
        </div>
      </div>
    </div>
  )
}

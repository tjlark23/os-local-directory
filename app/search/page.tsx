"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { SearchFilters } from "@/components/search-filters"
import { SearchResults } from "@/components/search-results"
import { SearchHeader } from "@/components/search-header"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    category: "",
    rating: 0,
    openNow: false,
    distance: 5,
    hasPhotos: false,
    sort: "relevance",
  })

  const query = searchParams.get("q") || ""
  const location = searchParams.get("location") || ""

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader query={query} location={location} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <SearchResults query={query} location={location} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  )
}

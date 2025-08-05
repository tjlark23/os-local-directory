"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchHeaderProps {
  query: string
  location: string
}

export function SearchHeader({ query: initialQuery, location: initialLocation }: SearchHeaderProps) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location) params.set("location", location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="md:col-span-5 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="City, neighborhood, or zip"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12 h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="md:col-span-2">
              <Button onClick={handleSearch} className="w-full h-12">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

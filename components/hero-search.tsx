"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Filter } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location) params.set("location", location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Location Input */}
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="City, neighborhood, or zip"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 h-12 text-lg"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Filters */}
          <div className="md:col-span-2">
            <Select>
              <SelectTrigger className="h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open-now">Open now</SelectItem>
                <SelectItem value="top-rated">Top rated</SelectItem>
                <SelectItem value="nearby">Nearby</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1">
            <Button onClick={handleSearch} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

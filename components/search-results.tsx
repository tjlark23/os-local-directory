"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Heart, Phone, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - in real app, this would come from API
const mockBusinesses = [
  {
    id: "1",
    name: "Artisan Coffee Roasters",
    category: "Coffee Shop",
    rating: 4.8,
    reviewCount: 127,
    image: "/placeholder.svg?height=150&width=200",
    address: "123 Main St",
    distance: "0.2 mi",
    isOpen: true,
    phone: "(555) 123-4567",
    website: "https://artisancoffee.com",
    description: "Locally roasted coffee with a cozy atmosphere perfect for work or relaxation.",
    tags: ["WiFi", "Pet Friendly", "Outdoor Seating"],
  },
  {
    id: "2",
    name: "Green Garden Bistro",
    category: "Restaurant",
    rating: 4.6,
    reviewCount: 89,
    image: "/placeholder.svg?height=150&width=200",
    address: "456 Oak Ave",
    distance: "0.5 mi",
    isOpen: true,
    phone: "(555) 234-5678",
    website: "https://greengarden.com",
    description: "Farm-to-table dining with fresh, locally sourced ingredients.",
    tags: ["Vegetarian Options", "Outdoor Seating", "Reservations"],
  },
  {
    id: "3",
    name: "Tech Repair Pro",
    category: "Electronics Repair",
    rating: 4.9,
    reviewCount: 156,
    image: "/placeholder.svg?height=150&width=200",
    address: "789 Pine St",
    distance: "0.8 mi",
    isOpen: false,
    phone: "(555) 345-6789",
    website: "https://techrepairpro.com",
    description: "Professional electronics repair with quick turnaround times.",
    tags: ["Same Day Service", "Warranty", "Free Estimates"],
  },
]

interface SearchResultsProps {
  query: string
  location: string
  filters: any
}

export function SearchResults({ query, location, filters }: SearchResultsProps) {
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (businessId: string) => {
    setFavorites((prev) => (prev.includes(businessId) ? prev.filter((id) => id !== businessId) : [...prev, businessId]))
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {query ? `Results for "${query}"` : "All Businesses"}
            {location && ` in ${location}`}
          </h1>
          <p className="text-gray-600 mt-1">{mockBusinesses.length} businesses found</p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {mockBusinesses.map((business) => (
          <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                {/* Image */}
                <div className="md:col-span-3 relative">
                  <Image
                    src={business.image || "/placeholder.svg"}
                    alt={business.name}
                    width={200}
                    height={150}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleFavorite(business.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(business.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>

                {/* Content */}
                <div className="md:col-span-9 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/business/${business.id}`}>
                            <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">{business.name}</h3>
                          </Link>
                          <p className="text-gray-600">{business.category}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-lg">{business.rating}</span>
                          <span className="text-gray-500">({business.reviewCount})</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-3">{business.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {business.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Location & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>
                            {business.address} • {business.distance}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className={business.isOpen ? "text-green-600" : "text-red-600"}>
                            {business.isOpen ? "Open now" : "Closed"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                        <Link href={`/business/${business.id}`}>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

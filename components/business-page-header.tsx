"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Share2, MessageSquare, Building2 } from "lucide-react"

interface BusinessPageHeaderProps {
  business: {
    name: string
    category: string
    rating: number
    reviewCount: number
    priceRange: string
    featured: boolean
    claimed: boolean
    address: {
      full: string
    }
  }
}

export function BusinessPageHeader({ business }: BusinessPageHeaderProps) {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{business.name}</h1>
              {business.featured && <Badge className="bg-orange-500 hover:bg-orange-600">Featured</Badge>}
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">{business.rating}</span>
                <span className="text-gray-500">({business.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <p className="text-gray-600">{business.address.full}</p>
              <span className="text-gray-400">•</span>
              <p className="text-gray-600">{business.category}</p>
              <span className="text-gray-400">•</span>
              <p className="text-gray-600">{business.priceRange}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get Quote
            </Button>

            {!business.claimed && (
              <Button variant="outline">
                <Building2 className="w-4 h-4 mr-2" />
                Claim This Business
              </Button>
            )}

            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? "text-red-600 border-red-600" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-red-600" : ""}`} />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

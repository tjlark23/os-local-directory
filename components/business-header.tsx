"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Share2, Phone, ExternalLink, MapPin, CheckCircle } from "lucide-react"

interface BusinessHeaderProps {
  business: {
    name: string
    category: string
    rating: number
    reviewCount: number
    verified: boolean
    claimed: boolean
    address: {
      street: string
      city: string
      state: string
    }
  }
}

export function BusinessHeader({ business }: BusinessHeaderProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{business.name}</h1>
              {business.verified && <CheckCircle className="w-6 h-6 text-blue-500" />}
              {business.claimed && <Badge variant="secondary">Claimed</Badge>}
            </div>

            <p className="text-xl text-gray-600 mb-3">{business.category}</p>

            <div className="flex items-center space-x-4 mb-4">
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

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                {business.address.street}, {business.address.city}, {business.address.state}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0">
            <Button variant="outline" onClick={() => setIsFavorited(!isFavorited)} className="flex items-center">
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
              {isFavorited ? "Saved" : "Save"}
            </Button>

            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>

            <Button>
              <ExternalLink className="w-4 h-4 mr-2" />
              Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

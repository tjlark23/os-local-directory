import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredBusinesses = [
  {
    id: "bluebonnet-bbq",
    name: "Bluebonnet BBQ",
    category: "BBQ",
    rating: 4.7,
    reviewCount: 127,
    image: "/placeholder.svg?height=200&width=300&text=BBQ+Food",
    address: "123 Main St, Leander, TX 78641",
    description: "Authentic Texas barbecue with slow-smoked brisket, ribs, and all the...",
    featured: true,
  },
  {
    id: "hill-country-cafe",
    name: "Hill Country Cafe",
    category: "American",
    rating: 4.5,
    reviewCount: 76,
    image: "/placeholder.svg?height=200&width=300&text=Cafe+Interior",
    address: "789 Bell Blvd, Cedar Park, TX 78613",
    description: "Farm-to-table dining featuring locally sourced ingredients and...",
    featured: true,
  },
  {
    id: "wellness-center-leander",
    name: "Wellness Center of Leander",
    category: "Health",
    rating: 4.8,
    reviewCount: 63,
    image: "/placeholder.svg?height=200&width=300&text=Wellness+Center",
    address: "654 Wellness Way, Leander, TX 78641",
    description: "Comprehensive wellness services including massage therapy,...",
    featured: true,
  },
  {
    id: "joes-pizza",
    name: "Joe's Pizza",
    category: "Pizza",
    rating: 4.6,
    reviewCount: 94,
    image: "/placeholder.svg?height=200&width=300&text=Pizza",
    address: "890 Pizza Lane, Leander, TX 78641",
    description: "New York-style pizza made with authentic ingredients and traditiona...",
    featured: true,
  },
  {
    id: "leander-pet-clinic",
    name: "Leander Pet Clinic",
    category: "Pets",
    rating: 4.7,
    reviewCount: 89,
    image: "/placeholder.svg?height=200&width=300&text=Pet+Clinic",
    address: "456 Pet Care Lane, Leander, TX 78641",
    description: "Full-service veterinary clinic providing comprehensive care for...",
    featured: true,
  },
  {
    id: "hill-country-realty",
    name: "Hill Country Realty",
    category: "Real Estate",
    rating: 4.8,
    reviewCount: 156,
    image: "/placeholder.svg?height=200&width=300&text=Real+Estate",
    address: "789 Realty Row, Cedar Park, TX 78613",
    description: "Premier real estate agency specializing in Cedar Park and...",
    featured: true,
  },
]

export function FeaturedBusinessesLeander() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredBusinesses.map((business) => (
        <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={business.image || "/placeholder.svg"}
              alt={business.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
              <Heart className="w-4 h-4" />
            </Button>
            {business.featured && <Badge className="absolute top-2 left-2 bg-blue-600">Featured</Badge>}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <Link href={`/business/${business.id}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer">{business.name}</h3>
                </Link>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{business.rating}</span>
                    <span className="text-gray-500">({business.reviewCount})</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">{business.category}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{business.description}</p>

            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>

            <div className="mt-3 text-xs text-gray-500">{business.category}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

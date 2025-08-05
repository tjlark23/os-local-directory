import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const featuredBusinesses = [
  {
    id: "1",
    name: "Artisan Coffee Roasters",
    category: "Coffee Shop",
    rating: 4.8,
    reviewCount: 127,
    image: "/placeholder.svg?height=200&width=300",
    address: "123 Main St",
    distance: "0.2 mi",
    isOpen: true,
    featured: true,
  },
  {
    id: "2",
    name: "Green Garden Bistro",
    category: "Restaurant",
    rating: 4.6,
    reviewCount: 89,
    image: "/placeholder.svg?height=200&width=300",
    address: "456 Oak Ave",
    distance: "0.5 mi",
    isOpen: true,
    featured: true,
  },
  {
    id: "3",
    name: "Tech Repair Pro",
    category: "Electronics Repair",
    rating: 4.9,
    reviewCount: 156,
    image: "/placeholder.svg?height=200&width=300",
    address: "789 Pine St",
    distance: "0.8 mi",
    isOpen: false,
    featured: true,
  },
]

export function FeaturedBusinesses() {
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
            {business.featured && <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>}
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link href={`/business/${business.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">{business.name}</h3>
                </Link>
                <p className="text-gray-600">{business.category}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{business.rating}</span>
                <span className="text-gray-500">({business.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {business.address} • {business.distance}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span className={business.isOpen ? "text-green-600" : "text-red-600"}>
                  {business.isOpen ? "Open now" : "Closed"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

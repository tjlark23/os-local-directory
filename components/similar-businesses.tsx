import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const similarBusinesses = [
  {
    id: "2",
    name: "Bean There Coffee",
    category: "Coffee Shop",
    rating: 4.5,
    reviewCount: 89,
    image: "/placeholder.svg?height=150&width=200",
    distance: "0.3 mi",
  },
  {
    id: "3",
    name: "Morning Brew Cafe",
    category: "Coffee Shop",
    rating: 4.7,
    reviewCount: 156,
    image: "/placeholder.svg?height=150&width=200",
    distance: "0.6 mi",
  },
  {
    id: "4",
    name: "The Daily Grind",
    category: "Coffee Shop",
    rating: 4.4,
    reviewCount: 203,
    image: "/placeholder.svg?height=150&width=200",
    distance: "0.8 mi",
  },
]

interface SimilarBusinessesProps {
  currentBusinessId: string
}

export function SimilarBusinesses({ currentBusinessId }: SimilarBusinessesProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Similar Businesses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {similarBusinesses.map((business) => (
          <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={business.image || "/placeholder.svg"}
                alt={business.name}
                width={200}
                height={150}
                className="w-full h-40 object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Link href={`/business/${business.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary cursor-pointer mb-1">{business.name}</h3>
              </Link>
              <p className="text-gray-600 mb-2">{business.category}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-gray-500 text-sm">({business.reviewCount})</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{business.distance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

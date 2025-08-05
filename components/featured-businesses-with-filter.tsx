"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CategoryFilterTabs } from "@/components/category-filter-tabs"

const allBusinesses = [
  {
    id: "bluebonnet-bbq",
    name: "Bluebonnet BBQ",
    category: "BBQ",
    filterCategory: "food",
    rating: 4.7,
    reviewCount: 127,
    image: "/placeholder.svg?height=200&width=300&text=BBQ+Brisket",
    address: "123 Main St, Leander, TX 78641",
    description: "Authentic Texas barbecue with slow-smoked brisket, ribs, and all the...",
    featured: true,
    categoryTag: "Restaurants",
  },
  {
    id: "hill-country-cafe",
    name: "Hill Country Cafe",
    category: "American",
    filterCategory: "food",
    rating: 4.5,
    reviewCount: 76,
    image: "/placeholder.svg?height=200&width=300&text=Cafe+Interior",
    address: "789 Bell Blvd, Cedar Park, TX 78613",
    description: "Farm-to-table dining featuring locally sourced ingredients and...",
    featured: true,
    categoryTag: "Restaurants",
  },
  {
    id: "wellness-center-leander",
    name: "Wellness Center of Leander",
    category: "Health",
    filterCategory: "health-beauty",
    rating: 4.8,
    reviewCount: 63,
    image: "/placeholder.svg?height=200&width=300&text=Wellness+Center",
    address: "654 Wellness Way, Leander, TX 78641",
    description: "Comprehensive wellness services including massage therapy,...",
    featured: true,
    categoryTag: "Health",
  },
  {
    id: "joes-pizza",
    name: "Joe's Pizza",
    category: "Pizza",
    filterCategory: "food",
    rating: 4.6,
    reviewCount: 94,
    image: "/placeholder.svg?height=200&width=300&text=Pepperoni+Pizza",
    address: "890 Pizza Lane, Leander, TX 78641",
    description: "New York-style pizza made with authentic ingredients and traditiona...",
    featured: true,
    categoryTag: "Restaurants",
  },
  {
    id: "leander-pet-clinic",
    name: "Leander Pet Clinic",
    category: "Veterinary",
    filterCategory: "pets",
    rating: 4.7,
    reviewCount: 89,
    image: "/placeholder.svg?height=200&width=300&text=Pet+Clinic",
    address: "456 Pet Care Lane, Leander, TX 78641",
    description: "Full-service veterinary clinic providing comprehensive care for...",
    featured: true,
    categoryTag: "Pets",
  },
  {
    id: "hill-country-realty",
    name: "Hill Country Realty",
    category: "Real Estate",
    filterCategory: "real-estate",
    rating: 4.8,
    reviewCount: 156,
    image: "/placeholder.svg?height=200&width=300&text=Real+Estate+Office",
    address: "789 Realty Row, Cedar Park, TX 78613",
    description: "Premier real estate agency specializing in Cedar Park and...",
    featured: true,
    categoryTag: "Real Estate",
  },
]

export function FeaturedBusinessesWithFilter() {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredBusinesses =
    activeCategory === "all"
      ? allBusinesses
      : allBusinesses.filter((business) => business.filterCategory === activeCategory)

  return (
    <section className="bg-white">
      <CategoryFilterTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((business) => (
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
                {business.featured && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">Featured</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="mb-3">
                  <Link href={`/business/${business.id}`}>
                    <h3 className="font-semibold text-lg hover:text-blue-600 cursor-pointer mb-1">{business.name}</h3>
                  </Link>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(business.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="font-medium text-sm">{business.rating}</span>
                    <span className="text-gray-500 text-sm">({business.reviewCount})</span>
                  </div>
                  <div className="text-orange-600 text-sm font-medium mb-2">{business.category}</div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{business.description}</p>

                <div className="flex items-start text-gray-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{business.address}</span>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {business.categoryTag}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

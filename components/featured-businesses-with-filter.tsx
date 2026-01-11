"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Heart, ArrowRight } from "lucide-react"
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
    image: "/texas-bbq-brisket-smoked-meat-platter-restaurant.jpg",
    address: "123 Main St, Leander, TX 78641",
    description: "Authentic Texas barbecue with slow-smoked brisket, ribs, and all the classic sides.",
    featured: true,
    categoryTag: "Restaurants",
    priceRange: "$$",
  },
  {
    id: "hill-country-cafe",
    name: "Hill Country Cafe",
    category: "American",
    filterCategory: "food",
    rating: 4.5,
    reviewCount: 76,
    image: "/cozy-american-cafe-interior-breakfast-brunch.jpg",
    address: "789 Bell Blvd, Cedar Park, TX 78613",
    description: "Farm-to-table dining featuring locally sourced ingredients and homestyle cooking.",
    featured: true,
    categoryTag: "Restaurants",
    priceRange: "$$",
  },
  {
    id: "wellness-center-leander",
    name: "Wellness Center of Leander",
    category: "Health",
    filterCategory: "health-beauty",
    rating: 4.8,
    reviewCount: 63,
    image: "/modern-wellness-spa-massage-therapy-center.jpg",
    address: "654 Wellness Way, Leander, TX 78641",
    description: "Comprehensive wellness services including massage therapy and holistic treatments.",
    featured: true,
    categoryTag: "Health",
    priceRange: "$$$",
  },
  {
    id: "joes-pizza",
    name: "Joe's Pizza",
    category: "Pizza",
    filterCategory: "food",
    rating: 4.6,
    reviewCount: 94,
    image: "/new-york-style-pizza-pepperoni-cheese-italian.jpg",
    address: "890 Pizza Lane, Leander, TX 78641",
    description: "New York-style pizza made with authentic ingredients and traditional recipes.",
    featured: true,
    categoryTag: "Restaurants",
    priceRange: "$",
  },
  {
    id: "leander-pet-clinic",
    name: "Leander Pet Clinic",
    category: "Veterinary",
    filterCategory: "pets",
    rating: 4.7,
    reviewCount: 89,
    image: "/veterinary-clinic-cute-dog-cat-pet-care.jpg",
    address: "456 Pet Care Lane, Leander, TX 78641",
    description: "Full-service veterinary clinic providing comprehensive care for your furry friends.",
    featured: true,
    categoryTag: "Pets",
    priceRange: "$$",
  },
  {
    id: "hill-country-realty",
    name: "Hill Country Realty",
    category: "Real Estate",
    filterCategory: "real-estate",
    rating: 4.8,
    reviewCount: 156,
    image: "/texas-hill-country-home-real-estate-beautiful-hous.jpg",
    address: "789 Realty Row, Cedar Park, TX 78613",
    description: "Premier real estate agency specializing in Cedar Park and Leander properties.",
    featured: true,
    categoryTag: "Real Estate",
    priceRange: "$$$$",
  },
  {
    id: "cedar-park-fitness",
    name: "Cedar Park Fitness",
    category: "Gym",
    filterCategory: "health-beauty",
    rating: 4.6,
    reviewCount: 112,
    image: "/modern-gym-fitness-center-equipment-workout.jpg",
    address: "321 Fitness Blvd, Cedar Park, TX 78613",
    description: "State-of-the-art fitness center with personal training and group classes.",
    featured: true,
    categoryTag: "Health",
    priceRange: "$$",
  },
  {
    id: "austin-auto-repair",
    name: "Austin Auto Repair",
    category: "Auto",
    filterCategory: "auto-services",
    rating: 4.9,
    reviewCount: 203,
    image: "/professional-auto-repair-shop-mechanic-car-service.jpg",
    address: "567 Mechanic Way, Leander, TX 78641",
    description: "Honest and reliable auto repair with certified technicians you can trust.",
    featured: true,
    categoryTag: "Auto",
    priceRange: "$$",
  },
]

export function FeaturedBusinessesWithFilter() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const filteredBusinesses =
    activeCategory === "all"
      ? allBusinesses
      : allBusinesses.filter((business) => business.filterCategory === activeCategory)

  return (
    <section className="bg-background">
      <CategoryFilterTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="container mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Businesses</h2>
            <p className="text-muted-foreground">Discover top-rated local favorites</p>
          </div>
          <Link href="/search">
            <Button variant="ghost" className="group text-primary hover:text-primary/80">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((business, index) => (
            <Card
              key={business.id}
              className={`group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 animate-fade-in-up bg-card`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(business.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={business.image || "/placeholder.svg"}
                  alt={business.name}
                  width={600}
                  height={400}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Overlay on hover */}
                <div
                  className={`absolute inset-0 bg-foreground/20 transition-opacity duration-300 ${hoveredCard === business.id ? "opacity-100" : "opacity-0"}`}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 bg-card/90 hover:bg-card shadow-md hover:scale-110 transition-all duration-300"
                >
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
                {business.featured && (
                  <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                    Featured
                  </Badge>
                )}
                {/* Price range badge */}
                <Badge
                  variant="secondary"
                  className="absolute bottom-3 right-3 bg-card/90 text-card-foreground font-medium"
                >
                  {business.priceRange}
                </Badge>
              </div>
              <CardContent className="p-5">
                <div className="mb-3">
                  <Link href={`/business/${business.id}`}>
                    <h3 className="font-bold text-lg text-card-foreground hover:text-primary cursor-pointer mb-2 transition-colors">
                      {business.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(business.rating) ? "fill-amber-400 text-amber-400" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-card-foreground">{business.rating}</span>
                    <span className="text-muted-foreground text-sm">({business.reviewCount})</span>
                  </div>
                  <div className="text-primary text-sm font-semibold mb-2">{business.category}</div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{business.description}</p>

                <div className="flex items-start text-muted-foreground text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-primary" />
                  <span className="line-clamp-1">{business.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                    {business.categoryTag}
                  </Badge>
                  <Link href={`/business/${business.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group/btn p-0">
                      View Details
                      <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

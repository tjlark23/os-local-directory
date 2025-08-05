import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, Wrench, ShoppingBag, Heart, Music, Car } from "lucide-react"

const categories = [
  {
    id: "restaurants",
    name: "Restaurants",
    description: "From BBQ to fine dining",
    count: "450+ businesses",
    icon: UtensilsCrossed,
    iconColor: "bg-red-500",
    href: "/search?category=restaurants",
  },
  {
    id: "services",
    name: "Services",
    description: "Professional services you trust",
    count: "320+ businesses",
    icon: Wrench,
    iconColor: "bg-blue-500",
    href: "/search?category=services",
  },
  {
    id: "shopping",
    name: "Shopping",
    description: "Local shops and boutiques",
    count: "280+ businesses",
    icon: ShoppingBag,
    iconColor: "bg-green-500",
    href: "/search?category=shopping",
  },
  {
    id: "health",
    name: "Health",
    description: "Healthcare and wellness",
    count: "150+ businesses",
    icon: Heart,
    iconColor: "bg-pink-500",
    href: "/search?category=health",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Fun activities and venues",
    count: "90+ businesses",
    icon: Music,
    iconColor: "bg-purple-500",
    href: "/search?category=entertainment",
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Auto repair and services",
    count: "120+ businesses",
    icon: Car,
    iconColor: "bg-orange-500",
    href: "/search?category=automotive",
  },
]

export function BrowseCategoriesSection() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Browse by Category</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Find exactly what you're looking for with our organized business categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <Link key={category.id} href={category.href}>
              <Card className="bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${category.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h3>

                  <p className="text-gray-600 mb-4 text-lg">{category.description}</p>

                  <p className="text-blue-600 font-semibold text-lg">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

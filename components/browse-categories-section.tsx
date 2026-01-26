"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, Wrench, Heart, Music, Car, PawPrint, ArrowRight } from "lucide-react"

const categories = [
  {
    id: "restaurants",
    name: "Restaurants",
    description: "From BBQ to fine dining",
    count: "450+",
    icon: UtensilsCrossed,
    gradient: "from-rose-500 to-orange-400",
    href: "/search?category=restaurants",
  },
  {
    id: "services",
    name: "Services",
    description: "Professional services you trust",
    count: "320+",
    icon: Wrench,
    gradient: "from-blue-500 to-cyan-400",
    href: "/search?category=services",
  },
  {
    id: "health",
    name: "Health",
    description: "Healthcare and wellness",
    count: "150+",
    icon: Heart,
    gradient: "from-pink-500 to-rose-400",
    href: "/search?category=health",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Fun activities and venues",
    count: "90+",
    icon: Music,
    gradient: "from-violet-500 to-purple-400",
    href: "/search?category=entertainment",
  },
  {
    id: "automotive",
    name: "Automotive",
    description: "Auto repair and services",
    count: "120+",
    icon: Car,
    gradient: "from-amber-500 to-yellow-400",
    href: "/search?category=automotive",
  },
  {
    id: "pets",
    name: "Pets",
    description: "Pet care and supplies",
    count: "80+",
    icon: PawPrint,
    gradient: "from-emerald-500 to-teal-400",
    href: "/search?category=pets",
  },
]

export function BrowseCategoriesSection() {
  return (
    <section className="py-20 bg-foreground relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-background mb-4 text-balance">Browse by Category</h2>
          <p className="text-xl text-background/70 max-w-2xl mx-auto">
            Find exactly what you're looking for with our organized business categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link key={category.id} href={category.href}>
              <Card
                className="group bg-card/10 backdrop-blur-sm border-background/10 hover:bg-card/20 transition-all duration-500 cursor-pointer h-full hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <category.icon className="w-8 h-8 text-background" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-6 h-6 text-background/60" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-background mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-background/60 mb-4 text-lg">{category.description}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{category.count}</span>
                    <span className="text-background/50 text-sm">businesses</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

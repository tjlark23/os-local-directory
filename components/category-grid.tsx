import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, ShoppingBag, Scissors, Music, Car, Home, Heart, Building, Search } from "lucide-react"

const categories = [
  { name: "All", icon: Search, count: 450, href: "/search" },
  { name: "Food", icon: UtensilsCrossed, count: 89, href: "/search?category=food" },
  { name: "Shopping", icon: ShoppingBag, count: 67, href: "/search?category=shopping" },
  { name: "Health & Beauty", icon: Scissors, count: 45, href: "/search?category=health-beauty" },
  { name: "Entertainment", icon: Music, count: 34, href: "/search?category=entertainment" },
  { name: "Auto Services", icon: Car, count: 56, href: "/search?category=auto-services" },
  { name: "Home & Garden", icon: Home, count: 78, href: "/search?category=home-garden" },
  { name: "Pets", icon: Heart, count: 23, href: "/search?category=pets" },
  { name: "Real Estate", icon: Building, count: 12, href: "/search?category=real-estate" },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.name} href={category.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <category.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-gray-500">{category.count} businesses</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

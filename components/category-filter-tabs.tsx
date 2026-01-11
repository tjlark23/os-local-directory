"use client"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, ShoppingBag, Sparkles, Music, Car, Home, PawPrint, Building2, LayoutGrid } from "lucide-react"

const categories = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "food", name: "Food", icon: UtensilsCrossed },
  { id: "shopping", name: "Shopping", icon: ShoppingBag },
  { id: "health-beauty", name: "Health & Beauty", icon: Sparkles },
  { id: "entertainment", name: "Entertainment", icon: Music },
  { id: "auto-services", name: "Auto Services", icon: Car },
  { id: "home-garden", name: "Home & Garden", icon: Home },
  { id: "pets", name: "Pets", icon: PawPrint },
  { id: "real-estate", name: "Real Estate", icon: Building2 },
]

interface CategoryFilterTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilterTabs({ activeCategory, onCategoryChange }: CategoryFilterTabsProps) {
  return (
    <div className="bg-card border-b border-border sticky top-28 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                className={`whitespace-nowrap px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"
import { Button } from "@/components/ui/button"
import {
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
  Music,
  Car,
  Wrench,
  PawPrint,
  Building2,
  LayoutGrid,
  Briefcase,
} from "lucide-react"
import type { FilterCategory } from "@/lib/types"

const categories = [
  { id: "all" as const, name: "All", icon: LayoutGrid },
  { id: "food" as const, name: "Food & Dining", icon: UtensilsCrossed },
  { id: "health-beauty" as const, name: "Health & Beauty", icon: Sparkles },
  { id: "auto-services" as const, name: "Auto", icon: Car },
  { id: "shopping" as const, name: "Shopping", icon: ShoppingBag },
  { id: "entertainment" as const, name: "Entertainment", icon: Music },
  { id: "pets" as const, name: "Pets", icon: PawPrint },
  { id: "real-estate" as const, name: "Real Estate", icon: Building2 },
  { id: "home-services" as const, name: "Home Services", icon: Wrench },
  { id: "services" as const, name: "Professional", icon: Briefcase },
]

interface CategoryFilterTabsProps {
  activeCategory: FilterCategory | "all"
  onCategoryChange: (category: FilterCategory | "all") => void
}

export function CategoryFilterTabs({ activeCategory, onCategoryChange }: CategoryFilterTabsProps) {
  return (
    <div className="bg-card border-b border-border sticky top-16 md:top-20 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 sm:gap-2 py-3 sm:py-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`whitespace-nowrap px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{category.name}</span>
                <span className="xs:hidden sm:hidden">{category.name.split(" ")[0]}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", name: "All" },
  { id: "food", name: "Food" },
  { id: "shopping", name: "Shopping" },
  { id: "health-beauty", name: "Health & Beauty" },
  { id: "entertainment", name: "Entertainment" },
  { id: "auto-services", name: "Auto Services" },
  { id: "home-garden", name: "Home & Garden" },
  { id: "pets", name: "Pets" },
  { id: "real-estate", name: "Real Estate" },
]

interface CategoryFilterTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilterTabs({ activeCategory, onCategoryChange }: CategoryFilterTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 py-4 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { BusinessCardVertical } from "@/components/business-card-vertical"

// Category display names (plural for section headings)
const CATEGORY_DISPLAY_NAMES_PLURAL: Record<string, string> = {
  restaurants: "Restaurants",
  health: "Health & Wellness Providers",
  beauty: "Beauty & Spa Businesses",
  fitness: "Fitness Centers",
  automotive: "Auto Services",
  shopping: "Shops",
  services: "Service Providers",
  education: "Schools",
  pets: "Pet Services",
  financial: "Financial Services",
  home: "Home Services",
  entertainment: "Entertainment Venues",
}

interface SimilarBusinessesSectionProps {
  businesses: Array<{
    id: string
    slug?: string
    name: string
    description?: string
    category: string
    image?: string
    address?: { city?: string; state?: string }
    address_city?: string
    address_state?: string
    rating: number
    reviewCount?: number
    review_count?: number
    isFeatured?: boolean
    is_featured?: boolean
  }>
  category: string
}

export function SimilarBusinessesSection({ businesses, category }: SimilarBusinessesSectionProps) {
  const displayCategory = CATEGORY_DISPLAY_NAMES_PLURAL[category] || `${category} Businesses`

  // Take up to 8 businesses
  const displayBusinesses = businesses.slice(0, 8)

  return (
    <section className="bg-muted/50 py-12 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Similar {displayCategory} Nearby
          </h2>
          <Link
            href={`/categories/${category}-leander-tx`}
            className="text-primary hover:underline font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayBusinesses.map((business) => (
            <BusinessCardVertical
              key={business.id}
              business={{
                id: business.id,
                slug: business.slug || business.id,
                name: business.name,
                description: business.description || '',
                category: business.category,
                image: business.image || '',
                address_city: business.address_city || business.address?.city || '',
                address_state: business.address_state || business.address?.state || 'TX',
                rating: business.rating,
                review_count: business.review_count || business.reviewCount || 0,
                is_featured: business.is_featured || business.isFeatured || false,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

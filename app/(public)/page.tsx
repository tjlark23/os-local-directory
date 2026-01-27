import { HeroTagline } from "@/components/hero-tagline"
import HeroCarousel from "@/components/hero-carousel"
import { FeaturedBusinessesWithFilter } from "@/components/featured-businesses-with-filter"
import { BrowseCategoriesSection } from "@/components/browse-categories-section"
import { BusinessCTASection, DiscoverCTASection } from "@/components/business-cta-section"
import { supabase } from "@/lib/supabase"

export default async function HomePage() {
  // Fetch businesses from Supabase for the hero carousel
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  let businesses: any[] = []

  if (location) {
    const { data } = await supabase
      .from('businesses')
      .select('id, name, slug, category, address_city, image, rating, review_count, description, is_featured')
      .eq('location_id', location.id)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(10)

    if (data) {
      // Map the data to match the expected interface
      businesses = data.map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        category: b.category,
        city: b.address_city,
        image: b.image || '/placeholder-business.jpg',
        rating: Number(b.rating) || 0,
        review_count: b.review_count || 0,
        description: b.description,
        is_featured: b.is_featured
      }))
    }
  }

  return (
    <div className="min-h-screen">
      <HeroTagline />

      {/* Hero Section */}
      <HeroCarousel businesses={businesses} />

      {/* Featured Businesses with Category Filter */}
      <FeaturedBusinessesWithFilter />

      {/* Browse by Category */}
      <BrowseCategoriesSection />

      {/* Business Owner CTA */}
      <BusinessCTASection />

      {/* Discover CTA */}
      <DiscoverCTASection />
    </div>
  )
}

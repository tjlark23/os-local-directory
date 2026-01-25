import { HeroTagline } from "@/components/hero-tagline"
import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturedBusinessesWithFilter } from "@/components/featured-businesses-with-filter"
import { BrowseCategoriesSection } from "@/components/browse-categories-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BusinessCTASection, DiscoverCTASection } from "@/components/business-cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroTagline />

      {/* Hero Section */}
      <HeroCarousel />

      {/* Featured Businesses with Category Filter */}
      <FeaturedBusinessesWithFilter />

      {/* Browse by Category */}
      <BrowseCategoriesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Business Owner CTA */}
      <BusinessCTASection />

      {/* Discover CTA */}
      <DiscoverCTASection />
    </div>
  )
}

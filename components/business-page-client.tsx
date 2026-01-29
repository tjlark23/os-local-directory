"use client"

import { useState } from "react"
import { BusinessPageHeader } from "@/components/business-page-header"
import { BusinessPageContent } from "@/components/business-page-content"
import { BusinessSidebar } from "@/components/business-sidebar"
import { FeaturedBanner } from "@/components/featured-banner"
import { UpgradeCTA } from "@/components/upgrade-cta"
import { SimilarBusinessesSection } from "@/components/similar-businesses-section"
import { PremiumContentSections } from "@/components/premium-content-sections"
import { ReviewsSection } from "@/components/reviews-section"
import { ContactModal } from "@/components/contact-modal"

interface BusinessPageClientProps {
  business: any
  similarBusinesses: any[]
}

export function BusinessPageClient({ business, similarBusinesses }: BusinessPageClientProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Defensive check - should never happen but prevents client crash
  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Business not found</p>
      </div>
    )
  }

  const handleContactClick = () => {
    setIsContactModalOpen(true)
  }

  const isPremium = business.listingTier === 'premium' || business.listingTier === 'featured'

  return (
    <div className="min-h-screen bg-muted/30">
      <BusinessPageHeader business={business} onContactClick={handleContactClick} />

      {/* Featured Business Banner - only for featured tier */}
      <FeaturedBanner
        listingTier={business.listingTier}
        dealsBanner={business.dealsBanner}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Photos & About Section */}
            <BusinessPageContent business={business} />

            {/* Premium: Why Choose Us (featured only) */}
            {isPremium && (
              <PremiumContentSections business={business} section="why-choose-us" />
            )}

            {/* Reviews Section */}
            <ReviewsSection
              businessId={business.uuid}
              businessName={business.name}
              totalReviews={business.reviewCount || 0}
              averageRating={business.rating || 0}
            />

            {/* Premium: Services & FAQ (featured only) */}
            {isPremium && (
              <>
                <PremiumContentSections business={business} section="services" />
                <PremiumContentSections business={business} section="faq" />
                <PremiumContentSections business={business} section="local" />
              </>
            )}

            {/* Upgrade CTA - shown for free listings only */}
            {business.listingTier === 'free' && (
              <UpgradeCTA
                businessName={business.name}
                businessId={business.id}
                listingTier={business.listingTier}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BusinessSidebar business={business} />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Businesses - Full Width Section at Bottom */}
      {similarBusinesses && similarBusinesses.length > 0 && (
        <SimilarBusinessesSection
          businesses={similarBusinesses}
          category={business.category}
        />
      )}

      {/* Contact Modal */}
      <ContactModal
        businessName={business.name}
        businessId={business.id}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  )
}

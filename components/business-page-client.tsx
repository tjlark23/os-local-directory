"use client"

import { useState, useRef } from "react"
import { BusinessPageHeader } from "@/components/business-page-header"
import { BusinessPageContent } from "@/components/business-page-content"
import { BusinessSidebar } from "@/components/business-sidebar"
import { FeaturedBanner } from "@/components/featured-banner"
import { UpgradeCTA } from "@/components/upgrade-cta"
import { SimilarBusinessesSection } from "@/components/similar-businesses-section"
import { PremiumContentSections } from "@/components/premium-content-sections"

interface BusinessPageClientProps {
  business: any
  similarBusinesses: any[]
}

export function BusinessPageClient({ business, similarBusinesses }: BusinessPageClientProps) {
  const [showContactForm, setShowContactForm] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleContactClick = () => {
    // Scroll to sidebar where contact form is
    if (sidebarRef.current) {
      sidebarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setShowContactForm(true)
  }

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
            <BusinessPageContent business={business} />

            {/* Premium Content Sections - only for paid businesses */}
            <PremiumContentSections business={business} />

            {/* Upgrade CTA - shown for free/premium listings */}
            <UpgradeCTA
              businessName={business.name}
              businessId={business.id}
              listingTier={business.listingTier}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1" ref={sidebarRef}>
            <div className="sticky top-24 space-y-6">
              <BusinessSidebar business={business} autoOpenContact={showContactForm} />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Businesses - Full Width Section at Bottom */}
      {similarBusinesses.length > 0 && (
        <SimilarBusinessesSection
          businesses={similarBusinesses}
          category={business.category}
        />
      )}
    </div>
  )
}

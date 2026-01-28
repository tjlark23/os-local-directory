"use client"

import { Sparkles } from "lucide-react"

interface FeaturedBannerProps {
  listingTier: string
  dealsBanner?: string
}

export function FeaturedBanner({ listingTier, dealsBanner }: FeaturedBannerProps) {
  // Only show for featured businesses
  if (listingTier !== "featured") {
    return null
  }

  // If no deals banner is set, show a default premium badge
  if (!dealsBanner) {
    return (
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-white font-medium">
            <Sparkles className="w-5 h-5" />
            <span>Featured Business</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    )
  }

  // Show the custom deals banner
  return (
    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-4 animate-pulse-slow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 text-white">
          <span className="text-2xl">🎉</span>
          <span className="text-lg md:text-xl font-bold tracking-wide">
            {dealsBanner}
          </span>
          <span className="text-2xl">🎉</span>
        </div>
      </div>
    </div>
  )
}

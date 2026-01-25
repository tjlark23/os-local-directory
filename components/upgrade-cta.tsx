"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, TrendingUp, Crown } from "lucide-react"
import Link from "next/link"

interface UpgradeCTAProps {
  businessName: string
  businessId: string
  listingTier?: 'free' | 'premium' | 'featured'
}

export function UpgradeCTA({ businessName, businessId, listingTier = 'free' }: UpgradeCTAProps) {
  // Don't show for featured listings (already upgraded)
  if (listingTier === 'featured') return null

  return (
    <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-muted/50 to-muted/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Are you the owner?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Get a Featured Listing for {businessName} and reach more customers with premium placement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Priority placement</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>5x more visibility</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button asChild size="lg" className="group">
              <Link href={`/upgrade?business=${businessId}`}>
                Upgrade for $49/mo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MessageSquare } from "lucide-react"

interface ReviewsPlaceholderProps {
  businessName: string
}

export function ReviewsPlaceholder({ businessName }: ReviewsPlaceholderProps) {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <MessageSquare className="w-5 h-5 mr-2 text-primary" />
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 text-muted-foreground/30" />
            ))}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Reviews Coming Soon
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working on importing verified reviews for {businessName}.
            Check back soon to see what customers are saying!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

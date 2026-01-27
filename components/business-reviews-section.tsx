"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp } from "lucide-react"

const mockReviews = [
  {
    id: "1",
    user: {
      name: "John S.",
    },
    rating: 5,
    date: "2023-12-26",
    content:
      "Great BBQ! The brisket was tender and flavorful. The sides were delicious, especially the mac and cheese. The staff was friendly and attentive. Highly recommend!",
    helpful: 1,
  },
  {
    id: "2",
    user: {
      name: "Michael B.",
    },
    rating: 5,
    date: "2023-12-23",
    content:
      "The BBQ was amazing! The brisket was tender and juicy, and the ribs were fall-off-the-bone delicious. The sides were also great, especially the mac and cheese and the coleslaw. The service was friendly and attentive. I highly recommend this place to anyone looking for some great BBQ!",
    helpful: 1,
  },
  {
    id: "3",
    user: {
      name: "Michelle S.",
    },
    rating: 5,
    date: "2023-12-25",
    content:
      "This is what Texas BBQ should be! The smoke ring on the brisket was perfect, and you can taste the oak wood. The dry rub on the ribs was phenomenal. Even the pickles and onions were fresh. A true pit master runs this place.",
    helpful: 22,
  },
  {
    id: "4",
    user: {
      name: "James P.",
    },
    rating: 4,
    date: "2023-12-20",
    content:
      "Outstanding BBQ experience! The turkey was surprisingly moist and flavorful. Love that they offer different sauce options. The peach cobbler for dessert was the perfect ending to our meal. Highly recommend for anyone visiting Leander!",
    helpful: 9,
  },
  {
    id: "5",
    user: {
      name: "Sarah M.",
    },
    rating: 4,
    date: "2023-12-18",
    content:
      "Excellent BBQ with generous portions. The combo platter is perfect for sharing. The staff is knowledgeable about their meats and happy to make recommendations. Parking can be challenging during peak hours, but it's worth the effort.",
    helpful: 5,
  },
]

interface BusinessReviewsSectionProps {
  business: {
    name: string
  }
}

export function BusinessReviewsSection({ business }: BusinessReviewsSectionProps) {
  const [visibleReviews, setVisibleReviews] = useState(3)

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => Math.min(prev + 2, mockReviews.length))
  }

  return (
    <div className="mt-8">
      {/* Simple text heading - no red background */}
      <h3 className="text-xl font-semibold text-foreground mb-6">Customer Reviews</h3>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="space-y-6">
            {mockReviews.slice(0, visibleReviews).map((review) => (
              <div key={review.id} className="border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                {/* Name and date on same line */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-foreground">{review.user.name}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>

                {/* Star rating */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-muted-foreground mb-3 leading-relaxed">{review.content}</p>

                {/* Helpful button */}
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            ))}

            {visibleReviews < mockReviews.length && (
              <div className="text-center pt-2">
                <Button onClick={loadMoreReviews} variant="outline" className="bg-transparent">
                  Load More Reviews
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

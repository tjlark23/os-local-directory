"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, Flag } from "lucide-react"

const mockReviews = [
  {
    id: "1",
    user: {
      name: "John S.",
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "J",
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
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "M",
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
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "M",
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
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "J",
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
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "S",
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockReviews.slice(0, visibleReviews).map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.initial}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-3">{review.content}</p>

                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {visibleReviews < mockReviews.length && (
            <div className="text-center">
              <Button onClick={loadMoreReviews} variant="outline">
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

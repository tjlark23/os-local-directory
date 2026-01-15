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
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      reviewCount: 23,
    },
    rating: 5,
    date: "2 days ago",
    content:
      "Amazing coffee and friendly staff! The atmosphere is perfect for working or catching up with friends. Their house blend is exceptional and the pastries are always fresh.",
    helpful: 12,
    photos: ["/placeholder.svg?height=100&width=100"],
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      reviewCount: 45,
    },
    rating: 4,
    date: "1 week ago",
    content:
      "Great coffee shop with a cozy vibe. The WiFi is reliable and there are plenty of outlets for laptops. Only downside is it can get quite busy during peak hours.",
    helpful: 8,
    photos: [],
  },
  {
    id: "3",
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      reviewCount: 12,
    },
    rating: 5,
    date: "2 weeks ago",
    content:
      "Best coffee in the neighborhood! The baristas really know their craft and the latte art is beautiful. Highly recommend the seasonal drinks.",
    helpful: 15,
    photos: [],
  },
]

interface BusinessReviewsProps {
  businessId: string
}

export function BusinessReviews({ businessId }: BusinessReviewsProps) {
  const [filter, setFilter] = useState("all")

  const averageRating = 4.8
  const totalReviews = 127

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Reviews</CardTitle>
        </div>

        {/* Rating Summary */}
        <div className="flex items-center space-x-6 pt-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{averageRating}</div>
            <div className="flex items-center justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">{totalReviews} reviews</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2 mb-1">
                <span className="text-sm w-3">{rating}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">
                  {rating === 5 ? 76 : rating === 4 ? 32 : rating === 3 ? 13 : rating === 2 ? 4 : 2}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All Reviews
          </Button>
          <Button variant={filter === "recent" ? "default" : "outline"} size="sm" onClick={() => setFilter("recent")}>
            Most Recent
          </Button>
          <Button variant={filter === "helpful" ? "default" : "outline"} size="sm" onClick={() => setFilter("helpful")}>
            Most Helpful
          </Button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <p className="text-sm text-gray-500">
                        {review.user.reviewCount} reviews • {review.date}
                      </p>
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

                  {review.photos.length > 0 && (
                    <div className="flex space-x-2 mb-3">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo || "/placeholder.svg"}
                          alt="Review photo"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

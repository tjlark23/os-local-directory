"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MessageSquare, ChevronDown, User } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client for client-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Review {
  id: string
  author_name: string | null
  author_image: string | null
  rating: number
  text: string
  review_date: string | null
  likes: number
}

interface ReviewsSectionProps {
  businessId: string
  businessName: string
  totalReviews: number
  averageRating: number
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

function RatingBreakdown({
  reviews,
  totalReviews,
  averageRating
}: {
  reviews: Review[]
  totalReviews: number
  averageRating: number
}) {
  // Calculate breakdown from actual reviews if available, otherwise estimate
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  if (reviews.length > 0) {
    reviews.forEach(r => {
      const rating = Math.min(5, Math.max(1, Math.round(r.rating)))
      breakdown[rating as keyof typeof breakdown]++
    })
  }

  // If we have reviews, use actual counts, otherwise estimate from average
  const hasActualData = reviews.length > 0
  const displayTotal = hasActualData ? reviews.length : totalReviews

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 bg-muted/50 rounded-lg mb-6">
      {/* Overall Rating */}
      <div className="flex flex-col items-center justify-center min-w-[120px]">
        <span className="text-4xl font-bold text-foreground">
          {averageRating.toFixed(1)}
        </span>
        <StarRating rating={Math.round(averageRating)} size="md" />
        <span className="text-sm text-muted-foreground mt-1">
          {totalReviews.toLocaleString()} reviews
        </span>
      </div>

      {/* Breakdown Bars */}
      {hasActualData && (
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star as keyof typeof breakdown]
            const percentage = displayTotal > 0 ? (count / displayTotal) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-3 text-muted-foreground">{star}</span>
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const formattedDate = review.review_date
    ? new Date(review.review_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null

  return (
    <div className="border-b border-border/50 last:border-0 pb-5 last:pb-0">
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {review.author_image ? (
            <img
              src={review.author_image}
              alt={review.author_name || "Reviewer"}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${review.author_image ? 'hidden' : ''}`}>
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
            <span className="font-medium text-foreground">
              {review.author_name || "Anonymous"}
            </span>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              {formattedDate && (
                <span className="text-xs text-muted-foreground">
                  {formattedDate}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed">
            {review.text}
          </p>

          {review.likes > 0 && (
            <span className="text-xs text-muted-foreground mt-2 inline-block">
              {review.likes} {review.likes === 1 ? "person" : "people"} found this helpful
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ReviewsSection({
  businessId,
  businessName,
  totalReviews,
  averageRating
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const REVIEWS_PER_PAGE = 5

  useEffect(() => {
    loadReviews()
  }, [businessId])

  async function loadReviews(loadMore = false) {
    if (loadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const offset = loadMore ? (page + 1) * REVIEWS_PER_PAGE : 0

      const { data, error } = await supabase
        .from("reviews")
        .select("id, author_name, author_image, rating, text, review_date, likes")
        .eq("business_id", businessId)
        .order("review_date", { ascending: false, nullsFirst: false })
        .range(offset, offset + REVIEWS_PER_PAGE - 1)

      if (error) {
        console.error("Error loading reviews:", error)
        return
      }

      if (loadMore) {
        setReviews((prev) => [...prev, ...(data || [])])
        setPage((p) => p + 1)
      } else {
        setReviews(data || [])
      }

      setHasMore((data?.length || 0) === REVIEWS_PER_PAGE)
    } catch (err) {
      console.error("Error loading reviews:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Show placeholder if no reviews exist
  if (!loading && reviews.length === 0 && totalReviews === 0) {
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
              No Reviews Yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share your experience with {businessName}!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <MessageSquare className="w-5 h-5 mr-2 text-primary" />
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Rating Breakdown */}
        <RatingBreakdown
          reviews={reviews}
          totalReviews={totalReviews}
          averageRating={averageRating}
        />

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-5">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Reviews are being loaded. Check back soon!
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && reviews.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => loadReviews(true)}
              disabled={loadingMore}
              className="gap-2"
            >
              {loadingMore ? (
                <>Loading...</>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Load More Reviews
                </>
              )}
            </Button>
          </div>
        )}

        {/* Total Reviews Note */}
        {!hasMore && reviews.length > 0 && totalReviews > reviews.length && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Showing {reviews.length} of {totalReviews.toLocaleString()} reviews
          </p>
        )}
      </CardContent>
    </Card>
  )
}

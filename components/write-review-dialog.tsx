"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface WriteReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  businessId: string
}

export function WriteReviewDialog({ open, onOpenChange, businessId }: WriteReviewDialogProps) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = () => {
    // In real app, this would submit to API
    console.log("Submitting review:", { businessId, rating, review })
    onOpenChange(false)
    setRating(0)
    setReview("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              placeholder="Share your experience with others..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={rating === 0 || review.trim().length < 10}>
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

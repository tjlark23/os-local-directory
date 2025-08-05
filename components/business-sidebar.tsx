import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, ExternalLink, Clock, MessageSquare } from "lucide-react"

interface BusinessSidebarProps {
  business: {
    quickStats: {
      overallRating: number
      totalReviews: number
      responseRate: string
      avgResponseTime: string
    }
    ratingBreakdown: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
    address: {
      full: string
    }
    phone: string
    website: string
    hours: Record<string, { open: string; close: string; isOpen: boolean }>
    currentlyOpen: boolean
    amenities: Array<{ name: string; icon: string }>
  }
}

export function BusinessSidebar({ business }: BusinessSidebarProps) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="space-y-6">
      {/* Customer Reviews Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Overall Rating</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{business.quickStats.overallRating}/5</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Total Reviews</span>
                <span>{business.quickStats.totalReviews}</span>
              </div>
              <div className="flex justify-between">
                <span>Response Rate</span>
                <span>{business.quickStats.responseRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Response Time</span>
                <span>{business.quickStats.avgResponseTime}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold">{business.quickStats.overallRating}</span>
              <div className="text-right">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(business.quickStats.overallRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{business.quickStats.totalReviews} total reviews</p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="w-3">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${(business.ratingBreakdown[rating as keyof typeof business.ratingBreakdown] / business.quickStats.totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-4 text-right">
                    {business.ratingBreakdown[rating as keyof typeof business.ratingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">Write a Review</Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600">{business.address.full}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-600">{business.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ExternalLink className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Website</p>
              <a href={business.website} className="text-blue-600 hover:underline">
                Visit Website
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Hours
          </CardTitle>
          <div className="text-sm">
            <Badge
              variant={business.currentlyOpen ? "default" : "secondary"}
              className={business.currentlyOpen ? "bg-green-600" : ""}
            >
              {business.currentlyOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {days.map((day, index) => (
              <div key={day} className="flex justify-between items-center text-sm">
                <span className="font-medium">{dayNames[index]}</span>
                <span className="text-gray-600">
                  {business.hours[day].open} - {business.hours[day].close}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Hours may vary on holidays. Call ahead to confirm.</p>
        </CardContent>
      </Card>

      {/* Amenities & Features */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {business.amenities.map((amenity) => (
              <div key={amenity.name} className="flex items-center space-x-3">
                <span className="text-lg">{amenity.icon}</span>
                <span className="text-sm">{amenity.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Map */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive Map</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

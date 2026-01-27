import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Phone, ExternalLink, Clock, MessageSquare, Navigation } from "lucide-react"

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
      street: string
      city: string
      state: string
      zip: string
    }
    latitude?: number
    longitude?: number
    phone: string
    website: string
    hours: Record<string, { open: string; close: string; isOpen: boolean }>
    currentlyOpen: boolean
    amenities: Array<{ name: string; icon: string }>
  }
}

export function BusinessSidebar({ business }: BusinessSidebarProps) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

  // Build Google Maps embed URL
  const getMapEmbedUrl = () => {
    // Use coordinates if available, otherwise use address
    if (business.latitude && business.longitude) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${business.longitude}!3d${business.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sus!4v1234567890`
    }
    // Fallback to address-based search
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(business.address.full)}`
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="w-5 h-5 mr-2 text-primary" />
            Rating Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {/* Big rating display */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
            <div className="text-4xl font-bold text-foreground">{business.quickStats.overallRating}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(business.quickStats.overallRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{business.quickStats.totalReviews} reviews</p>
            </div>
          </div>

          {/* Rating Breakdown with better bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = business.ratingBreakdown[rating as keyof typeof business.ratingBreakdown]
              const percentage = business.quickStats.totalReviews > 0
                ? (count / business.quickStats.totalReviews) * 100
                : 0
              return (
                <div key={rating} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-muted-foreground">{rating} ★</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(business.address.full)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Address</p>
              <p className="text-sm text-muted-foreground">{business.address.full}</p>
            </div>
          </a>

          <a
            href={`tel:${business.phone}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Phone</p>
              <p className="text-sm text-muted-foreground">{business.phone}</p>
            </div>
          </a>

          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Website</p>
              <p className="text-sm text-primary hover:underline">Visit Website</p>
            </div>
          </a>

          <Button variant="outline" className="w-full bg-transparent" asChild>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Hours
            </CardTitle>
            <Badge className={business.currentlyOpen ? "bg-green-600" : "bg-muted text-muted-foreground"}>
              {business.currentlyOpen ? "Open Now" : "Closed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {days.map((day, index) => {
              const isToday = day === today
              const dayHours = business.hours?.[day]
              const hasValidHours = dayHours && dayHours.open && dayHours.close && dayHours.open !== 'undefined' && dayHours.close !== 'undefined'
              const isOpen = dayHours?.isOpen !== false
              return (
                <div
                  key={day}
                  className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${
                    isToday ? "bg-primary/10 font-medium" : ""
                  }`}
                >
                  <span className={isToday ? "text-primary" : "text-foreground"}>{dayNames[index]}</span>
                  <span className={isToday ? "text-primary" : "text-muted-foreground"}>
                    {!hasValidHours
                      ? "Hours not available"
                      : isOpen
                        ? `${dayHours.open} - ${dayHours.close}`
                        : "Closed"}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AMENITIES SECTION REMOVED - data quality issues */}

      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address text */}
          <p className="text-sm text-muted-foreground">
            {business.address.full}
          </p>

          {/* Interactive Google Maps embed */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address.full)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing ${business.address.full}`}
            />
          </div>

          <Button variant="outline" className="w-full bg-transparent" asChild>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Open in Google Maps
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

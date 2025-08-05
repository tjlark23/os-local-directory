import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, ExternalLink, Clock, DollarSign } from "lucide-react"

interface BusinessInfoProps {
  business: {
    address: {
      street: string
      city: string
      state: string
      zip: string
      lat: number
      lng: number
    }
    phone: string
    website: string
    hours: Record<string, { open: string; close: string }>
    description: string
    tags: string[]
    priceRange: string
  }
}

export function BusinessInfo({ business }: BusinessInfoProps) {
  const currentDay = new Date().toLocaleLowerCase().slice(0, 3)
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600">
                {business.address.street}
                <br />
                {business.address.city}, {business.address.state} {business.address.zip}
              </p>
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
              <a href={business.website} className="text-primary hover:underline">
                Visit Website
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Price Range</p>
              <p className="text-gray-600">{business.priceRange}</p>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {days.map((day, index) => (
              <div key={day} className="flex justify-between items-center">
                <span className={`font-medium ${day === currentDay ? "text-primary" : "text-gray-600"}`}>
                  {dayNames[index]}
                </span>
                <span className="text-gray-600">
                  {business.hours[day].open} - {business.hours[day].close}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{business.description}</p>

          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-600">AMENITIES & FEATURES</p>
            <div className="flex flex-wrap gap-2">
              {business.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
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

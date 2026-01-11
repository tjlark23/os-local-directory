import { BusinessPageHeader } from "@/components/business-page-header"
import { BusinessPageContent } from "@/components/business-page-content"
import { BusinessSidebar } from "@/components/business-sidebar"
import { BusinessReviewsSection } from "@/components/business-reviews-section"

// Complete business data for all businesses
const getBusinessData = (id: string) => {
  const businesses = {
    "bluebonnet-bbq": {
      id: "bluebonnet-bbq",
      name: "Bluebonnet BBQ",
      category: "Restaurants",
      rating: 4.6,
      reviewCount: 10,
      priceRange: "$$",
      featured: true,
      claimed: false,
      address: {
        street: "123 Main St",
        city: "Leander",
        state: "TX",
        zip: "78641",
        full: "123 Main St, Leander, TX 78641",
      },
      phone: "(512) 555-1234",
      website: "https://bluebonnetbbq.com",
      hours: {
        monday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        tuesday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        wednesday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        thursday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        friday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        saturday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        sunday: { open: "11:00 AM", close: "6:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "Authentic Texas barbecue with slow-smoked brisket, ribs, and all the fixings. Family-owned since 1995, we pride ourselves on traditional smoking methods and homemade sides. Our pit master has over 25 years of experience and uses only the finest cuts of meat, smoked low and slow over oak wood for that perfect Texas flavor.",
      specialties: ["Brisket", "Ribs", "Pulled Pork", "Sausage", "Mac & Cheese"],
      amenities: [
        { name: "Outdoor Seating", icon: "🪑" },
        { name: "Takeout", icon: "🥡" },
        { name: "Catering", icon: "🍽️" },
        { name: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
        { name: "Parking", icon: "🅿️" },
        { name: "WiFi", icon: "📶" },
      ],
      photos: [
        "/smoked-brisket-bbq-texas-meat-platter-rustic.jpg",
        "/bbq-restaurant-interior-rustic-wooden-tables.jpg",
        "/baby-back-ribs-bbq-sauce-delicious.jpg",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      quickStats: {
        overallRating: 4.6,
        totalReviews: 10,
        responseRate: "95%",
        avgResponseTime: "2 hours",
      },
      ratingBreakdown: {
        5: 6,
        4: 4,
        3: 0,
        2: 0,
        1: 0,
      },
    },
    "hill-country-cafe": {
      id: "hill-country-cafe",
      name: "Hill Country Cafe",
      category: "Restaurants",
      rating: 4.5,
      reviewCount: 76,
      priceRange: "$$$",
      featured: true,
      claimed: true,
      address: {
        street: "789 Bell Blvd",
        city: "Cedar Park",
        state: "TX",
        zip: "78613",
        full: "789 Bell Blvd, Cedar Park, TX 78613",
      },
      phone: "(512) 555-2345",
      website: "https://hillcountrycafe.com",
      hours: {
        monday: { open: "7:00 AM", close: "9:00 PM", isOpen: true },
        tuesday: { open: "7:00 AM", close: "9:00 PM", isOpen: true },
        wednesday: { open: "7:00 AM", close: "9:00 PM", isOpen: true },
        thursday: { open: "7:00 AM", close: "9:00 PM", isOpen: true },
        friday: { open: "7:00 AM", close: "10:00 PM", isOpen: true },
        saturday: { open: "8:00 AM", close: "10:00 PM", isOpen: true },
        sunday: { open: "8:00 AM", close: "8:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "Farm-to-table dining featuring locally sourced ingredients and seasonal menus. Our chef works directly with local farmers to bring you the freshest produce, grass-fed meats, and artisanal products. Experience the true taste of Texas Hill Country in every bite.",
      specialties: ["Farm-to-Table", "Seasonal Menu", "Local Ingredients", "Craft Cocktails", "Weekend Brunch"],
      amenities: [
        { name: "Outdoor Patio", icon: "🌿" },
        { name: "Full Bar", icon: "🍸" },
        { name: "Reservations", icon: "📅" },
        { name: "Private Dining", icon: "🍽️" },
        { name: "Valet Parking", icon: "🚗" },
        { name: "Romantic", icon: "💕" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      quickStats: {
        overallRating: 4.5,
        totalReviews: 76,
        responseRate: "98%",
        avgResponseTime: "1 hour",
      },
      ratingBreakdown: {
        5: 45,
        4: 25,
        3: 4,
        2: 1,
        1: 1,
      },
    },
    "wellness-center-leander": {
      id: "wellness-center-leander",
      name: "Wellness Center of Leander",
      category: "Health & Beauty",
      rating: 4.8,
      reviewCount: 63,
      priceRange: "$$",
      featured: true,
      claimed: true,
      address: {
        street: "654 Wellness Way",
        city: "Leander",
        state: "TX",
        zip: "78641",
        full: "654 Wellness Way, Leander, TX 78641",
      },
      phone: "(512) 555-3456",
      website: "https://wellnesscenterleander.com",
      hours: {
        monday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        tuesday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        wednesday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        thursday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        friday: { open: "6:00 AM", close: "7:00 PM", isOpen: true },
        saturday: { open: "8:00 AM", close: "6:00 PM", isOpen: true },
        sunday: { open: "9:00 AM", close: "5:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "Comprehensive wellness services including massage therapy, acupuncture, yoga classes, and nutritional counseling. Our certified practitioners are dedicated to helping you achieve optimal health and wellness through holistic approaches and personalized care plans.",
      specialties: ["Massage Therapy", "Acupuncture", "Yoga Classes", "Nutrition Counseling", "Wellness Coaching"],
      amenities: [
        { name: "Spa Services", icon: "🧘‍♀️" },
        { name: "Group Classes", icon: "👥" },
        { name: "Private Sessions", icon: "🏠" },
        { name: "Wellness Shop", icon: "🛍️" },
        { name: "Free Parking", icon: "🅿️" },
        { name: "Sauna", icon: "🧖" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      quickStats: {
        overallRating: 4.8,
        totalReviews: 63,
        responseRate: "100%",
        avgResponseTime: "30 minutes",
      },
      ratingBreakdown: {
        5: 52,
        4: 8,
        3: 2,
        2: 1,
        1: 0,
      },
    },
    "joes-pizza": {
      id: "joes-pizza",
      name: "Joe's Pizza",
      category: "Restaurants",
      rating: 4.6,
      reviewCount: 94,
      priceRange: "$",
      featured: true,
      claimed: false,
      address: {
        street: "890 Pizza Lane",
        city: "Leander",
        state: "TX",
        zip: "78641",
        full: "890 Pizza Lane, Leander, TX 78641",
      },
      phone: "(512) 555-4567",
      website: "https://joespizzaleander.com",
      hours: {
        monday: { open: "11:00 AM", close: "10:00 PM", isOpen: true },
        tuesday: { open: "11:00 AM", close: "10:00 PM", isOpen: true },
        wednesday: { open: "11:00 AM", close: "10:00 PM", isOpen: true },
        thursday: { open: "11:00 AM", close: "10:00 PM", isOpen: true },
        friday: { open: "11:00 AM", close: "11:00 PM", isOpen: true },
        saturday: { open: "11:00 AM", close: "11:00 PM", isOpen: true },
        sunday: { open: "12:00 PM", close: "9:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "New York-style pizza made with authentic ingredients and traditional methods. Our dough is made fresh daily, and we use only the finest imported Italian tomatoes and premium mozzarella. Family recipes passed down through three generations.",
      specialties: ["NY-Style Pizza", "Calzones", "Garlic Knots", "Italian Subs", "Homemade Gelato"],
      amenities: [
        { name: "Delivery", icon: "🚚" },
        { name: "Takeout", icon: "🥡" },
        { name: "Dine-In", icon: "🍽️" },
        { name: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
        { name: "Late Night", icon: "🌙" },
        { name: "BYOB", icon: "🍷" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      quickStats: {
        overallRating: 4.6,
        totalReviews: 94,
        responseRate: "85%",
        avgResponseTime: "3 hours",
      },
      ratingBreakdown: {
        5: 65,
        4: 22,
        3: 5,
        2: 1,
        1: 1,
      },
    },
    "leander-pet-clinic": {
      id: "leander-pet-clinic",
      name: "Leander Pet Clinic",
      category: "Pets",
      rating: 4.7,
      reviewCount: 89,
      priceRange: "$$",
      featured: true,
      claimed: true,
      address: {
        street: "456 Pet Care Lane",
        city: "Leander",
        state: "TX",
        zip: "78641",
        full: "456 Pet Care Lane, Leander, TX 78641",
      },
      phone: "(512) 555-5678",
      website: "https://leanderpetclinic.com",
      hours: {
        monday: { open: "7:00 AM", close: "6:00 PM", isOpen: true },
        tuesday: { open: "7:00 AM", close: "6:00 PM", isOpen: true },
        wednesday: { open: "7:00 AM", close: "6:00 PM", isOpen: true },
        thursday: { open: "7:00 AM", close: "6:00 PM", isOpen: true },
        friday: { open: "7:00 AM", close: "6:00 PM", isOpen: true },
        saturday: { open: "8:00 AM", close: "4:00 PM", isOpen: true },
        sunday: { open: "Closed", close: "Closed", isOpen: false },
      },
      currentlyOpen: true,
      description:
        "Full-service veterinary clinic providing comprehensive care for dogs, cats, and exotic pets. Our experienced veterinarians offer preventive care, surgery, dental services, and emergency treatment. We treat your pets like family.",
      specialties: ["Preventive Care", "Surgery", "Dental Care", "Emergency Services", "Exotic Pet Care"],
      amenities: [
        { name: "Emergency Care", icon: "🚨" },
        { name: "Surgery Suite", icon: "🏥" },
        { name: "Boarding", icon: "🏠" },
        { name: "Grooming", icon: "✂️" },
        { name: "Pharmacy", icon: "💊" },
        { name: "Lab Services", icon: "🔬" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      quickStats: {
        overallRating: 4.7,
        totalReviews: 89,
        responseRate: "95%",
        avgResponseTime: "2 hours",
      },
      ratingBreakdown: {
        5: 68,
        4: 15,
        3: 4,
        2: 1,
        1: 1,
      },
    },
    "artisan-coffee-roasters": {
      id: "artisan-coffee-roasters",
      name: "Artisan Coffee Roasters",
      category: "Coffee Shop",
      rating: 4.8,
      reviewCount: 127,
      priceRange: "$$",
      featured: false,
      claimed: true,
      address: {
        street: "123 Main St",
        city: "Leander",
        state: "TX",
        zip: "78641",
        full: "123 Main St, Leander, TX 78641",
      },
      phone: "(512) 555-7890",
      website: "https://artisancoffeeroasters.com",
      hours: {
        monday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        tuesday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        wednesday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        thursday: { open: "6:00 AM", close: "8:00 PM", isOpen: true },
        friday: { open: "6:00 AM", close: "9:00 PM", isOpen: true },
        saturday: { open: "7:00 AM", close: "9:00 PM", isOpen: true },
        sunday: { open: "7:00 AM", close: "7:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "Locally roasted coffee with a cozy atmosphere perfect for work or relaxation. We source our beans directly from farmers and roast them in-house daily. Our skilled baristas craft each cup with precision and passion.",
      specialties: ["Single Origin Coffee", "House Blends", "Espresso Drinks", "Cold Brew", "Pastries"],
      amenities: [
        { name: "WiFi", icon: "📶" },
        { name: "Pet Friendly", icon: "🐕" },
        { name: "Outdoor Seating", icon: "☀️" },
        { name: "Study Space", icon: "📚" },
        { name: "Local Art", icon: "🎨" },
        { name: "Live Music", icon: "🎵" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
      quickStats: {
        overallRating: 4.8,
        totalReviews: 127,
        responseRate: "92%",
        avgResponseTime: "1 hour",
      },
      ratingBreakdown: {
        5: 98,
        4: 22,
        3: 5,
        2: 1,
        1: 1,
      },
    },
  }

  return businesses[id as keyof typeof businesses] || null
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const business = getBusinessData(id)

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Not Found</h1>
          <p className="text-gray-600 mb-8">The business you're looking for doesn't exist or has been removed.</p>
          <a href="/" className="text-blue-600 hover:underline">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <BusinessPageHeader business={business} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <BusinessPageContent business={business} />
            <BusinessReviewsSection business={business} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BusinessSidebar business={business} />
          </div>
        </div>
      </div>
    </div>
  )
}

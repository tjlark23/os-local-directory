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
        { name: "Parking Available", icon: "🅿️" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Smoked+Brisket+Platter",
        "/placeholder.svg?height=400&width=600&text=BBQ+Restaurant+Interior",
        "/placeholder.svg?height=400&width=600&text=Baby+Back+Ribs+with+Sauce",
        "/placeholder.svg?height=400&width=600&text=Outdoor+Patio+Dining",
        "/placeholder.svg?height=400&width=600&text=Large+BBQ+Smoker+Pit",
        "/placeholder.svg?height=400&width=600&text=Homemade+Mac+and+Cheese",
        "/placeholder.svg?height=400&width=600&text=Full+BBQ+Spread",
        "/placeholder.svg?height=400&width=600&text=BBQ+Restaurant+Exterior",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=BBQ+Process+Video",
        "/placeholder.svg?height=300&width=400&text=Behind+the+Scenes",
        "/placeholder.svg?height=300&width=400&text=Customer+Reviews",
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
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Fresh+Farm+Salad+with+Local+Greens",
        "/placeholder.svg?height=400&width=600&text=Elegant+Restaurant+Interior+with+Natural+Light",
        "/placeholder.svg?height=400&width=600&text=Craft+Cocktails+on+Bar",
        "/placeholder.svg?height=400&width=600&text=Garden+Patio+with+String+Lights",
        "/placeholder.svg?height=400&width=600&text=Chef+Preparing+Fresh+Ingredients",
        "/placeholder.svg?height=400&width=600&text=Weekend+Brunch+Spread",
        "/placeholder.svg?height=400&width=600&text=Local+Produce+Display",
        "/placeholder.svg?height=400&width=600&text=Private+Dining+Room+Setup",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Farm+Tour+Video",
        "/placeholder.svg?height=300&width=400&text=Chef+Interview",
        "/placeholder.svg?height=300&width=400&text=Seasonal+Menu",
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
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Relaxing+Massage+Therapy+Room",
        "/placeholder.svg?height=400&width=600&text=Bright+Yoga+Studio+with+Mats",
        "/placeholder.svg?height=400&width=600&text=Modern+Reception+Area+with+Plants",
        "/placeholder.svg?height=400&width=600&text=Acupuncture+Treatment+Room",
        "/placeholder.svg?height=400&width=600&text=Peaceful+Meditation+Space",
        "/placeholder.svg?height=400&width=600&text=Wellness+Products+Shop",
        "/placeholder.svg?height=400&width=600&text=Group+Fitness+Class+in+Session",
        "/placeholder.svg?height=400&width=600&text=Zen+Relaxation+Lounge",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Wellness+Tour",
        "/placeholder.svg?height=300&width=400&text=Yoga+Class",
        "/placeholder.svg?height=300&width=400&text=Testimonials",
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
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Fresh+Pepperoni+Pizza+Slice",
        "/placeholder.svg?height=400&width=600&text=Traditional+Brick+Pizza+Oven",
        "/placeholder.svg?height=400&width=600&text=Pizza+Dough+Being+Tossed",
        "/placeholder.svg?height=400&width=600&text=Italian+Sub+Sandwich",
        "/placeholder.svg?height=400&width=600&text=Golden+Calzone+with+Marinara",
        "/placeholder.svg?height=400&width=600&text=Fresh+Garlic+Knots",
        "/placeholder.svg?height=400&width=600&text=Casual+Pizza+Restaurant+Interior",
        "/placeholder.svg?height=400&width=600&text=Homemade+Gelato+Display+Case",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Pizza+Making",
        "/placeholder.svg?height=300&width=400&text=Dough+Tossing",
        "/placeholder.svg?height=300&width=400&text=Customer+Favorites",
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
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Veterinary+Examination+Room+with+Dog",
        "/placeholder.svg?height=400&width=600&text=Modern+Surgery+Suite+Equipment",
        "/placeholder.svg?height=400&width=600&text=Comfortable+Waiting+Area+for+Pets",
        "/placeholder.svg?height=400&width=600&text=Pet+Dental+Care+Equipment",
        "/placeholder.svg?height=400&width=600&text=Clean+Pet+Boarding+Kennels",
        "/placeholder.svg?height=400&width=600&text=Professional+Pet+Grooming+Station",
        "/placeholder.svg?height=400&width=600&text=Veterinary+Pharmacy+Shelves",
        "/placeholder.svg?height=400&width=600&text=Happy+Veterinarian+with+Cat+and+Dog",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Clinic+Tour",
        "/placeholder.svg?height=300&width=400&text=Pet+Care+Tips",
        "/placeholder.svg?height=300&width=400&text=Staff+Introduction",
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
    "hill-country-realty": {
      id: "hill-country-realty",
      name: "Hill Country Realty",
      category: "Real Estate",
      rating: 4.8,
      reviewCount: 156,
      priceRange: "$$$",
      featured: true,
      claimed: true,
      address: {
        street: "789 Realty Row",
        city: "Cedar Park",
        state: "TX",
        zip: "78613",
        full: "789 Realty Row, Cedar Park, TX 78613",
      },
      phone: "(512) 555-6789",
      website: "https://hillcountryrealty.com",
      hours: {
        monday: { open: "8:00 AM", close: "7:00 PM", isOpen: true },
        tuesday: { open: "8:00 AM", close: "7:00 PM", isOpen: true },
        wednesday: { open: "8:00 AM", close: "7:00 PM", isOpen: true },
        thursday: { open: "8:00 AM", close: "7:00 PM", isOpen: true },
        friday: { open: "8:00 AM", close: "7:00 PM", isOpen: true },
        saturday: { open: "9:00 AM", close: "6:00 PM", isOpen: true },
        sunday: { open: "10:00 AM", close: "5:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "Premier real estate agency specializing in Cedar Park, Leander, and Liberty Hill properties. Our experienced agents provide personalized service for buying, selling, and investing in residential and commercial properties. Local market experts since 2005.",
      specialties: [
        "Residential Sales",
        "Commercial Properties",
        "Investment Properties",
        "First-Time Buyers",
        "Luxury Homes",
      ],
      amenities: [
        { name: "Market Analysis", icon: "📊" },
        { name: "Virtual Tours", icon: "🏠" },
        { name: "Staging Services", icon: "🎨" },
        { name: "Mortgage Assistance", icon: "💰" },
        { name: "Relocation Services", icon: "📦" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Beautiful+Hill+Country+Home+Exterior",
        "/placeholder.svg?height=400&width=600&text=Professional+Real+Estate+Office",
        "/placeholder.svg?height=400&width=600&text=Agent+Meeting+with+Clients",
        "/placeholder.svg?height=400&width=600&text=Staged+Living+Room+Interior",
        "/placeholder.svg?height=400&width=600&text=Modern+Commercial+Building",
        "/placeholder.svg?height=400&width=600&text=New+Construction+Home",
        "/placeholder.svg?height=400&width=600&text=Open+House+Welcome+Sign",
        "/placeholder.svg?height=400&width=600&text=Happy+Family+at+Home+Closing",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Property+Tour",
        "/placeholder.svg?height=300&width=400&text=Agent+Testimonials",
        "/placeholder.svg?height=300&width=400&text=Market+Update",
      ],
      quickStats: {
        overallRating: 4.8,
        totalReviews: 156,
        responseRate: "100%",
        avgResponseTime: "15 minutes",
      },
      ratingBreakdown: {
        5: 125,
        4: 25,
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
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Coffee+Beans+Being+Roasted",
        "/placeholder.svg?height=400&width=600&text=Professional+Espresso+Machine+in+Action",
        "/placeholder.svg?height=400&width=600&text=Cozy+Coffee+Shop+Interior+with+Books",
        "/placeholder.svg?height=400&width=600&text=Beautiful+Latte+Art+Heart",
        "/placeholder.svg?height=400&width=600&text=Fresh+Coffee+Beans+in+Burlap+Sacks",
        "/placeholder.svg?height=400&width=600&text=Outdoor+Cafe+Seating+Area",
        "/placeholder.svg?height=400&width=600&text=Fresh+Pastries+Display+Case",
        "/placeholder.svg?height=400&width=600&text=Skilled+Barista+Making+Coffee",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Roasting+Process",
        "/placeholder.svg?height=300&width=400&text=Latte+Art+Demo",
        "/placeholder.svg?height=300&width=400&text=Coffee+Farm+Visit",
      ],
      quickStats: {
        overallRating: 4.8,
        totalReviews: 127,
        responseRate: "90%",
        avgResponseTime: "4 hours",
      },
      ratingBreakdown: {
        5: 98,
        4: 22,
        3: 5,
        2: 1,
        1: 1,
      },
    },
    "green-garden-bistro": {
      id: "green-garden-bistro",
      name: "Green Garden Bistro",
      category: "Restaurant",
      rating: 4.6,
      reviewCount: 89,
      priceRange: "$$$",
      featured: false,
      claimed: true,
      address: {
        street: "456 Oak Ave",
        city: "Cedar Park",
        state: "TX",
        zip: "78613",
        full: "456 Oak Ave, Cedar Park, TX 78613",
      },
      phone: "(512) 555-8901",
      website: "https://greengardenbistro.com",
      hours: {
        monday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        tuesday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        wednesday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        thursday: { open: "11:00 AM", close: "9:00 PM", isOpen: true },
        friday: { open: "11:00 AM", close: "10:00 PM", isOpen: true },
        saturday: { open: "10:00 AM", close: "10:00 PM", isOpen: true },
        sunday: { open: "10:00 AM", close: "8:00 PM", isOpen: true },
      },
      currentlyOpen: true,
      description:
        "Farm-to-table dining with fresh, locally sourced ingredients. Our seasonal menu features organic produce, sustainable seafood, and grass-fed meats. Committed to environmental sustainability and supporting local farmers.",
      specialties: ["Organic Cuisine", "Seasonal Menu", "Vegetarian Options", "Sustainable Seafood", "Local Produce"],
      amenities: [
        { name: "Vegetarian Options", icon: "🥗" },
        { name: "Outdoor Seating", icon: "🌿" },
        { name: "Reservations", icon: "📞" },
        { name: "Wine Selection", icon: "🍷" },
        { name: "Private Events", icon: "🎉" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Colorful+Organic+Garden+Salad",
        "/placeholder.svg?height=400&width=600&text=Upscale+Bistro+Interior+Design",
        "/placeholder.svg?height=400&width=600&text=Seasonal+Farm+Fresh+Dish",
        "/placeholder.svg?height=400&width=600&text=Herb+Garden+Patio+Dining",
        "/placeholder.svg?height=400&width=600&text=Chef+with+Fresh+Local+Ingredients",
        "/placeholder.svg?height=400&width=600&text=Curated+Wine+Selection+Display",
        "/placeholder.svg?height=400&width=600&text=Open+Kitchen+Food+Preparation",
        "/placeholder.svg?height=400&width=600&text=Intimate+Private+Dining+Setup",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Farm+Partnership",
        "/placeholder.svg?height=300&width=400&text=Seasonal+Menu",
        "/placeholder.svg?height=300&width=400&text=Chef+Interview",
      ],
      quickStats: {
        overallRating: 4.6,
        totalReviews: 89,
        responseRate: "95%",
        avgResponseTime: "2 hours",
      },
      ratingBreakdown: {
        5: 58,
        4: 25,
        3: 4,
        2: 1,
        1: 1,
      },
    },
    "tech-repair-pro": {
      id: "tech-repair-pro",
      name: "Tech Repair Pro",
      category: "Electronics Repair",
      rating: 4.9,
      reviewCount: 156,
      priceRange: "$$",
      featured: false,
      claimed: true,
      address: {
        street: "789 Pine St",
        city: "Leander",
        state: "TX",
        zip: "78641",
        full: "789 Pine St, Leander, TX 78641",
      },
      phone: "(512) 555-9012",
      website: "https://techrepairpro.com",
      hours: {
        monday: { open: "9:00 AM", close: "7:00 PM", isOpen: true },
        tuesday: { open: "9:00 AM", close: "7:00 PM", isOpen: true },
        wednesday: { open: "9:00 AM", close: "7:00 PM", isOpen: true },
        thursday: { open: "9:00 AM", close: "7:00 PM", isOpen: true },
        friday: { open: "9:00 AM", close: "7:00 PM", isOpen: true },
        saturday: { open: "10:00 AM", close: "6:00 PM", isOpen: true },
        sunday: { open: "Closed", close: "Closed", isOpen: false },
      },
      currentlyOpen: true,
      description:
        "Professional electronics repair with quick turnaround times. We specialize in smartphones, tablets, laptops, and gaming consoles. Certified technicians with years of experience and genuine parts guarantee.",
      specialties: ["iPhone Repair", "Android Repair", "Laptop Repair", "Gaming Console Repair", "Data Recovery"],
      amenities: [
        { name: "Same Day Service", icon: "⚡" },
        { name: "Warranty", icon: "🛡️" },
        { name: "Free Estimates", icon: "💰" },
        { name: "Genuine Parts", icon: "🔧" },
        { name: "Data Protection", icon: "🔒" },
      ],
      photos: [
        "/placeholder.svg?height=400&width=600&text=Professional+Electronics+Repair+Workstation",
        "/placeholder.svg?height=400&width=600&text=iPhone+Screen+Replacement+Process",
        "/placeholder.svg?height=400&width=600&text=Laptop+Motherboard+Repair",
        "/placeholder.svg?height=400&width=600&text=Organized+Electronic+Parts+Inventory",
        "/placeholder.svg?height=400&width=600&text=Advanced+Testing+Equipment+Setup",
        "/placeholder.svg?height=400&width=600&text=Clean+Room+for+Delicate+Repairs",
        "/placeholder.svg?height=400&width=600&text=Customer+Service+Counter",
        "/placeholder.svg?height=400&width=600&text=Repair+Warranty+Certificate",
      ],
      videos: [
        "/placeholder.svg?height=300&width=400&text=Repair+Process",
        "/placeholder.svg?height=300&width=400&text=Quality+Testing",
        "/placeholder.svg?height=300&width=400&text=Customer+Testimonials",
      ],
      quickStats: {
        overallRating: 4.9,
        totalReviews: 156,
        responseRate: "100%",
        avgResponseTime: "1 hour",
      },
      ratingBreakdown: {
        5: 142,
        4: 12,
        3: 1,
        2: 1,
        1: 0,
      },
    },
  }

  return businesses[id as keyof typeof businesses] || null
}

export default function BusinessPage({ params }: { params: { id: string } }) {
  const business = getBusinessData(params.id)

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
    <div className="min-h-screen bg-gray-50">
      <BusinessPageHeader business={business} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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

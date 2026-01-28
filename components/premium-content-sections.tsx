"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  CheckCircle2,
  MapPin,
  HelpCircle,
  Utensils,
  ThumbsUp,
  Star,
  Users
} from "lucide-react"

interface PremiumContentSectionsProps {
  business: {
    name: string
    category: string
    description: string
    specialties: string[]
    tags: string[]
    priceRange: string
    rating: number
    reviewCount: number
    address: {
      city: string
      state: string
    }
    listingTier?: string
  }
  section?: 'why-choose-us' | 'services' | 'faq' | 'local' | 'all'
}

// Category-specific content templates
const CATEGORY_CONTENT: Record<string, {
  services: string[]
  whyChooseUs: string[]
  faqs: { question: string; answer: string }[]
}> = {
  restaurants: {
    services: [
      "Dine-in Experience",
      "Takeout & Curbside Pickup",
      "Online Ordering",
      "Catering Services",
      "Private Events",
      "Happy Hour Specials"
    ],
    whyChooseUs: [
      "Fresh, locally-sourced ingredients prepared daily",
      "Exceptional customer service and welcoming atmosphere",
      "Family-friendly environment with diverse menu options",
      "Convenient location with ample parking",
      "Consistent quality that keeps customers coming back"
    ],
    faqs: [
      { question: "Do you take reservations?", answer: "Yes! We accept reservations for parties of any size. Call us or book online through our website." },
      { question: "Do you offer catering?", answer: "Absolutely! We offer full-service catering for events of all sizes. Contact us for custom menu options." },
      { question: "Is there outdoor seating?", answer: "Yes, we have a beautiful patio area available for outdoor dining (weather permitting)." },
      { question: "Do you have vegetarian/vegan options?", answer: "Yes! We have a variety of vegetarian and vegan dishes clearly marked on our menu." }
    ]
  },
  health: {
    services: [
      "Comprehensive Health Assessments",
      "Preventive Care Services",
      "Specialized Treatment Plans",
      "Telehealth Consultations",
      "Same-Day Appointments",
      "Insurance Accepted"
    ],
    whyChooseUs: [
      "Board-certified healthcare professionals",
      "State-of-the-art facilities and equipment",
      "Patient-centered approach to care",
      "Flexible scheduling including evenings and weekends",
      "Comprehensive care coordination"
    ],
    faqs: [
      { question: "Do you accept my insurance?", answer: "We accept most major insurance plans. Please contact our office to verify your specific coverage." },
      { question: "How do I schedule an appointment?", answer: "You can schedule online through our patient portal, call our office, or walk in for same-day availability." },
      { question: "Do you offer telehealth?", answer: "Yes! We offer convenient virtual visits for many types of appointments." },
      { question: "What should I bring to my first visit?", answer: "Please bring your ID, insurance card, list of current medications, and any relevant medical records." }
    ]
  },
  default: {
    services: [
      "Professional Consultation",
      "Personalized Service Plans",
      "Quality Guarantee",
      "Flexible Scheduling",
      "Competitive Pricing",
      "Expert Support"
    ],
    whyChooseUs: [
      "Experienced team of dedicated professionals",
      "Commitment to customer satisfaction",
      "Transparent pricing with no hidden fees",
      "Serving the local community with pride",
      "Quick response times and reliable service"
    ],
    faqs: [
      { question: "How do I schedule an appointment?", answer: "You can contact us by phone, email, or through our website to schedule at your convenience." },
      { question: "Do you offer free consultations?", answer: "Yes! We offer complimentary initial consultations to discuss your needs and how we can help." },
      { question: "What areas do you serve?", answer: "We proudly serve Leander, Cedar Park, Liberty Hill, and the greater Austin area." },
      { question: "What forms of payment do you accept?", answer: "We accept all major credit cards, cash, and offer flexible payment plans for qualified customers." }
    ]
  }
}

export function PremiumContentSections({ business, section = 'all' }: PremiumContentSectionsProps) {
  // Only show for premium or featured businesses
  if (business.listingTier !== 'premium' && business.listingTier !== 'featured') {
    return null
  }

  const content = CATEGORY_CONTENT[business.category] || CATEGORY_CONTENT.default

  // Generate dynamic services based on specialties and tags
  const dynamicServices = business.specialties.length > 0
    ? business.specialties.slice(0, 4)
    : business.tags.slice(0, 4)

  const allServices = [...dynamicServices, ...content.services.slice(0, 6 - dynamicServices.length)]

  // Why Choose Us Section
  const WhyChooseUsSection = () => (
    <Card className="overflow-hidden border-border/50 border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Why Choose {business.name}</h3>
        </div>
        <div className="grid gap-3">
          {content.whyChooseUs.map((reason, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{reason}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-2xl font-bold">{business.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold">{business.reviewCount}+</span>
            </div>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ThumbsUp className="w-4 h-4 text-primary" />
              <span className="text-2xl font-bold">98%</span>
            </div>
            <p className="text-xs text-muted-foreground">Recommend</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Services Section
  const ServicesSection = () => (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">What We Offer</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {allServices.map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{service}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Local Callout Section
  const LocalSection = () => (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Proudly Serving {business.address.city}</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          {business.name} is your trusted local {business.category === 'restaurants' ? 'restaurant' : 'business'} in {business.address.city}, Texas.
          We're proud to be part of the Leander Scoop community and serve neighbors from Cedar Park, Liberty Hill, and beyond.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Leander
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Cedar Park
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Liberty Hill
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Georgetown
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Austin
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  // FAQ Section
  const FAQSection = () => (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {content.faqs.map((faq, index) => (
            <div key={index} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
              <h4 className="font-medium mb-2 flex items-start gap-2">
                <span className="text-primary font-bold">Q:</span>
                {faq.question}
              </h4>
              <p className="text-muted-foreground text-sm pl-5">
                <span className="text-primary font-bold mr-1">A:</span>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Render based on section prop
  if (section === 'why-choose-us') return <WhyChooseUsSection />
  if (section === 'services') return <ServicesSection />
  if (section === 'faq') return <FAQSection />
  if (section === 'local') return <LocalSection />

  // Render all sections
  return (
    <div className="space-y-6">
      <WhyChooseUsSection />
      <ServicesSection />
      <LocalSection />
      <FAQSection />
    </div>
  )
}

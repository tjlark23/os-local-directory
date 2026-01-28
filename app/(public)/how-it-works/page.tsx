import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: `How It Works | Find Local Businesses | ${siteConfig.name}`,
  description: `Learn how to use ${siteConfig.name} to find the best local businesses across Williamson County, Texas.`,
  keywords: [
    'how to find local businesses',
    'williamson county business search',
    'local business guide',
    'find businesses near me',
  ],
  openGraph: {
    title: `How It Works | ${siteConfig.name}`,
    description: 'Learn how to find the best local businesses in Williamson County.',
    type: 'website',
    url: `${siteConfig.url}/how-it-works`,
  },
  alternates: {
    canonical: `${siteConfig.url}/how-it-works`,
  },
}

const STEPS_FOR_USERS = [
  {
    number: '01',
    icon: Search,
    title: 'Search or Browse',
    description: 'Use our powerful search to find businesses by name, category, or location. Or browse by category to discover new favorites.',
  },
  {
    number: '02',
    icon: Star,
    title: 'Compare Options',
    description: 'Read reviews, check ratings, view photos, and compare multiple businesses to find the perfect match for your needs.',
  },
  {
    number: '03',
    icon: Phone,
    title: 'Connect',
    description: 'Get contact information, directions, and business hours. Call, visit, or reach out directly to the businesses you\'ve chosen.',
  },
]

const STEPS_FOR_BUSINESSES = [
  {
    number: '01',
    icon: Building2,
    title: 'Submit Your Business',
    description: 'Fill out our simple form with your business details. Include your name, address, category, hours, and contact information.',
  },
  {
    number: '02',
    icon: CheckCircle2,
    title: 'Get Verified',
    description: 'Our team verifies your information to ensure accuracy. Most listings go live within 2-3 business days.',
  },
  {
    number: '03',
    icon: Users,
    title: 'Reach Customers',
    description: 'Once listed, local customers can find you through search, categories, and our curated guides. Start connecting!',
  },
]

const FEATURES = [
  {
    icon: MapPin,
    title: 'Accurate Locations',
    description: 'Verified addresses and interactive maps help customers find you easily.',
  },
  {
    icon: Star,
    title: 'Real Reviews',
    description: 'Authentic customer reviews build trust and help businesses stand out.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find exactly what you\'re looking for with category filters and location-based results.',
  },
  {
    icon: Sparkles,
    title: 'Curated Guides',
    description: 'Expert-curated lists of the best businesses in each category and city.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">How It Works</span>
          </nav>

          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Getting Started
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How {siteConfig.name} Works
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you're looking for local businesses or want to get your business listed,
              we've made it simple and straightforward.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* For Users Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">For Users</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Finding Local Businesses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the best local businesses in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STEPS_FOR_USERS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative">
                  <Card className="h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-primary/20 mb-4">{step.number}</div>
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < STEPS_FOR_USERS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/search">
                Start Searching
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* For Businesses Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">For Businesses</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Getting Your Business Listed
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get found by local customers in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STEPS_FOR_BUSINESSES.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative">
                  <Card className="h-full border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-primary/20 mb-4">{step.number}</div>
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < STEPS_FOR_BUSINESSES.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/business-inquiry">
                List Your Business
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Use {siteConfig.name}?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Features designed to help users find great businesses and help businesses get found.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're looking for local services or want to grow your business,
            {siteConfig.name} is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/search">Find Businesses</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/for-businesses">List Your Business</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

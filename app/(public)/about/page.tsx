import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Star, Building2, Heart, ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Leander Scoop Directory | Local Business Guide',
  description: 'Learn about Leander Scoop Directory, your trusted source for finding local businesses in Leander, Cedar Park, Liberty Hill, and surrounding Texas communities.',
  keywords: [
    'about leander scoop',
    'leander business directory',
    'cedar park local guide',
    'texas local business',
    'williamson county directory',
  ],
  openGraph: {
    title: 'About Leander Scoop Directory',
    description: 'Your trusted source for finding local businesses in the Leander area.',
    type: 'website',
    url: 'https://directory.leanderscoop.com/about',
  },
  alternates: {
    canonical: 'https://directory.leanderscoop.com/about',
  },
}

const STATS = [
  { icon: Building2, label: 'Local Businesses', value: '200+' },
  { icon: MapPin, label: 'Cities Covered', value: '9' },
  { icon: Star, label: 'Reviews & Ratings', value: '1,000+' },
  { icon: Users, label: 'Monthly Visitors', value: '5,000+' },
]

const VALUES = [
  {
    title: 'Local First',
    description: 'We focus exclusively on local businesses in the Leander area, helping you discover hidden gems and support your neighbors.',
  },
  {
    title: 'Verified Information',
    description: 'Every business listing is verified for accuracy, including hours, contact info, and location details.',
  },
  {
    title: 'Community Driven',
    description: 'Our reviews and ratings come from real customers, helping you make informed decisions.',
  },
  {
    title: 'Always Free',
    description: 'Searching and browsing is always free. We believe everyone should have access to local business information.',
  },
]

const CITIES = [
  { name: 'Leander', slug: 'leander-tx', status: 'active' },
  { name: 'Cedar Park', slug: 'cedar-park-tx', status: 'active' },
  { name: 'Liberty Hill', slug: 'liberty-hill-tx', status: 'active' },
  { name: 'Hutto', slug: 'hutto-tx', status: 'coming' },
  { name: 'Pflugerville', slug: 'pflugerville-tx', status: 'coming' },
  { name: 'Round Rock', slug: 'round-rock-tx', status: 'coming' },
  { name: 'Taylor', slug: 'taylor-tx', status: 'coming' },
  { name: 'Georgetown', slug: 'georgetown-tx', status: 'coming' },
  { name: 'Austin', slug: 'austin-tx', status: 'coming' },
]

export default function AboutPage() {
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">About</span>
          </nav>

          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Est. {year - 1}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About Leander Scoop Directory
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your trusted guide to local businesses in Leander, Cedar Park, Liberty Hill, and the surrounding Texas communities.
              We help you discover, compare, and connect with the best local businesses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/search">
                  Explore Businesses
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/for-businesses">For Business Owners</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="bg-background shadow-lg">
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            Leander Scoop Directory was created to help residents and visitors discover the amazing local businesses
            that make our community special. We believe that strong local businesses are the backbone of thriving
            neighborhoods, and we're committed to helping them connect with customers who need their services.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {VALUES.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Coverage Area Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">Our Coverage Area</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            We're actively expanding to cover more communities in the greater Austin area.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {CITIES.map((city) => (
              <Link key={city.slug} href={`/neighborhoods/${city.slug}`}>
                <Card className={`hover:shadow-md transition-all ${city.status === 'active' ? 'border-primary/30' : ''}`}>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-medium text-foreground">{city.name}</span>
                      {city.status === 'active' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Badge variant="secondary" className="text-xs">Soon</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* For Businesses CTA */}
        <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Are You a Local Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get your business listed in our directory and reach thousands of local customers looking for your services.
            Basic listings are free, and premium options are available for businesses that want to stand out.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/for-businesses">Learn More</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/business-inquiry">Submit Your Business</Link>
            </Button>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            We'd love to hear from you. Whether you're a resident looking for business recommendations
            or a business owner interested in listing your services, we're here to help.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

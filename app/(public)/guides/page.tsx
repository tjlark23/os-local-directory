import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, MapPin, Utensils, Coffee, Pizza, Flame } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Local Guides | Best of Leander, Cedar Park & Liberty Hill | Leander Scoop',
  description: 'Curated guides to the best restaurants, services, and local businesses in Leander, Cedar Park, and Liberty Hill, Texas.',
  keywords: [
    'best restaurants leander tx',
    'best restaurants cedar park tx',
    'leander local guides',
    'cedar park dining guide',
    'liberty hill restaurants',
  ],
  openGraph: {
    title: 'Local Guides | Best of Leander & Cedar Park',
    description: 'Curated guides to the best local businesses in the Leander area.',
    type: 'website',
    url: 'https://directory.leanderscoop.com/guides',
  },
  alternates: {
    canonical: 'https://directory.leanderscoop.com/guides',
  },
}

// Define available guides with icons
const GUIDES = [
  {
    slug: 'best-restaurants-leander-tx',
    title: 'Best Restaurants in Leander',
    description: 'Top-rated dining spots from casual to upscale',
    icon: Utensils,
    featured: true,
  },
  {
    slug: 'best-restaurants-cedar-park-tx',
    title: 'Best Restaurants in Cedar Park',
    description: 'Where to eat in Cedar Park, TX',
    icon: Utensils,
    featured: true,
  },
  {
    slug: 'best-restaurants-liberty-hill-tx',
    title: 'Best Restaurants in Liberty Hill',
    description: 'Local favorites and hidden gems',
    icon: Utensils,
  },
  {
    slug: 'best-bbq-leander-cedar-park-tx',
    title: 'Best BBQ in the Area',
    description: 'Authentic Texas barbecue spots',
    icon: Flame,
    featured: true,
  },
  {
    slug: 'best-mexican-food-leander-tx',
    title: 'Best Mexican Food in Leander',
    description: 'Tacos, enchiladas, and Tex-Mex favorites',
    icon: Utensils,
  },
  {
    slug: 'best-pizza-leander-cedar-park-tx',
    title: 'Best Pizza in the Area',
    description: 'Top pizza places for every taste',
    icon: Pizza,
  },
  {
    slug: 'best-coffee-shops-leander-tx',
    title: 'Best Coffee Shops in Leander',
    description: 'Your morning brew and cozy cafes',
    icon: Coffee,
  },
  {
    slug: 'best-family-restaurants-leander-tx',
    title: 'Best Family-Friendly Restaurants',
    description: 'Great spots for dining with kids',
    icon: Utensils,
  },
]

export default function GuidesPage() {
  const year = new Date().getFullYear()
  const featuredGuides = GUIDES.filter(g => g.featured)
  const otherGuides = GUIDES.filter(g => !g.featured)

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Guides</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {year} Edition
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Local Guides
            </h1>
            <p className="text-lg text-muted-foreground">
              Curated lists of the best restaurants, services, and local businesses in Leander, Cedar Park, and Liberty Hill, Texas.
              Updated regularly based on reviews and local recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Guides */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Featured Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredGuides.map((guide) => {
            const Icon = guide.icon
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Featured
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center text-primary font-medium group">
                      Read Guide
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Other Guides */}
        <h2 className="text-2xl font-bold text-foreground mb-6">More Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherGuides.map((guide) => {
            const Icon = guide.icon
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {guide.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Location Guides */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { city: 'Leander', slug: 'leander-tx', count: 76 },
              { city: 'Cedar Park', slug: 'cedar-park-tx', count: 100 },
              { city: 'Liberty Hill', slug: 'liberty-hill-tx', count: 39 },
            ].map((location) => (
              <Link key={location.slug} href={`/neighborhoods/${location.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {location.city}, TX
                      </h3>
                      <p className="text-muted-foreground">
                        {location.count}+ businesses
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

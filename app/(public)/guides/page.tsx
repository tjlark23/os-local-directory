import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, MapPin, Utensils, Heart, Sparkles, Dumbbell, Car, ShoppingBag, Briefcase, GraduationCap, Dog, Home, Ticket, Coffee, Pizza, Flame, Scissors } from 'lucide-react'
import { getAllGuides, getFeaturedGuides, getGuidesByCity, type GuideConfig } from '@/lib/guides-config'
import { CITIES } from '@/lib/locations-config'
import { CATEGORY_DISPLAY_NAMES } from '@/lib/slugify'

export const metadata: Metadata = {
  title: 'Local Guides | Best of Leander, Cedar Park & Liberty Hill | WilCo Guide',
  description: 'Curated guides to the best restaurants, services, and local businesses in Leander, Cedar Park, and Liberty Hill, Texas.',
  keywords: [
    'best restaurants leander tx',
    'best restaurants cedar park tx',
    'leander local guides',
    'cedar park dining guide',
    'liberty hill restaurants',
    'best services leander texas',
  ],
  openGraph: {
    title: 'Local Guides | Best of Leander & Cedar Park',
    description: 'Curated guides to the best local businesses in the Leander area.',
    type: 'website',
    url: 'https://wilcoguide.com/guides',
  },
  alternates: {
    canonical: 'https://wilcoguide.com/guides',
  },
}

// Category icons
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  restaurants: Utensils,
  health: Heart,
  beauty: Sparkles,
  fitness: Dumbbell,
  automotive: Car,
  shopping: ShoppingBag,
  services: Briefcase,
  education: GraduationCap,
  pets: Dog,
  home: Home,
  entertainment: Ticket,
}

// Specialty icons
const SPECIALTY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bbq: Flame,
  'mexican-food': Utensils,
  pizza: Pizza,
  'coffee-shops': Coffee,
  'family-restaurants': Utensils,
  'breakfast-brunch': Coffee,
  'happy-hour': Ticket,
  dentists: Heart,
  'hair-salons': Scissors,
  'nail-salons': Sparkles,
}

function getIconForGuide(guide: GuideConfig) {
  // Check for specialty icon first
  for (const [key, Icon] of Object.entries(SPECIALTY_ICONS)) {
    if (guide.slug.includes(key)) {
      return Icon
    }
  }
  // Fall back to category icon
  return CATEGORY_ICONS[guide.category] || Utensils
}

export default function GuidesPage() {
  const year = new Date().getFullYear()
  const allGuides = getAllGuides()
  const featuredGuides = getFeaturedGuides().slice(0, 6)
  const citiesWithData = CITIES.filter(c => c.hasData)

  // Group guides by city
  const guidesByCity = citiesWithData.map(city => ({
    city,
    guides: getGuidesByCity(city.slug),
  }))

  // Get specialty guides (those with tags)
  const specialtyGuides = allGuides.filter(g => g.tags && g.tags.length > 0)

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

      <div className="container mx-auto px-4 py-12">
        {/* Featured Guides */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => {
              const Icon = getIconForGuide(guide)
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
                      <p className="text-muted-foreground mb-4 line-clamp-2">
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
        </section>

        {/* Specialty Food Guides */}
        {specialtyGuides.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Specialty Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {specialtyGuides.slice(0, 12).map((guide) => {
                const Icon = getIconForGuide(guide)
                return (
                  <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg flex-shrink-0">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {guide.title.replace(`, TX`, '').replace(' in ', ' - ')}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {guide.city?.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Guides by City */}
        {guidesByCity.map(({ city, guides }) => (
          <section key={city.slug} className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {city.name} Guides
              </h2>
              <Link
                href={`/neighborhoods/${city.slug}`}
                className="text-primary font-medium hover:underline flex items-center gap-1"
              >
                View All {city.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {guides.slice(0, 8).map((guide) => {
                const Icon = getIconForGuide(guide)
                const displayName = CATEGORY_DISPLAY_NAMES[guide.category] || guide.category
                return (
                  <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                      <CardContent className="p-3 flex items-center gap-2">
                        <div className="p-1.5 bg-muted rounded-lg flex-shrink-0">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground text-sm truncate">
                          {guide.tags ? guide.title.split(' in ')[0].replace('Best ', '') : displayName}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
            {guides.length > 8 && (
              <div className="mt-4 text-center">
                <Link
                  href={`/neighborhoods/${city.slug}`}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  +{guides.length - 8} more guides in {city.name}
                </Link>
              </div>
            )}
          </section>
        ))}

        {/* Browse by Location */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citiesWithData.map((city) => {
              const cityGuides = getGuidesByCity(city.slug)
              return (
                <Link key={city.slug} href={`/neighborhoods/${city.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {city.fullName}
                        </h3>
                        <p className="text-muted-foreground">
                          {cityGuides.length} guides available
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* All Guides Count */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Explore <span className="font-semibold text-foreground">{allGuides.length}</span> curated guides across{' '}
            <span className="font-semibold text-foreground">{citiesWithData.length}</span> cities
          </p>
        </div>
      </div>
    </div>
  )
}

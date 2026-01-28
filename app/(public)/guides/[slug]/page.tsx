import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, ArrowRight, Trophy, Medal, Award, Crown } from 'lucide-react'

// Define available guides
const GUIDES = [
  {
    slug: 'best-restaurants-leander-tx',
    title: 'Best Restaurants in Leander, TX',
    subtitle: 'Top-Rated Dining Spots for 2026',
    description: 'Discover the best restaurants in Leander, Texas. From family-friendly spots to date-night destinations, here are the top-rated places to eat.',
    category: 'restaurants',
    city: 'Leander',
  },
  {
    slug: 'best-restaurants-cedar-park-tx',
    title: 'Best Restaurants in Cedar Park, TX',
    subtitle: 'Top-Rated Dining Spots for 2026',
    description: 'Discover the best restaurants in Cedar Park, Texas. From casual eats to fine dining, here are the top places to enjoy a meal.',
    category: 'restaurants',
    city: 'Cedar Park',
  },
  {
    slug: 'best-restaurants-liberty-hill-tx',
    title: 'Best Restaurants in Liberty Hill, TX',
    subtitle: 'Top-Rated Dining Spots for 2026',
    description: 'Discover the best restaurants in Liberty Hill, Texas. Local favorites and hidden gems for every taste.',
    category: 'restaurants',
    city: 'Liberty Hill',
  },
  {
    slug: 'best-bbq-leander-cedar-park-tx',
    title: 'Best BBQ in Leander & Cedar Park, TX',
    subtitle: 'Top Texas Barbecue Spots for 2026',
    description: 'Find the best BBQ joints in Leander and Cedar Park, Texas. Authentic Texas barbecue at its finest.',
    category: 'restaurants',
    city: null, // Both cities
    tags: ['bbq', 'barbecue', 'smokehouse'],
  },
  {
    slug: 'best-mexican-food-leander-tx',
    title: 'Best Mexican Food in Leander, TX',
    subtitle: 'Top Tex-Mex & Authentic Mexican for 2026',
    description: 'The best Mexican restaurants in Leander, Texas. Tacos, enchiladas, and authentic flavors.',
    category: 'restaurants',
    city: 'Leander',
    tags: ['mexican', 'tex-mex', 'tacos'],
  },
  {
    slug: 'best-pizza-leander-cedar-park-tx',
    title: 'Best Pizza in Leander & Cedar Park, TX',
    subtitle: 'Top Pizza Places for 2026',
    description: 'Craving pizza? Here are the best pizza restaurants in Leander and Cedar Park, Texas.',
    category: 'restaurants',
    city: null,
    tags: ['pizza', 'italian'],
  },
  {
    slug: 'best-coffee-shops-leander-tx',
    title: 'Best Coffee Shops in Leander, TX',
    subtitle: 'Top Cafes & Coffee Spots for 2026',
    description: 'Find the best coffee shops and cafes in Leander, Texas. Perfect spots for your morning brew or afternoon pick-me-up.',
    category: 'restaurants',
    city: 'Leander',
    tags: ['coffee', 'cafe', 'breakfast'],
  },
  {
    slug: 'best-family-restaurants-leander-tx',
    title: 'Best Family-Friendly Restaurants in Leander, TX',
    subtitle: 'Top Kid-Friendly Dining for 2026',
    description: 'Looking for a great place to eat with the kids? Here are the best family-friendly restaurants in Leander, Texas.',
    category: 'restaurants',
    city: 'Leander',
    tags: ['family', 'kids', 'casual'],
  },
]

// Generate static params for all guides
export async function generateStaticParams() {
  return GUIDES.map(guide => ({
    slug: guide.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES.find(g => g.slug === slug)

  if (!guide) {
    return {
      title: 'Guide Not Found | Leander Scoop',
      description: 'The guide you are looking for does not exist.',
    }
  }

  return {
    title: `${guide.title} ${new Date().getFullYear()} | Leander Scoop`,
    description: guide.description,
    keywords: [
      guide.title.toLowerCase(),
      `${guide.category} ${guide.city || 'leander'} tx`,
      `best ${guide.category} near me`,
      `top rated ${guide.category} texas`,
    ],
    openGraph: {
      title: `${guide.title} ${new Date().getFullYear()}`,
      description: guide.description,
      type: 'article',
      url: `https://directory.leanderscoop.com/guides/${slug}`,
    },
    alternates: {
      canonical: `https://directory.leanderscoop.com/guides/${slug}`,
    },
  }
}

async function getBusinessesForGuide(guide: typeof GUIDES[0]) {
  // Get location ID for Leander
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return []

  let query = supabase
    .from('businesses')
    .select('*')
    .eq('location_id', location.id)
    .eq('category', guide.category)
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })

  // Filter by city if specified
  if (guide.city) {
    query = query.eq('address_city', guide.city)
  }

  const { data: businesses, error } = await query.limit(20)

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  // Filter by tags if specified
  let filteredBusinesses = businesses || []
  if (guide.tags && guide.tags.length > 0) {
    filteredBusinesses = businesses?.filter(biz => {
      const bizTags = (biz.tags || []).map((t: string) => t.toLowerCase())
      const bizSpecialties = (biz.specialties || []).map((s: string) => s.toLowerCase())
      const bizName = biz.name.toLowerCase()
      const bizDescription = (biz.description || '').toLowerCase()

      return guide.tags!.some(tag =>
        bizTags.includes(tag) ||
        bizSpecialties.some((s: string) => s.includes(tag)) ||
        bizName.includes(tag) ||
        bizDescription.includes(tag)
      )
    }) || []
  }

  // Take top 10
  return filteredBusinesses.slice(0, 10)
}

// Ranking icons
const RANKING_ICONS = [Crown, Trophy, Medal, Award]

export default async function GuidePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = GUIDES.find(g => g.slug === slug)

  if (!guide) {
    notFound()
  }

  const businesses = await getBusinessesForGuide(guide)
  const year = new Date().getFullYear()

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${guide.title} ${year}`,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: 'Leander Scoop',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Leander Scoop',
      url: 'https://directory.leanderscoop.com',
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: businesses.map((biz, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LocalBusiness',
          name: biz.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: biz.address_street,
            addressLocality: biz.address_city,
            addressRegion: biz.address_state,
            postalCode: biz.address_zip,
            addressCountry: 'US',
          },
          aggregateRating: biz.review_count > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: biz.rating,
            reviewCount: biz.review_count,
          } : undefined,
        },
      })),
    },
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/search" className="hover:text-foreground transition-colors">Directory</Link>
              <span>/</span>
              <span className="text-foreground">Guides</span>
            </nav>

            <div className="max-w-3xl">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {year} Guide
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {guide.title}
              </h1>
              <p className="text-xl text-primary font-medium mb-4">
                {guide.subtitle}
              </p>
              <p className="text-lg text-muted-foreground">
                {guide.description}
              </p>
            </div>
          </div>
        </div>

        {/* Business List */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            {businesses.map((business, index) => {
              const RankIcon = RANKING_ICONS[Math.min(index, RANKING_ICONS.length - 1)]
              const isTop3 = index < 3

              return (
                <Card
                  key={business.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow ${
                    isTop3 ? 'border-primary/30 bg-gradient-to-r from-primary/5 to-transparent' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Rank Badge */}
                      <div className={`flex md:flex-col items-center justify-center p-4 md:p-6 ${
                        isTop3 ? 'bg-primary/10' : 'bg-muted/50'
                      }`}>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-amber-600 text-amber-100' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isTop3 ? (
                            <RankIcon className="w-6 h-6" />
                          ) : (
                            <span className="text-lg font-bold">#{index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Image */}
                      <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                        <Image
                          src={business.image || '/images/placeholders/restaurant.svg'}
                          alt={business.name}
                          fill
                          className="object-cover"
                        />
                        {business.is_featured && (
                          <Badge className="absolute top-2 left-2 bg-primary">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h2 className="text-xl font-bold text-foreground mb-1">
                              {business.name}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{business.address_city}, {business.address_state}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{business.rating}</span>
                            <span className="text-muted-foreground text-sm">({business.review_count})</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {business.description || `${business.name} is a popular ${guide.category} destination in ${business.address_city}.`}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(business.specialties || []).slice(0, 3).map((specialty: string) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        <Button asChild className="group">
                          <Link href={`/business/${business.slug}`}>
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Empty State */}
          {businesses.length === 0 && (
            <div className="text-center py-16 bg-background rounded-lg border max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-2">No results yet</h3>
              <p className="text-muted-foreground mb-6">
                We're still adding businesses to this guide. Check back soon!
              </p>
              <Button asChild>
                <Link href="/search">Browse All Businesses</Link>
              </Button>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="max-w-4xl mx-auto mt-16 prose prose-gray">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About This Guide
            </h2>
            <p className="text-muted-foreground">
              This guide to {guide.title.toLowerCase()} is updated regularly to ensure you have access to the best
              local options. Our rankings are based on customer reviews, ratings, and local popularity.
              Whether you're a longtime resident or just visiting the {guide.city || 'Leander'} area,
              these top picks will help you discover great places to visit.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

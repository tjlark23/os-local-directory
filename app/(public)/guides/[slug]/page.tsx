import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MapPin, ArrowRight, ArrowLeft } from 'lucide-react'
import { getAllGuides, getGuideBySlug, type GuideConfig } from '@/lib/guides-config'
import { CATEGORY_DISPLAY_NAMES } from '@/lib/slugify'
import { CITIES } from '@/lib/locations-config'

// Generate static params for all guides
export async function generateStaticParams() {
  return getAllGuides().map(guide => ({
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
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return {
      title: 'Guide Not Found | WilCo Guide',
      description: 'The guide you are looking for does not exist.',
    }
  }

  const year = new Date().getFullYear()
  const cityName = guide.city?.name || 'the area'

  return {
    title: `${guide.title} ${year} | WilCo Guide`,
    description: guide.description,
    keywords: [
      guide.title.toLowerCase(),
      `${guide.category} ${cityName.toLowerCase()} tx`,
      `best ${guide.category} near me`,
      `top rated ${guide.category} texas`,
      ...(guide.tags || []).map(t => `${t} ${cityName.toLowerCase()}`),
    ],
    openGraph: {
      title: `${guide.title} ${year}`,
      description: guide.description,
      type: 'article',
      url: `https://wilcoguide.com/guides/${slug}`,
    },
    alternates: {
      canonical: `https://wilcoguide.com/guides/${slug}`,
    },
  }
}

async function getBusinessesForGuide(guide: GuideConfig) {
  // Get location ID for Leander (our data source)
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
    query = query.ilike('address_city', guide.city.name)
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

export default async function GuidePage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  const businesses = await getBusinessesForGuide(guide)
  const year = new Date().getFullYear()
  const cityName = guide.city?.name || 'the Area'
  const categoryDisplay = CATEGORY_DISPLAY_NAMES[guide.category] || guide.category

  // Get related guides in same city
  const relatedGuides = getAllGuides()
    .filter(g => g.city?.slug === guide.city?.slug && g.slug !== guide.slug)
    .slice(0, 4)

  // Get same category in other cities
  const sameCategoryOtherCities = getAllGuides()
    .filter(g => g.category === guide.category && g.city?.slug !== guide.city?.slug && g.city?.hasData)
    .slice(0, 4)

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${guide.title} ${year}`,
    description: guide.description,
    author: {
      '@type': 'Organization',
      name: 'WilCo Guide',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WilCo Guide',
      url: 'https://wilcoguide.com',
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
              <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
              <span>/</span>
              {guide.city && (
                <>
                  <Link href={`/neighborhoods/${guide.city.slug}`} className="hover:text-foreground transition-colors">
                    {guide.city.name}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground">{categoryDisplay}</span>
            </nav>

            {/* Back Link */}
            <Link href="/guides" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Guides
            </Link>

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
            {businesses.map((business, index) => (
              <Card
                key={business.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Rank Number */}
                    <div className="flex md:flex-col items-center justify-center p-4 md:p-6 bg-muted/50">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                        <span className="text-xl font-bold">{index + 1}</span>
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
                        {business.description || `${business.name} is a popular ${categoryDisplay.toLowerCase()} destination in ${business.address_city}.`}
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
            ))}
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

          {/* Related Guides Section */}
          {relatedGuides.length > 0 && (
            <div className="max-w-4xl mx-auto mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                More Guides in {cityName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedGuides.map((related) => (
                  <Link key={related.slug} href={`/guides/${related.slug}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">
                          {related.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {related.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Same Category in Other Cities */}
          {sameCategoryOtherCities.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {categoryDisplay} in Other Cities
              </h2>
              <div className="flex flex-wrap gap-3">
                {sameCategoryOtherCities.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/guides/${related.slug}`}
                    className="px-4 py-2 bg-card border rounded-full text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {related.city?.name}
                  </Link>
                ))}
              </div>
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
              Whether you're a longtime resident or just visiting the {cityName} area,
              these top picks will help you discover great places to visit.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BusinessCardVertical } from '@/components/business-card-vertical'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Building2 } from 'lucide-react'
import { getAllNeighborhoods, getCityByName, type NeighborhoodItem } from '@/lib/locations-config'

// Get all neighborhoods from centralized config
const NEIGHBORHOODS = getAllNeighborhoods()

// Generate static params for all neighborhoods
export async function generateStaticParams() {
  return NEIGHBORHOODS.map(n => ({
    slug: n.slug,
  }))
}

// Helper to get neighborhood from slug
function getNeighborhoodFromSlug(slug: string): NeighborhoodItem | null {
  return NEIGHBORHOODS.find(n => n.slug === slug) || null
}

// Check if a city has data
function cityHasData(cityName: string): boolean {
  const city = getCityByName(cityName)
  return city?.hasData ?? false
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const neighborhood = getNeighborhoodFromSlug(slug)

  if (!neighborhood) {
    return {
      title: 'Neighborhood Not Found | WilCo Guide',
      description: 'The neighborhood you are looking for does not exist.',
    }
  }

  const year = new Date().getFullYear()
  const isSubdivision = neighborhood.type === 'subdivision'
  const locationContext = isSubdivision
    ? `${neighborhood.displayName} in ${neighborhood.parentCity}`
    : neighborhood.displayName

  return {
    title: `${locationContext} Businesses | Local Directory ${year} | WilCo Guide`,
    description: `Discover local businesses near ${locationContext}, ${neighborhood.state}. Find restaurants, services, and more with reviews, photos, and contact information.`,
    keywords: [
      `${neighborhood.displayName.toLowerCase()} businesses`,
      `${neighborhood.displayName.toLowerCase()} ${neighborhood.city.toLowerCase()}`,
      `businesses near ${neighborhood.displayName.toLowerCase()}`,
      `${neighborhood.displayName.toLowerCase()} texas`,
      `local businesses ${neighborhood.displayName.toLowerCase()}`,
      ...(isSubdivision ? [`${neighborhood.parentCity?.toLowerCase()} neighborhoods`] : []),
    ],
    openGraph: {
      title: `${locationContext} Businesses | WilCo Guide Directory`,
      description: `Find the best local businesses near ${locationContext}, ${neighborhood.state}.`,
      type: 'website',
      url: `https://wilcoguide.com/neighborhoods/${slug}`,
    },
    alternates: {
      canonical: `https://wilcoguide.com/neighborhoods/${slug}`,
    },
  }
}

async function getBusinessesByCity(city: string) {
  // Get location ID for Leander
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return []

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('location_id', location.id)
    .ilike('address_city', city)
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return businesses || []
}

export default async function NeighborhoodPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const neighborhood = getNeighborhoodFromSlug(slug)

  if (!neighborhood) {
    notFound()
  }

  const businesses = await getBusinessesByCity(neighborhood.city)
  const year = new Date().getFullYear()
  const isSubdivision = neighborhood.type === 'subdivision'
  const hasData = cityHasData(neighborhood.city)
  const locationContext = isSubdivision
    ? `${neighborhood.displayName} in ${neighborhood.parentCity}`
    : neighborhood.displayName

  // JSON-LD Schema for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${neighborhood.displayName} Businesses`,
    description: `Local businesses in ${neighborhood.displayName}, ${neighborhood.state}.`,
    url: `https://wilcoguide.com/neighborhoods/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: businesses.slice(0, 10).map((biz, index) => ({
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
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">{neighborhood.displayName}</span>
          </nav>

          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                    {isSubdivision ? `${neighborhood.displayName}` : `${neighborhood.displayName} Businesses`}
                  </h1>
                  {!hasData && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Coming Soon
                    </Badge>
                  )}
                </div>
                {isSubdivision && (
                  <p className="text-lg text-primary font-medium mt-1">
                    {neighborhood.parentCity}, Texas
                  </p>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {isSubdivision ? (
                <>
                  Looking for businesses near {neighborhood.displayName}?
                  {businesses.length > 0 ? (
                    <>Browse {businesses.length} local businesses serving the {neighborhood.displayName} neighborhood in {neighborhood.parentCity}, TX.</>
                  ) : (
                    <>We're currently adding businesses serving the {neighborhood.displayName} neighborhood. Check back soon!</>
                  )}
                </>
              ) : (
                <>
                  {businesses.length > 0 ? (
                    <>Discover {businesses.length} local businesses in {neighborhood.displayName}, {neighborhood.state}. Find restaurants, services, and more with reviews, photos, and contact information.</>
                  ) : (
                    <>We're expanding to {neighborhood.displayName}, {neighborhood.state}! Business listings for this area are coming soon. Subscribe to be notified when we launch.</>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Results Count / Coming Soon Banner */}
          {businesses.length > 0 ? (
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{businesses.length}</span> businesses in {neighborhood.displayName}
              </p>
              <Button variant="outline" asChild>
                <Link href="/search">Search All</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {neighborhood.displayName} Directory Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We're actively adding local businesses in {neighborhood.displayName} to our directory.
                    In the meantime, browse businesses in nearby areas like Leander, Cedar Park, and Liberty Hill.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href="/neighborhoods/leander-tx">Browse Leander</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/neighborhoods/cedar-park-tx">Browse Cedar Park</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/search">Search All</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Grid */}
          {businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCardVertical
                  key={business.id}
                  business={{
                    id: business.id,
                    slug: business.slug,
                    name: business.name,
                    description: business.description || '',
                    category: business.category,
                    image: business.image || '',
                    address_city: business.address_city,
                    address_state: business.address_state,
                    rating: business.rating,
                    review_count: business.review_count,
                    is_featured: business.is_featured,
                  }}
                />
              ))}
            </div>
          )}

          {/* Other Neighborhoods - Group by type */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Explore Other Areas</h2>

            {/* Cities */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Cities</h3>
              <div className="flex flex-wrap gap-3">
                {NEIGHBORHOODS.filter(n => n.type === 'city' && n.slug !== slug).map((n) => {
                  const nHasData = cityHasData(n.city)
                  return (
                    <Link
                      key={n.slug}
                      href={`/neighborhoods/${n.slug}`}
                      className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                        nHasData
                          ? 'bg-card hover:bg-muted'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {n.displayName}
                      {!nHasData && <span className="ml-1 text-xs">(Soon)</span>}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Subdivisions */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Neighborhoods</h3>
              <div className="flex flex-wrap gap-3">
                {NEIGHBORHOODS.filter(n => n.type === 'subdivision' && n.slug !== slug).slice(0, 20).map((n) => (
                  <Link
                    key={n.slug}
                    href={`/neighborhoods/${n.slug}`}
                    className="px-4 py-2 bg-card border rounded-full text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {n.displayName}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {neighborhood.displayName}
            </h2>
            <p className="text-muted-foreground">
              {isSubdivision ? (
                <>
                  {neighborhood.displayName} is a popular neighborhood in {neighborhood.parentCity}, Texas,
                  part of the growing Austin metro area. Residents of {neighborhood.displayName}
                  enjoy easy access to local restaurants, shops, and services. Our directory makes it easy
                  to discover businesses serving the {neighborhood.displayName} community.
                </>
              ) : (
                <>
                  {neighborhood.displayName} is a vibrant community in the greater Austin, Texas area.
                  Our directory features verified local businesses including restaurants, professional services,
                  health & wellness providers, and more. Whether you're a resident or visitor, WilCo Guide
                  makes it easy to find and support local businesses in {neighborhood.displayName}.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

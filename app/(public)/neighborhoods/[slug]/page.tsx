import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BusinessCardVertical } from '@/components/business-card-vertical'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin } from 'lucide-react'

// City/neighborhood data
const NEIGHBORHOODS = [
  { slug: 'cedar-park-tx', city: 'Cedar Park', displayName: 'Cedar Park', state: 'TX' },
  { slug: 'leander-tx', city: 'Leander', displayName: 'Leander', state: 'TX' },
  { slug: 'liberty-hill-tx', city: 'Liberty Hill', displayName: 'Liberty Hill', state: 'TX' },
  { slug: 'austin-tx', city: 'Austin', displayName: 'Austin', state: 'TX' },
  { slug: 'georgetown-tx', city: 'Georgetown', displayName: 'Georgetown', state: 'TX' },
]

// Generate static params for all neighborhoods
export async function generateStaticParams() {
  return NEIGHBORHOODS.map(n => ({
    slug: n.slug,
  }))
}

// Helper to get neighborhood from slug
function getNeighborhoodFromSlug(slug: string) {
  return NEIGHBORHOODS.find(n => n.slug === slug) || null
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
      title: 'Neighborhood Not Found | Leander Scoop',
      description: 'The neighborhood you are looking for does not exist.',
    }
  }

  const year = new Date().getFullYear()

  return {
    title: `${neighborhood.displayName} Businesses | Local Directory ${year} | Leander Scoop`,
    description: `Discover local businesses in ${neighborhood.displayName}, ${neighborhood.state}. Find restaurants, services, and more with reviews, photos, and contact information.`,
    keywords: [
      `${neighborhood.displayName.toLowerCase()} businesses`,
      `${neighborhood.displayName.toLowerCase()} directory`,
      `businesses in ${neighborhood.displayName.toLowerCase()}`,
      `${neighborhood.displayName.toLowerCase()} texas`,
      `local businesses ${neighborhood.displayName.toLowerCase()}`,
    ],
    openGraph: {
      title: `${neighborhood.displayName} Businesses | Leander Scoop Directory`,
      description: `Find the best local businesses in ${neighborhood.displayName}, ${neighborhood.state}.`,
      type: 'website',
      url: `https://directory.leanderscoop.com/neighborhoods/${slug}`,
    },
    alternates: {
      canonical: `https://directory.leanderscoop.com/neighborhoods/${slug}`,
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

  // JSON-LD Schema for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${neighborhood.displayName} Businesses`,
    description: `Local businesses in ${neighborhood.displayName}, ${neighborhood.state}.`,
    url: `https://directory.leanderscoop.com/neighborhoods/${slug}`,
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                {neighborhood.displayName} Businesses
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Discover {businesses.length} local businesses in {neighborhood.displayName}, {neighborhood.state}.
              Find restaurants, services, and more with reviews, photos, and contact information.
            </p>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{businesses.length}</span> businesses in {neighborhood.displayName}
            </p>
            <Button variant="outline" asChild>
              <Link href="/search">Search All</Link>
            </Button>
          </div>

          {/* Business Grid */}
          {businesses.length > 0 ? (
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
          ) : (
            <div className="text-center py-16 bg-background rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-2">No businesses found</h3>
              <p className="text-muted-foreground mb-6">
                We don't have any businesses listed in {neighborhood.displayName} yet.
              </p>
              <Button asChild>
                <Link href="/search">Browse All Businesses</Link>
              </Button>
            </div>
          )}

          {/* Other Neighborhoods */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Explore Other Areas</h2>
            <div className="flex flex-wrap gap-3">
              {NEIGHBORHOODS.filter(n => n.slug !== slug).map((n) => (
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

          {/* SEO Content Section */}
          <div className="mt-16 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {neighborhood.displayName}
            </h2>
            <p className="text-muted-foreground">
              {neighborhood.displayName} is a vibrant community in the greater Leander, Texas area.
              Our directory features verified local businesses including restaurants, professional services,
              health & wellness providers, and more. Whether you're a resident or visitor, Leander Scoop
              makes it easy to find and support local businesses in {neighborhood.displayName}.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

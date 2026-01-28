import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { unslugify, CATEGORY_DISPLAY_NAMES, DB_CATEGORIES } from '@/lib/slugify'
import { BusinessCardVertical } from '@/components/business-card-vertical'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Building2 } from 'lucide-react'
import { CITIES, getCityBySlug, type CityConfig } from '@/lib/locations-config'

// Generate static params for all category+city combinations
export async function generateStaticParams() {
  const params: { slug: string }[] = []

  for (const city of CITIES) {
    for (const category of DB_CATEGORIES) {
      params.push({
        slug: `${category}-${city.slug}`,
      })
    }
  }

  return params
}

// Helper to parse category slug into category and city
function parseCategorySlug(slug: string): { category: string; city: CityConfig } | null {
  for (const city of CITIES) {
    if (slug.endsWith(`-${city.slug}`)) {
      const categoryPart = slug.replace(`-${city.slug}`, '')
      if (DB_CATEGORIES.includes(categoryPart)) {
        return { category: categoryPart, city }
      }
    }
  }
  return null
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseCategorySlug(slug)

  if (!parsed) {
    return {
      title: 'Category Not Found | Leander Scoop',
      description: 'The category you are looking for does not exist.',
    }
  }

  const { category, city } = parsed
  const displayName = CATEGORY_DISPLAY_NAMES[category] || unslugify(category)
  const year = new Date().getFullYear()

  return {
    title: `Best ${displayName} in ${city.name}, TX ${year} | Leander Scoop Directory`,
    description: `Discover the top ${displayName.toLowerCase()} in ${city.name}, Texas. Verified reviews, photos, hours, and contact information for local businesses.`,
    keywords: [
      `${displayName.toLowerCase()} ${city.name.toLowerCase()} tx`,
      `best ${displayName.toLowerCase()} ${city.name.toLowerCase()}`,
      `${displayName.toLowerCase()} near me ${city.name.toLowerCase()}`,
      `local ${displayName.toLowerCase()} ${city.name.toLowerCase()} texas`,
      `top ${displayName.toLowerCase()} ${city.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Best ${displayName} in ${city.name}, TX ${year}`,
      description: `Find top-rated ${displayName.toLowerCase()} in ${city.name}, Texas with reviews and ratings.`,
      type: 'website',
      url: `https://directory.leanderscoop.com/categories/${slug}`,
    },
    alternates: {
      canonical: `https://directory.leanderscoop.com/categories/${slug}`,
    },
  }
}

async function getBusinessesByCategory(category: string, cityName: string) {
  // Get location ID for Leander (our data source)
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  if (!location) return []

  // Build the query
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('location_id', location.id)
    .eq('category', category)

  // For cities with data, filter by city name
  const cityConfig = CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase())
  if (cityConfig?.hasData) {
    query = query.ilike('address_city', cityName)
  }

  const { data: businesses, error } = await query
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  // Dedupe by name
  const uniqueBusinesses: typeof businesses = []
  const seenNames = new Set<string>()

  for (const biz of businesses || []) {
    const normalizedName = biz.name.toLowerCase().trim()
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName)
      uniqueBusinesses.push(biz)
    }
  }

  return uniqueBusinesses
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const parsed = parseCategorySlug(slug)

  if (!parsed) {
    notFound()
  }

  const { category, city } = parsed
  const businesses = city.hasData ? await getBusinessesByCategory(category, city.name) : []
  const displayName = CATEGORY_DISPLAY_NAMES[category] || unslugify(category)
  const year = new Date().getFullYear()

  // JSON-LD Schema for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${displayName} in ${city.name}, TX ${year}`,
    description: `Top-rated ${displayName.toLowerCase()} in ${city.name}, Texas.`,
    url: `https://directory.leanderscoop.com/categories/${slug}`,
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

  // Get other cities for cross-linking
  const otherCities = CITIES.filter(c => c.slug !== city.slug).slice(0, 6)

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
            <Link href={`/neighborhoods/${city.slug}`} className="hover:text-foreground transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-foreground">{displayName}</span>
          </nav>

          {/* Back Button */}
          <Link href="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to All Businesses
          </Link>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Best {displayName} in {city.name}, TX {year}
              </h1>
              {!city.hasData && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Coming Soon
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span>{city.fullName} • {city.region}</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {city.hasData && businesses.length > 0 ? (
                <>Discover {businesses.length} top-rated {displayName.toLowerCase()} in {city.name}, Texas. Compare reviews, photos, hours, and contact information to find your perfect match.</>
              ) : city.hasData ? (
                <>We're adding {displayName.toLowerCase()} in {city.name}, Texas to our directory. Check back soon or browse nearby cities.</>
              ) : (
                <>We're expanding to {city.name}, Texas! {displayName} listings for this area are coming soon. Browse businesses in nearby cities while you wait.</>
              )}
            </p>
          </div>

          {/* Results Count / Coming Soon Banner */}
          {city.hasData && businesses.length > 0 ? (
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{businesses.length}</span> businesses in {city.name}
              </p>
              <Button variant="outline" asChild>
                <Link href="/search">View All Categories</Link>
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
                    {displayName} in {city.name} Coming Soon
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We're actively adding {displayName.toLowerCase()} in {city.name} to our directory.
                    In the meantime, browse {displayName.toLowerCase()} in nearby areas.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={`/categories/${category}-leander-tx`}>Browse Leander</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/categories/${category}-cedar-park-tx`}>Browse Cedar Park</Link>
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

          {/* Browse Same Category in Other Cities */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {displayName} in Other Cities
            </h2>
            <div className="flex flex-wrap gap-3">
              {otherCities.map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  href={`/categories/${category}-${otherCity.slug}`}
                  className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                    otherCity.hasData
                      ? 'bg-card hover:bg-muted'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {displayName} in {otherCity.name}
                  {!otherCity.hasData && <span className="ml-1 text-xs">(Soon)</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Browse Other Categories in This City */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Other Categories in {city.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {DB_CATEGORIES.filter(c => c !== category).slice(0, 8).map((otherCategory) => {
                const otherDisplayName = CATEGORY_DISPLAY_NAMES[otherCategory] || unslugify(otherCategory)
                return (
                  <Link
                    key={otherCategory}
                    href={`/categories/${otherCategory}-${city.slug}`}
                    className="px-4 py-2 bg-card border rounded-full text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {otherDisplayName}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Find the Best {displayName} in {city.name}
            </h2>
            <p className="text-muted-foreground">
              Looking for {displayName.toLowerCase()} in {city.name}, Texas? Leander Scoop Directory is your trusted source
              for finding top-rated local businesses. Our directory features verified reviews, photos, business hours,
              and contact information to help you make the best choice. Whether you're a longtime resident or new to
              the {city.region} area, we make it easy to discover great {displayName.toLowerCase()} in {city.name} and
              surrounding communities.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

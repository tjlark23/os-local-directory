import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { slugifyCategory, unslugify, CATEGORY_DISPLAY_NAMES, DB_CATEGORIES } from '@/lib/slugify'
import { BusinessCardVertical } from '@/components/business-card-vertical'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

// Generate static params for all categories
export async function generateStaticParams() {
  return DB_CATEGORIES.map(category => ({
    slug: slugifyCategory(category),
  }))
}

// Helper to convert slug back to database category
function getCategoryFromSlug(slug: string): string | null {
  const slugWithoutLocation = slug.replace(/-leander-tx$/i, '')

  for (const category of DB_CATEGORIES) {
    const categorySlug = slugifyCategory(category).replace(/-leander-tx$/i, '')
    if (categorySlug === slugWithoutLocation) {
      return category
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
  const category = getCategoryFromSlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found | Leander Scoop',
      description: 'The category you are looking for does not exist.',
    }
  }

  const displayName = CATEGORY_DISPLAY_NAMES[category] || unslugify(slug)
  const year = new Date().getFullYear()

  return {
    title: `Best ${displayName} in Leander, TX ${year} | Leander Scoop Directory`,
    description: `Discover the top ${displayName.toLowerCase()} in Leander, Cedar Park, and Liberty Hill, Texas. Verified reviews, photos, hours, and contact information for local businesses.`,
    keywords: [
      `${displayName.toLowerCase()} leander tx`,
      `${displayName.toLowerCase()} cedar park tx`,
      `${displayName.toLowerCase()} liberty hill tx`,
      `best ${displayName.toLowerCase()} near me`,
      `local ${displayName.toLowerCase()} texas`,
    ],
    openGraph: {
      title: `Best ${displayName} in Leander, TX ${year}`,
      description: `Find top-rated ${displayName.toLowerCase()} in Leander, Texas with reviews and ratings.`,
      type: 'website',
      url: `https://directory.leanderscoop.com/categories/${slug}`,
    },
    alternates: {
      canonical: `https://directory.leanderscoop.com/categories/${slug}`,
    },
  }
}

async function getBusinessesByCategory(category: string) {
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
    .eq('category', category)
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
  const category = getCategoryFromSlug(slug)

  if (!category) {
    notFound()
  }

  const businesses = await getBusinessesByCategory(category)
  const displayName = CATEGORY_DISPLAY_NAMES[category] || unslugify(slug)
  const year = new Date().getFullYear()

  // JSON-LD Schema for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${displayName} in Leander, TX ${year}`,
    description: `Top-rated ${displayName.toLowerCase()} in Leander, Cedar Park, and Liberty Hill, Texas.`,
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
            <Link href="/search" className="hover:text-foreground transition-colors">Categories</Link>
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Best {displayName} in Leander, TX {year}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Discover {businesses.length} top-rated {displayName.toLowerCase()} in Leander, Cedar Park, and Liberty Hill, Texas.
              Compare reviews, photos, hours, and contact information to find your perfect match.
            </p>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{businesses.length}</span> businesses
            </p>
            <Button variant="outline" asChild>
              <Link href="/search">View All Categories</Link>
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
                We don't have any {displayName.toLowerCase()} listed yet.
              </p>
              <Button asChild>
                <Link href="/search">Browse All Businesses</Link>
              </Button>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="mt-16 prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Find the Best {displayName} Near You
            </h2>
            <p className="text-muted-foreground">
              Looking for {displayName.toLowerCase()} in Leander, Texas? Leander Scoop Directory is your trusted source
              for finding top-rated local businesses. Our directory features verified reviews, photos, business hours,
              and contact information to help you make the best choice. Whether you're a longtime resident or new to
              the area, we make it easy to discover great {displayName.toLowerCase()} in Leander, Cedar Park, and
              Liberty Hill.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

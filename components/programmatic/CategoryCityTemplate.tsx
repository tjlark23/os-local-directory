/**
 * CategoryCityTemplate - Programmatic SEO Page Template
 *
 * This component generates unique, data-driven pages for each category+city combination.
 * Each page includes:
 * - Unique intro paragraph based on actual stats
 * - Key stats (business count, reviews, avg rating)
 * - Top picks section with reasoning
 * - Pricing breakdown
 * - Full business listing
 * - Related links to other cities/categories
 *
 * CRITICAL: Each page MUST have unique value - not just variable swaps
 */

import Link from 'next/link'
import { BusinessCardVertical } from '@/components/business-card-vertical'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  MapPin,
  Building2,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Award,
  ChevronRight,
  Phone,
  Globe,
} from 'lucide-react'
import type { AggregatedStats, TopBusiness } from './DataAggregator'
import type { CityConfig } from '@/lib/locations-config'
import { CITIES } from '@/lib/locations-config'

// ============================================================
// TYPES
// ============================================================

export interface CategoryCityTemplateProps {
  category: string
  categoryDisplay: string
  city: CityConfig
  stats: AggregatedStats
  businesses: BusinessForCard[]
  uniqueContent: {
    title: string
    h1: string
    intro: string
    valueProps: string[]
    facts: string[]
    comparisonContext: string
  }
}

export interface BusinessForCard {
  id: string
  slug: string
  name: string
  description: string
  category: string
  image: string
  address_city: string
  address_state: string
  rating: number
  review_count: number
  is_featured: boolean
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function CategoryCityTemplate({
  category,
  categoryDisplay,
  city,
  stats,
  businesses,
  uniqueContent,
}: CategoryCityTemplateProps) {
  const year = new Date().getFullYear()
  const hasData = stats.totalBusinesses > 0
  const otherCities = CITIES.filter(c => c.slug !== city.slug).slice(0, 6)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs category={category} categoryDisplay={categoryDisplay} city={city} />

        {/* Hero Section */}
        <HeroSection
          h1={uniqueContent.h1}
          city={city}
          intro={uniqueContent.intro}
          hasData={hasData}
        />

        {/* Stats Bar - Only if we have data */}
        {hasData && (
          <StatsBar stats={stats} categoryDisplay={categoryDisplay} city={city} />
        )}

        {/* Value Propositions */}
        {uniqueContent.valueProps.length > 0 && (
          <ValuePropositions props={uniqueContent.valueProps} />
        )}

        {/* Top Picks Section */}
        {stats.topRatedBusinesses.length > 0 && (
          <TopPicksSection
            topRated={stats.topRatedBusinesses}
            mostReviewed={stats.mostReviewedBusinesses}
            categoryDisplay={categoryDisplay}
            city={city}
          />
        )}

        {/* Pricing Breakdown */}
        {hasData && (
          <PricingBreakdown
            distribution={stats.pricingDistribution}
            context={uniqueContent.comparisonContext}
            categoryDisplay={categoryDisplay}
          />
        )}

        {/* Coming Soon Banner - for cities without data */}
        {!hasData && (
          <ComingSoonBanner
            categoryDisplay={categoryDisplay}
            city={city}
            category={category}
          />
        )}

        {/* Full Business Listing */}
        {businesses.length > 0 && (
          <BusinessListing
            businesses={businesses}
            totalCount={stats.totalBusinesses}
            city={city}
          />
        )}

        {/* Related Links - Same Category in Other Cities */}
        <RelatedCityLinks
          category={category}
          categoryDisplay={categoryDisplay}
          currentCity={city}
          otherCities={otherCities}
        />

        {/* Related Links - Other Categories in Same City */}
        <RelatedCategoryLinks
          city={city}
          currentCategory={category}
        />

        {/* Unique Facts Section (SEO Content) */}
        {uniqueContent.facts.length > 0 && (
          <UniqueFacts
            facts={uniqueContent.facts}
            categoryDisplay={categoryDisplay}
            city={city}
          />
        )}

        {/* FAQ Section */}
        {hasData && (
          <FAQSection
            stats={stats}
            categoryDisplay={categoryDisplay}
            city={city}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Breadcrumbs({
  category,
  categoryDisplay,
  city,
}: {
  category: string
  categoryDisplay: string
  city: CityConfig
}) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href={`/neighborhoods/${city.slug}`} className="hover:text-foreground transition-colors">
        {city.name}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground">{categoryDisplay}</span>
    </nav>
  )
}

function HeroSection({
  h1,
  city,
  intro,
  hasData,
}: {
  h1: string
  city: CityConfig
  intro: string
  hasData: boolean
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          {h1}
        </h1>
        {!hasData && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Coming Soon
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <MapPin className="w-4 h-4" />
        <span>{city.fullName} &bull; {city.region}</span>
      </div>
      <p className="text-lg text-muted-foreground max-w-3xl">
        {intro}
      </p>
    </div>
  )
}

function StatsBar({
  stats,
  categoryDisplay,
  city,
}: {
  stats: AggregatedStats
  categoryDisplay: string
  city: CityConfig
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={<Building2 className="w-5 h-5" />}
        label="Total Businesses"
        value={stats.totalBusinesses.toString()}
        subtext={`in ${city.name}`}
      />
      <StatCard
        icon={<MessageSquare className="w-5 h-5" />}
        label="Total Reviews"
        value={stats.totalReviews.toLocaleString()}
        subtext="verified reviews"
      />
      <StatCard
        icon={<Star className="w-5 h-5 text-yellow-500" />}
        label="Average Rating"
        value={stats.averageRating.toFixed(1)}
        subtext="out of 5 stars"
      />
      <StatCard
        icon={<TrendingUp className="w-5 h-5" />}
        label="Top Rated"
        value={stats.highestRating.toFixed(1)}
        subtext="highest rating"
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  )
}

function ValuePropositions({ props }: { props: string[] }) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Why Browse with WilCo Guide?
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {props.map((prop, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-xs font-bold">{'\u2713'}</span>
            </div>
            <span className="text-muted-foreground">{prop}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TopPicksSection({
  topRated,
  mostReviewed,
  categoryDisplay,
  city,
}: {
  topRated: TopBusiness[]
  mostReviewed: TopBusiness[]
  categoryDisplay: string
  city: CityConfig
}) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Top Picks in {city.name}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Rated */}
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-foreground">Highest Rated</h3>
          </div>
          <div className="space-y-3">
            {topRated.slice(0, 3).map((biz, index) => (
              <TopPickCard key={biz.id} business={biz} rank={index + 1} />
            ))}
          </div>
        </div>

        {/* Most Reviewed */}
        <div className="bg-card border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-foreground">Most Popular</h3>
          </div>
          <div className="space-y-3">
            {mostReviewed.slice(0, 3).map((biz, index) => (
              <TopPickCard key={biz.id} business={biz} rank={index + 1} showReviews />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TopPickCard({
  business,
  rank,
  showReviews = false,
}: {
  business: TopBusiness
  rank: number
  showReviews?: boolean
}) {
  return (
    <Link
      href={`/business/${business.slug}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-sm text-muted-foreground">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{business.name}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span>{business.rating.toFixed(1)}</span>
          {showReviews && (
            <span className="text-xs">({business.reviewCount} reviews)</span>
          )}
          {business.priceRange && (
            <span className="text-xs">&bull; {business.priceRange}</span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </Link>
  )
}

function PricingBreakdown({
  distribution,
  context,
  categoryDisplay,
}: {
  distribution: AggregatedStats['pricingDistribution']
  context: string
  categoryDisplay: string
}) {
  const total = distribution['$'] + distribution['$$'] + distribution['$$$'] + distribution['$$$$']
  if (total === 0) return null

  const priceRanges = [
    { label: '$', count: distribution['$'], description: 'Budget-friendly' },
    { label: '$$', count: distribution['$$'], description: 'Moderate' },
    { label: '$$$', count: distribution['$$$'], description: 'Upscale' },
    { label: '$$$$', count: distribution['$$$$'], description: 'Premium' },
  ].filter(p => p.count > 0)

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Pricing Overview
      </h2>
      <div className="bg-card border rounded-lg p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {priceRanges.map((range) => (
            <div key={range.label} className="text-center">
              <p className="text-2xl font-bold text-foreground">{range.count}</p>
              <p className="text-lg font-medium text-primary">{range.label}</p>
              <p className="text-xs text-muted-foreground">{range.description}</p>
            </div>
          ))}
        </div>
        {context && (
          <p className="text-sm text-muted-foreground border-t pt-4 mt-4">
            {context}
          </p>
        )}
      </div>
    </div>
  )
}

function ComingSoonBanner({
  categoryDisplay,
  city,
  category,
}: {
  categoryDisplay: string
  city: CityConfig
  category: string
}) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {categoryDisplay} in {city.name} Coming Soon
          </h3>
          <p className="text-muted-foreground mb-4">
            We're actively adding {categoryDisplay.toLowerCase()} in {city.name} to our directory.
            In the meantime, browse {categoryDisplay.toLowerCase()} in nearby areas.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${category}/leander-tx`}>Browse Leander</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${category}/cedar-park-tx`}>Browse Cedar Park</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">Search All</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BusinessListing({
  businesses,
  totalCount,
  city,
}: {
  businesses: BusinessForCard[]
  totalCount: number
  city: CityConfig
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          All Businesses ({totalCount})
        </h2>
        <Button variant="outline" asChild>
          <Link href="/search">View All Categories</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessCardVertical
            key={business.id}
            business={business}
          />
        ))}
      </div>
    </div>
  )
}

function RelatedCityLinks({
  category,
  categoryDisplay,
  currentCity,
  otherCities,
}: {
  category: string
  categoryDisplay: string
  currentCity: CityConfig
  otherCities: CityConfig[]
}) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {categoryDisplay} in Other Cities
      </h2>
      <div className="flex flex-wrap gap-3">
        {otherCities.map((otherCity) => (
          <Link
            key={otherCity.slug}
            href={`/${category}/${otherCity.slug}`}
            className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
              otherCity.hasData
                ? 'bg-card hover:bg-muted'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {categoryDisplay} in {otherCity.name}
            {!otherCity.hasData && <span className="ml-1 text-xs">(Soon)</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

function RelatedCategoryLinks({
  city,
  currentCategory,
}: {
  city: CityConfig
  currentCategory: string
}) {
  const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
    'restaurants': 'Restaurants',
    'health': 'Health & Wellness',
    'beauty': 'Beauty & Spa',
    'fitness': 'Fitness & Sports',
    'automotive': 'Auto Services',
    'shopping': 'Shopping & Retail',
    'services': 'Professional Services',
    'education': 'Education',
    'pets': 'Pets & Animals',
    'financial': 'Financial Services',
    'home': 'Home Services',
    'entertainment': 'Entertainment',
  }

  const categories = Object.keys(CATEGORY_DISPLAY_NAMES).filter(c => c !== currentCategory)

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Other Categories in {city.name}
      </h2>
      <div className="flex flex-wrap gap-3">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat}
            href={`/${cat}/${city.slug}`}
            className="px-4 py-2 bg-card border rounded-full text-sm font-medium hover:bg-muted transition-colors"
          >
            {CATEGORY_DISPLAY_NAMES[cat]}
          </Link>
        ))}
      </div>
    </div>
  )
}

function UniqueFacts({
  facts,
  categoryDisplay,
  city,
}: {
  facts: string[]
  categoryDisplay: string
  city: CityConfig
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-6 mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">
        About {categoryDisplay} in {city.name}
      </h2>
      <ul className="space-y-2">
        {facts.map((fact, index) => (
          <li key={index} className="flex items-start gap-2 text-muted-foreground">
            <span className="text-primary font-bold">&bull;</span>
            {fact}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FAQSection({
  stats,
  categoryDisplay,
  city,
}: {
  stats: AggregatedStats
  categoryDisplay: string
  city: CityConfig
}) {
  const categoryLower = categoryDisplay.toLowerCase()
  const cityName = city.name

  const faqs = [
    {
      question: `How many ${categoryLower} are in ${cityName}, TX?`,
      answer: `There are ${stats.totalBusinesses} ${categoryLower} listed in ${cityName}, Texas.`,
    },
  ]

  if (stats.averageRating > 0) {
    faqs.push({
      question: `What's the average rating for ${categoryLower} in ${cityName}?`,
      answer: `The average rating is ${stats.averageRating.toFixed(1)} stars based on ${stats.totalReviews.toLocaleString()} customer reviews.`,
    })
  }

  if (stats.topRatedBusinesses.length > 0) {
    const top = stats.topRatedBusinesses[0]
    faqs.push({
      question: `What's the best rated ${categoryLower.replace(/s$/, '')} in ${cityName}?`,
      answer: `${top.name} has the highest rating at ${top.rating} stars with ${top.reviewCount} reviews.`,
    })
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
            <p className="text-muted-foreground text-sm">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

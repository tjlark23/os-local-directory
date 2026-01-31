/**
 * SEO Utilities for Programmatic Pages
 *
 * Generates:
 * - Unique meta tags per page
 * - Schema markup (LocalBusiness, BreadcrumbList, AggregateRating, ItemList)
 * - Internal linking suggestions
 * - Open Graph tags
 */

import type { AggregatedStats, TopBusiness } from '@/components/programmatic/DataAggregator'
import { CITIES, type CityConfig } from '@/lib/locations-config'

const SITE_URL = 'https://wilcoguide.com'
const SITE_NAME = 'WilCo Guide'

// ============================================================
// META TAG GENERATION
// ============================================================

export interface PageMeta {
  title: string
  description: string
  keywords: string[]
  canonical: string
  openGraph: OpenGraphMeta
}

export interface OpenGraphMeta {
  title: string
  description: string
  url: string
  siteName: string
  type: 'website'
  locale: string
}

/**
 * Generate unique meta tags for a category+city page
 * Ensures titles are under 60 chars, descriptions under 160 chars
 */
export function generatePageMeta(
  category: string,
  categoryDisplay: string,
  city: CityConfig,
  stats: AggregatedStats
): PageMeta {
  const year = new Date().getFullYear()
  const cityName = city.name

  // Title: Best {Category} in {City}, TX {Year}
  // NOTE: Don't include site name here - layout template adds "| WilCo Guide"
  // Max ~45 chars to leave room for " | WilCo Guide" suffix
  let title = `Best ${categoryDisplay} in ${cityName}, TX ${year}`
  if (title.length > 45) {
    title = `${categoryDisplay} in ${cityName}, TX ${year}`
  }
  if (title.length > 45) {
    title = `${categoryDisplay} in ${cityName} ${year}`
  }

  // Description: Unique based on actual data
  // Max 160 chars
  let description: string
  if (stats.totalBusinesses > 0) {
    const reviewPart = stats.totalReviews > 0
      ? `${stats.totalReviews.toLocaleString()} reviews, `
      : ''
    const ratingPart = stats.averageRating > 0
      ? `${stats.averageRating.toFixed(1)}★ avg`
      : ''

    description = `Find ${stats.totalBusinesses} top-rated ${categoryDisplay.toLowerCase()} in ${cityName}, TX. ${reviewPart}${ratingPart}. Hours, photos, contact info.`
  } else {
    description = `Discover the best ${categoryDisplay.toLowerCase()} in ${cityName}, Texas. Verified reviews, photos, and contact information for local businesses.`
  }

  // Truncate if needed
  if (description.length > 160) {
    description = description.substring(0, 157) + '...'
  }

  // Keywords: category-specific for local SEO
  const keywords = generateKeywords(categoryDisplay, cityName)

  // Canonical URL
  const canonical = `${SITE_URL}/${category}/${city.slug}`

  // Open Graph
  const openGraph: OpenGraphMeta = {
    title: `Best ${categoryDisplay} in ${cityName}, TX ${year}`,
    description: description.substring(0, 100),
    url: canonical,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
  }

  return {
    title,
    description,
    keywords,
    canonical,
    openGraph,
  }
}

/**
 * Generate SEO keywords for local business search
 */
function generateKeywords(category: string, city: string): string[] {
  const cityLower = city.toLowerCase()
  const categoryLower = category.toLowerCase()

  return [
    `${categoryLower} ${cityLower} tx`,
    `best ${categoryLower} ${cityLower}`,
    `${categoryLower} near me ${cityLower}`,
    `top ${categoryLower} ${cityLower} texas`,
    `${categoryLower} williamson county`,
    `${cityLower} ${categoryLower}`,
    `local ${categoryLower} ${cityLower}`,
    `${categoryLower} reviews ${cityLower}`,
  ]
}

// ============================================================
// SCHEMA MARKUP GENERATION
// ============================================================

export interface SchemaMarkup {
  breadcrumbList: object
  itemList: object
  collectionPage: object
}

/**
 * Generate complete schema markup for a category+city page
 */
export function generateSchemaMarkup(
  category: string,
  categoryDisplay: string,
  city: CityConfig,
  stats: AggregatedStats
): SchemaMarkup {
  const year = new Date().getFullYear()
  const pageUrl = `${SITE_URL}/${category}/${city.slug}`

  // BreadcrumbList schema
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: city.name,
        item: `${SITE_URL}/neighborhoods/${city.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryDisplay,
        item: pageUrl,
      },
    ],
  }

  // ItemList schema with top businesses
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${categoryDisplay} in ${city.name}, TX`,
    description: `Top-rated ${categoryDisplay.toLowerCase()} in ${city.name}, Texas`,
    numberOfItems: stats.totalBusinesses,
    itemListElement: stats.topRatedBusinesses.slice(0, 10).map((biz, index) =>
      generateLocalBusinessSchema(biz, index + 1)
    ),
  }

  // CollectionPage schema
  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${categoryDisplay} in ${city.name}, TX ${year}`,
    description: `Comprehensive directory of ${categoryDisplay.toLowerCase()} in ${city.name}, Texas`,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      '@type': 'Thing',
      name: `${categoryDisplay} in ${city.name}`,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: stats.topRatedBusinesses.slice(0, 5).map((biz, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'LocalBusiness',
          name: biz.name,
          url: `${SITE_URL}/business/${biz.slug}`,
        },
      })),
    },
    // Aggregate rating for the collection if we have reviews
    ...(stats.totalReviews > 0 && stats.averageRating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: stats.averageRating.toFixed(1),
        reviewCount: stats.totalReviews,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  }

  return {
    breadcrumbList,
    itemList,
    collectionPage,
  }
}

/**
 * Generate LocalBusiness schema for a single business
 */
function generateLocalBusinessSchema(business: TopBusiness, position: number): object {
  const item: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    name: business.name,
    url: `${SITE_URL}/business/${business.slug}`,
  }

  // Add image if available
  if (business.image) {
    item.image = business.image
  }

  // Add address
  const addressParts = business.address.split(',').map(p => p.trim())
  if (addressParts.length >= 2) {
    item.address = {
      '@type': 'PostalAddress',
      streetAddress: addressParts[0] || '',
      addressLocality: business.city,
      addressRegion: 'TX',
      addressCountry: 'US',
    }
  }

  // Add contact info
  if (business.phone) {
    item.telephone = business.phone
  }
  if (business.website) {
    item.url = business.website
  }

  // Add aggregate rating
  if (business.reviewCount > 0 && business.rating > 0) {
    item.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating.toFixed(1),
      reviewCount: business.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Add price range
  if (business.priceRange) {
    item.priceRange = business.priceRange
  }

  return {
    '@type': 'ListItem',
    position,
    item,
  }
}

// ============================================================
// INTERNAL LINKING
// ============================================================

export interface InternalLink {
  href: string
  text: string
  type: 'same-category' | 'same-city' | 'related'
}

/**
 * Generate internal linking suggestions for SEO
 */
export function generateInternalLinks(
  currentCategory: string,
  currentCity: CityConfig,
  allCategories: string[],
  categoryDisplayNames: Record<string, string>
): InternalLink[] {
  const links: InternalLink[] = []

  // Same category in other cities (hub-and-spoke)
  for (const city of CITIES) {
    if (city.slug !== currentCity.slug && city.hasData) {
      links.push({
        href: `/${currentCategory}/${city.slug}`,
        text: `${categoryDisplayNames[currentCategory] || currentCategory} in ${city.name}`,
        type: 'same-category',
      })
    }
  }

  // Other categories in same city
  for (const cat of allCategories) {
    if (cat !== currentCategory) {
      links.push({
        href: `/${cat}/${currentCity.slug}`,
        text: `${categoryDisplayNames[cat] || cat} in ${currentCity.name}`,
        type: 'same-city',
      })
    }
  }

  return links
}

/**
 * Generate hub page links (category-level pages)
 */
export function generateHubLinks(
  currentCategory: string,
  categoryDisplayNames: Record<string, string>
): InternalLink[] {
  const links: InternalLink[] = []

  // Link to category hub
  links.push({
    href: `/search?category=${currentCategory}`,
    text: `All ${categoryDisplayNames[currentCategory] || currentCategory}`,
    type: 'related',
  })

  // Link to city hub
  links.push({
    href: '/search',
    text: 'All Businesses',
    type: 'related',
  })

  return links
}

// ============================================================
// FAQ SCHEMA GENERATION
// ============================================================

export interface FAQItem {
  question: string
  answer: string
}

/**
 * Generate FAQ schema for a category+city page
 * Creates unique questions based on actual data
 */
export function generateFAQSchema(
  categoryDisplay: string,
  city: CityConfig,
  stats: AggregatedStats
): object | null {
  if (stats.totalBusinesses === 0) return null

  const faqs: FAQItem[] = []
  const categoryLower = categoryDisplay.toLowerCase()
  const cityName = city.name

  // Question 1: How many?
  faqs.push({
    question: `How many ${categoryLower} are there in ${cityName}, TX?`,
    answer: `There are ${stats.totalBusinesses} ${categoryLower} listed in ${cityName}, Texas on WilCo Guide.`,
  })

  // Question 2: What's the average rating?
  if (stats.averageRating > 0) {
    faqs.push({
      question: `What is the average rating for ${categoryLower} in ${cityName}?`,
      answer: `${categoryDisplay} in ${cityName} have an average rating of ${stats.averageRating.toFixed(1)} stars based on ${stats.totalReviews.toLocaleString()} customer reviews.`,
    })
  }

  // Question 3: What's the best rated?
  if (stats.topRatedBusinesses.length > 0) {
    const top = stats.topRatedBusinesses[0]
    faqs.push({
      question: `What is the highest rated ${categoryLower.replace(/s$/, '')} in ${cityName}?`,
      answer: `${top.name} is the highest rated with a ${top.rating}-star rating based on ${top.reviewCount} reviews.`,
    })
  }

  // Question 4: Price range
  if (stats.categoryInsights.mostCommonPriceRange !== 'Unknown') {
    faqs.push({
      question: `What is the typical price range for ${categoryLower} in ${cityName}?`,
      answer: `Most ${categoryLower} in ${cityName} fall in the ${stats.categoryInsights.mostCommonPriceRange} price range. ${stats.pricingDistribution['$'] > 0 ? `There are also ${stats.pricingDistribution['$']} budget-friendly ($) options available.` : ''}`,
    })
  }

  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ============================================================
// HELPER EXPORTS
// ============================================================

export const SEO_CONFIG = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  defaultImage: '/images/og-default.jpg',
}

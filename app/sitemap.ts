import type { MetadataRoute } from 'next'
import { slugifyCategory, DB_CATEGORIES } from '@/lib/slugify'

// Base URL for all sitemap entries
const baseUrl = 'https://directory.leanderscoop.com'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-businesses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/business-inquiry`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/upgrade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Category landing pages (SEO-optimized URLs)
  const categoryPages: MetadataRoute.Sitemap = DB_CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${slugifyCategory(category)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }))

  // Neighborhood/city landing pages
  const cityPages: MetadataRoute.Sitemap = [
    { slug: 'cedar-park-tx', priority: 0.8 },
    { slug: 'leander-tx', priority: 0.8 },
    { slug: 'liberty-hill-tx', priority: 0.8 },
    { slug: 'austin-tx', priority: 0.7 },
    { slug: 'georgetown-tx', priority: 0.7 },
  ].map(city => ({
    url: `${baseUrl}/neighborhoods/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: city.priority,
  }))

  // Subdivision pages (neighborhoods within cities)
  const subdivisionPages: MetadataRoute.Sitemap = [
    // Leander Subdivisions
    'crystal-falls-leander-tx',
    'travisso-leander-tx',
    'bryson-leander-tx',
    'vista-ridge-leander-tx',
    'mason-hills-leander-tx',
    'summerlyn-leander-tx',
    'north-creek-leander-tx',
    'benbrook-ranch-leander-tx',
    // Cedar Park Subdivisions
    'buttercup-creek-cedar-park-tx',
    'ranch-at-cypress-creek-cedar-park-tx',
    'cypress-canyon-cedar-park-tx',
    'whitestone-oaks-cedar-park-tx',
    'anderson-mill-west-cedar-park-tx',
    'twin-creeks-cedar-park-tx',
    'carriage-hills-cedar-park-tx',
    // Liberty Hill Subdivisions
    'santa-rita-ranch-liberty-hill-tx',
    'clearwater-ranch-liberty-hill-tx',
    'gabriel-woods-liberty-hill-tx',
  ].map(slug => ({
    url: `${baseUrl}/neighborhoods/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const neighborhoodPages = [...cityPages, ...subdivisionPages]

  // Guide pages (Best Of listicles)
  const guidePages: MetadataRoute.Sitemap = [
    'best-restaurants-leander-tx',
    'best-restaurants-cedar-park-tx',
    'best-restaurants-liberty-hill-tx',
    'best-bbq-leander-cedar-park-tx',
    'best-mexican-food-leander-tx',
    'best-pizza-leander-cedar-park-tx',
    'best-coffee-shops-leander-tx',
    'best-family-restaurants-leander-tx',
  ].map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Guides index page
  const guidesIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  return [...staticPages, ...categoryPages, ...neighborhoodPages, ...guidesIndex, ...guidePages]
}

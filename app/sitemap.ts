import type { MetadataRoute } from 'next'
import { DB_CATEGORIES } from '@/lib/slugify'
import { CITIES, getAllNeighborhoods } from '@/lib/locations-config'
import { getAllGuideSlugs } from '@/lib/guides-config'
import { siteConfig } from '@/lib/site-config'

// Base URL for all sitemap entries
const baseUrl = siteConfig.url

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
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-businesses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
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

  // Category landing pages for ALL cities (SEO-optimized URLs)
  const categoryPages: MetadataRoute.Sitemap = []
  for (const city of CITIES) {
    for (const category of DB_CATEGORIES) {
      categoryPages.push({
        url: `${baseUrl}/categories/${category}-${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: city.hasData ? 0.85 : 0.6,
      })
    }
  }

  // All neighborhoods (cities + subdivisions) from centralized config
  const neighborhoods = getAllNeighborhoods()
  const neighborhoodPages: MetadataRoute.Sitemap = neighborhoods.map(n => ({
    url: `${baseUrl}/neighborhoods/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: n.type === 'city' ? 0.8 : 0.7,
  }))

  // Guide pages from centralized config
  const guideSlugs = getAllGuideSlugs()
  const guidePages: MetadataRoute.Sitemap = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...categoryPages, ...neighborhoodPages, ...guidePages]
}

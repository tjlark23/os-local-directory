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

  // City-filtered search pages
  const cityPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/search?city=Leander`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search?city=Cedar%20Park`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search?city=Liberty%20Hill`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ]

  return [...staticPages, ...categoryPages, ...cityPages]
}

import { MetadataRoute } from "next"
import { getAllBusinesses, CATEGORIES } from "@/lib/data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://directory.leanderscoop.com"
  const businesses = getAllBusinesses()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/business-inquiry`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // Business pages - high priority for SEO
  const businessPages: MetadataRoute.Sitemap = businesses.map((business) => ({
    url: `${baseUrl}/business/${business.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category search pages (for future use)
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/search?category=${category.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  // City search pages
  const cityPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/search?city=Leander`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search?city=Cedar%20Park`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search?city=Liberty%20Hill`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ]

  return [...staticPages, ...businessPages, ...categoryPages, ...cityPages]
}

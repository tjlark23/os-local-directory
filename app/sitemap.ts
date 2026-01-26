import { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"
import { CATEGORIES } from "@/lib/types"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://directory.leanderscoop.com"

  // Get location ID for Leander
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()

  // Fetch all businesses from Supabase
  let businessSlugs: string[] = []
  if (location) {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('slug, last_updated')
      .eq('location_id', location.id)
      .order('name')

    if (businesses) {
      businessSlugs = businesses.map(b => b.slug)
    }
  }

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
    {
      url: `${baseUrl}/upgrade`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // Business pages - high priority for SEO
  const businessPages: MetadataRoute.Sitemap = businessSlugs.map((slug) => ({
    url: `${baseUrl}/business/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category search pages
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

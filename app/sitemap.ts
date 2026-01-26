import { MetadataRoute } from "next"
import { CATEGORIES } from "@/lib/types"

// Sitemap generates dynamically at runtime to fetch business data from Supabase
// Force dynamic generation at runtime (not during build)
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

// Helper to safely create Supabase client only when env vars are available
async function getBusinessSlugsFromSupabase(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase env vars not available, returning empty business list for sitemap')
    return []
  }

  try {
    // Dynamic import to avoid build-time errors
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get location ID for Leander
    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', 'leander')
      .single()

    if (!location) {
      console.log('Leander location not found in database')
      return []
    }

    // Fetch all businesses from Supabase
    const { data: businesses } = await supabase
      .from('businesses')
      .select('slug')
      .eq('location_id', location.id)
      .order('name')

    if (businesses) {
      return businesses.map(b => b.slug)
    }
  } catch (error) {
    console.error('Error fetching businesses for sitemap:', error)
  }

  return []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://directory.leanderscoop.com"

  // Fetch business slugs from Supabase (with error handling)
  const businessSlugs = await getBusinessSlugsFromSupabase()

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

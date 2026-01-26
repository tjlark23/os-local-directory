import { NextResponse } from 'next/server'
import { CATEGORIES } from '@/lib/types'

// Force dynamic generation
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Helper to safely fetch business slugs from Supabase
async function getBusinessSlugsFromSupabase(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase env vars not available for sitemap')
    return []
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', 'leander')
      .single()

    if (!location) return []

    const { data: businesses } = await supabase
      .from('businesses')
      .select('slug')
      .eq('location_id', location.id)
      .order('name')

    return businesses?.map(b => b.slug) || []
  } catch (error) {
    console.error('Error fetching businesses for sitemap:', error)
    return []
  }
}

export async function GET() {
  const baseUrl = 'https://directory.leanderscoop.com'
  const now = new Date().toISOString()

  const businessSlugs = await getBusinessSlugsFromSupabase()

  // Build XML sitemap
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  // Static pages
  const staticPages = [
    { url: baseUrl, changefreq: 'daily', priority: '1' },
    { url: `${baseUrl}/search`, changefreq: 'daily', priority: '0.9' },
    { url: `${baseUrl}/privacy`, changefreq: 'monthly', priority: '0.3' },
    { url: `${baseUrl}/terms`, changefreq: 'monthly', priority: '0.3' },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/business-inquiry`, changefreq: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/upgrade`, changefreq: 'monthly', priority: '0.6' },
  ]

  for (const page of staticPages) {
    xml += `<url>
<loc>${page.url}</loc>
<lastmod>${now}</lastmod>
<changefreq>${page.changefreq}</changefreq>
<priority>${page.priority}</priority>
</url>
`
  }

  // Business pages
  for (const slug of businessSlugs) {
    xml += `<url>
<loc>${baseUrl}/business/${slug}</loc>
<lastmod>${now}</lastmod>
<changefreq>weekly</changefreq>
<priority>0.8</priority>
</url>
`
  }

  // Category pages
  for (const category of CATEGORIES) {
    xml += `<url>
<loc>${baseUrl}/search?category=${category.id}</loc>
<lastmod>${now}</lastmod>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
`
  }

  // City pages
  const cities = ['Leander', 'Cedar%20Park', 'Liberty%20Hill']
  for (const city of cities) {
    xml += `<url>
<loc>${baseUrl}/search?city=${city}</loc>
<lastmod>${now}</lastmod>
<changefreq>daily</changefreq>
<priority>0.7</priority>
</url>
`
  }

  xml += `</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

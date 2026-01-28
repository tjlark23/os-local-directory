/**
 * Outscraper Data Import Script
 *
 * Imports business data from Outscraper API into Supabase database.
 * Targets 6,000-8,000 businesses across 9 cities and 11 categories.
 *
 * Usage: npx tsx scripts/import-outscraper-data.ts
 */

import { createClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const OUTSCRAPER_API_KEY = 'OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ'
const OUTSCRAPER_BASE_URL = 'https://api.app.outscraper.com'

// Supabase config - Service Role Key required for inserts
const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'

// Check for service role key in environment or command line arg
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2]

if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required.')
  console.error('')
  console.error('Usage:')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/import-outscraper-data.ts')
  console.error('  OR')
  console.error('  npx tsx scripts/import-outscraper-data.ts your_service_role_key')
  console.error('')
  console.error('Get your Service Role Key from:')
  console.error('  https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/settings/api')
  console.error('')
  process.exit(1)
}

// Quality filters
const MIN_RATING = 4.0
const MIN_REVIEWS = 5
const PHOTOS_LIMIT = 5
const REVIEWS_LIMIT = 10

// ═══════════════════════════════════════════════════════════
// CITIES TO SCRAPE (9 CITIES)
// ═══════════════════════════════════════════════════════════

const CITIES = [
  'Leander, TX',
  'Cedar Park, TX',
  'Liberty Hill, TX',
  'Round Rock, TX',
  'Pflugerville, TX',
  'Hutto, TX',
  'Georgetown, TX',
  'Taylor, TX',
  'Austin, TX'
]

// ═══════════════════════════════════════════════════════════
// COMPLETE QUERY MAP (11 CATEGORIES, 115 SUBCATEGORIES)
// ═══════════════════════════════════════════════════════════

const QUERY_MAP: Record<string, Record<string, number>> = {
  'restaurants': {
    'Mexican restaurants': 20,
    'Chinese restaurants': 15,
    'Italian restaurants': 15,
    'American restaurants': 20,
    'BBQ restaurants': 15,
    'Pizza restaurants': 15,
    'Asian restaurants': 15,
    'Thai restaurants': 10,
    'Burger restaurants': 15,
    'Seafood restaurants': 10,
    'Tex-Mex restaurants': 15,
    'Coffee shops': 20,
    'Bakeries': 15,
    'Breakfast restaurants': 15,
    'Sushi restaurants': 10,
    'Fast food restaurants': 10,
    'Indian restaurants': 10,
    'Vietnamese restaurants': 10,
    'Japanese restaurants': 10,
    'Mediterranean restaurants': 10,
  },

  'health': {
    'Doctors': 15,
    'Dentists': 15,
    'Urgent care clinics': 10,
    'Physical therapy': 10,
    'Chiropractors': 10,
    'Medical clinics': 10,
    'Optometrists': 10,
    'Dermatologists': 5,
    'Pediatricians': 10,
    'Family medicine': 10,
  },

  'beauty': {
    'Hair salons': 20,
    'Nail salons': 15,
    'Spas': 10,
    'Barber shops': 15,
    'Waxing salons': 5,
    'Massage therapy': 10,
    'Beauty salons': 15,
    'Skin care': 5,
  },

  'fitness': {
    'Gyms': 15,
    'Yoga studios': 10,
    'CrossFit': 10,
    'Pilates studios': 5,
    'Martial arts': 5,
    'Personal trainers': 10,
    'Fitness centers': 10,
    'Dance studios': 5,
  },

  'automotive': {
    'Auto repair': 15,
    'Car dealerships': 10,
    'Oil change': 10,
    'Car wash': 10,
    'Tire shops': 10,
    'Body shops': 5,
    'Auto parts': 5,
    'Mechanics': 10,
  },

  'services': {
    'Plumbers': 10,
    'Electricians': 10,
    'HVAC': 10,
    'Lawn care': 10,
    'Cleaning services': 10,
    'Handyman': 10,
    'Landscaping': 10,
    'Pest control': 5,
    'Roofing': 5,
    'Painters': 5,
    'Home repair': 5,
  },

  'education': {
    'Preschools': 10,
    'Private schools': 5,
    'Tutoring centers': 10,
    'Music lessons': 5,
    'Dance studios': 5,
    'Childcare': 10,
    'After school programs': 5,
  },

  'pets': {
    'Veterinarians': 10,
    'Pet stores': 10,
    'Dog groomers': 10,
    'Pet boarding': 5,
    'Pet training': 5,
    'Animal hospitals': 5,
  },

  'financial': {
    'Banks': 10,
    'Credit unions': 5,
    'Insurance agencies': 10,
    'Financial advisors': 10,
    'Mortgage brokers': 5,
    'Accountants': 10,
    'Tax services': 5,
  },

  'home': {
    'Furniture stores': 10,
    'Home improvement': 10,
    'Interior designers': 5,
    'Flooring': 5,
    'Kitchen and bath': 5,
    'Appliance stores': 5,
    'Hardware stores': 5,
  },

  'entertainment': {
    'Bars': 15,
    'Movie theaters': 5,
    'Entertainment venues': 10,
    'Bowling': 5,
    'Arcades': 5,
    'Breweries': 10,
    'Wineries': 5,
  }
}

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface OutscraperBusiness {
  name?: string
  full_address?: string
  street?: string
  city?: string
  state?: string
  postal_code?: string
  phone?: string
  site?: string
  rating?: number
  reviews?: number
  working_hours?: Record<string, string[]>
  photos?: string[]
  reviews_data?: Array<{
    author_title?: string
    review_rating?: number
    review_text?: string
    review_datetime_utc?: string
  }>
  latitude?: number
  longitude?: number
  category?: string
  subtypes?: string[]
  price_level?: string
  place_id?: string
  business_status?: string
}

interface Stats {
  totalQueries: number
  totalScraped: number
  totalFiltered: number
  totalDuplicates: number
  totalImported: number
  byCity: Record<string, { scraped: number; filtered: number; imported: number }>
  byCategory: Record<string, number>
  errors: string[]
}

// ═══════════════════════════════════════════════════════════
// INITIALIZE CLIENTS
// ═══════════════════════════════════════════════════════════

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Stats tracking
const stats: Stats = {
  totalQueries: 0,
  totalScraped: 0,
  totalFiltered: 0,
  totalDuplicates: 0,
  totalImported: 0,
  byCity: {},
  byCategory: {},
  errors: []
}

// Store for deduplication
const seenBusinesses = new Set<string>()

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function normalizeBusinessKey(name: string, address: string): string {
  return `${name.toLowerCase().trim()}|${address.toLowerCase().trim()}`
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

function parseHours(hoursDict: Record<string, string[]> | undefined): Record<string, { open: string; close: string; isOpen: boolean }> | null {
  if (!hoursDict) return null

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const result: Record<string, { open: string; close: string; isOpen: boolean }> = {}

  for (const day of days) {
    const hours = hoursDict[day]
    if (hours && hours.length > 0 && hours[0] !== 'Closed') {
      // Parse format like "9 AM-5 PM" or "9:00 AM - 5:00 PM"
      const hourStr = hours[0]
      const match = hourStr.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i)
      if (match) {
        result[day] = {
          open: match[1].trim(),
          close: match[2].trim(),
          isOpen: true
        }
      } else {
        result[day] = { open: '9:00 AM', close: '5:00 PM', isOpen: true }
      }
    } else {
      result[day] = { open: '', close: '', isOpen: false }
    }
  }

  return result
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ═══════════════════════════════════════════════════════════
// OUTSCRAPER API
// ═══════════════════════════════════════════════════════════

async function searchGoogleMaps(query: string, limit: number): Promise<OutscraperBusiness[]> {
  const url = new URL(`${OUTSCRAPER_BASE_URL}/maps/search-v3`)
  url.searchParams.set('query', query)
  url.searchParams.set('limit', limit.toString())
  url.searchParams.set('language', 'en')
  url.searchParams.set('region', 'us')
  url.searchParams.set('async', 'false')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'X-API-KEY': OUTSCRAPER_API_KEY,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Outscraper API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // Outscraper returns results in data array
  if (Array.isArray(data)) {
    return data.flat()
  }

  if (data.data && Array.isArray(data.data)) {
    return data.data.flat()
  }

  return []
}

// ═══════════════════════════════════════════════════════════
// MAIN IMPORT FUNCTION
// ═══════════════════════════════════════════════════════════

async function getOrCreateLocation(): Promise<string> {
  // First check if wilco-guide location exists
  const { data: existing } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'wilco-guide')
    .single()

  if (existing) {
    console.log('Using existing location: wilco-guide')
    return existing.id
  }

  // Create new location
  const { data: newLocation, error } = await supabase
    .from('locations')
    .insert({
      slug: 'wilco-guide',
      name: 'WilCo Guide',
      domain: 'wilcoguide.com',
      tagline: 'Your Complete Guide to Williamson County',
      cities: ['Leander', 'Cedar Park', 'Liberty Hill', 'Round Rock', 'Pflugerville', 'Hutto', 'Georgetown', 'Taylor', 'Austin'],
      state: 'TX',
      timezone: 'America/Chicago',
      primary_color: '#2563eb'
    })
    .select('id')
    .single()

  if (error) {
    // If insert fails, try fetching leander location as fallback
    const { data: leander } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', 'leander')
      .single()

    if (leander) {
      console.log('Using fallback location: leander')
      return leander.id
    }

    throw new Error(`Failed to get/create location: ${error.message}`)
  }

  console.log('Created new location: wilco-guide')
  return newLocation.id
}

async function importBusiness(
  locationId: string,
  business: OutscraperBusiness,
  category: string,
  subcategory: string,
  cityName: string
): Promise<boolean> {
  const name = business.name || ''
  const address = business.full_address || ''

  // Deduplication check
  const businessKey = normalizeBusinessKey(name, address)
  if (seenBusinesses.has(businessKey)) {
    stats.totalDuplicates++
    return false
  }
  seenBusinesses.add(businessKey)

  // Generate unique slug
  let baseSlug = generateSlug(name)
  let slug = baseSlug
  let suffix = 1

  // Check if slug exists and make unique
  while (true) {
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('location_id', locationId)
      .eq('slug', slug)
      .single()

    if (!existing) break

    slug = `${baseSlug}-${suffix}`
    suffix++
  }

  // Prepare business data matching database schema
  const businessData = {
    location_id: locationId,
    slug,
    name,
    description: `${name} is a ${subcategory.replace(/ restaurants?| shops?| salons?| studios?| centers?| services?/gi, '').toLowerCase()} business located in ${cityName}. ${business.subtypes?.join(', ') || ''}`.trim(),
    category,
    subcategory: subcategory.replace(/ in .+$/, ''), // Clean subcategory
    image: business.photos?.[0] || '/placeholder-business.jpg',
    photos: business.photos?.slice(0, PHOTOS_LIMIT) || [],
    videos: [],
    phone: business.phone || '',
    email: null,
    website: business.site || null,
    address_street: business.street || address.split(',')[0] || '',
    address_city: business.city || cityName,
    address_state: business.state || 'TX',
    address_zip: business.postal_code || '',
    latitude: business.latitude || null,
    longitude: business.longitude || null,
    hours: parseHours(business.working_hours) || {},
    rating: business.rating || 0,
    review_count: business.reviews || 0,
    price_range: business.price_level || null,
    specialties: business.subtypes?.slice(0, 5) || [],
    amenities: [],
    tags: [category, subcategory.replace(/ in .+$/, ''), cityName].filter(Boolean),
    listing_tier: 'free' as const,
    is_featured: false,
    backlink_enabled: false
  }

  try {
    const { error } = await supabase
      .from('businesses')
      .insert(businessData)

    if (error) {
      throw new Error(error.message)
    }

    return true
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    stats.errors.push(`Import error for ${name}: ${errorMsg}`)
    return false
  }
}

async function scrapeAndImport(): Promise<void> {
  console.log('═'.repeat(60))
  console.log('STARTING OUTSCRAPER DATA IMPORT')
  console.log(`Start time: ${new Date().toISOString()}`)
  console.log('═'.repeat(60))

  // Get or create location
  const locationId = await getOrCreateLocation()
  console.log(`\nUsing location ID: ${locationId}\n`)

  for (const city of CITIES) {
    const cityName = city.split(',')[0]
    stats.byCity[cityName] = { scraped: 0, filtered: 0, imported: 0 }

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`PROCESSING: ${city}`)
    console.log('═'.repeat(60))

    for (const [category, subcategories] of Object.entries(QUERY_MAP)) {
      if (!stats.byCategory[category]) {
        stats.byCategory[category] = 0
      }

      for (const [subcategory, limit] of Object.entries(subcategories)) {
        const query = `${subcategory} in ${city}`
        stats.totalQueries++

        console.log(`\n  Query: ${query} (limit: ${limit})`)

        try {
          // Call Outscraper API
          const results = await searchGoogleMaps(query, limit)

          stats.totalScraped += results.length
          stats.byCity[cityName].scraped += results.length

          console.log(`    Found: ${results.length} businesses`)

          // Process each business
          for (const business of results) {
            // Quality filters
            const rating = business.rating || 0
            const reviewCount = business.reviews || 0
            const status = (business.business_status || '').toUpperCase()

            // Skip if doesn't meet quality standards
            if (rating < MIN_RATING || reviewCount < MIN_REVIEWS) {
              stats.totalFiltered++
              stats.byCity[cityName].filtered++
              continue
            }

            // Skip if permanently closed
            if (status.includes('CLOSED')) {
              stats.totalFiltered++
              continue
            }

            // Import to database
            const imported = await importBusiness(
              locationId,
              business,
              category,
              subcategory,
              cityName
            )

            if (imported) {
              stats.totalImported++
              stats.byCity[cityName].imported++
              stats.byCategory[category]++
            }
          }

          // Rate limiting - be nice to API
          await sleep(1500)

        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err)
          console.log(`    ERROR: ${errorMsg}`)
          stats.errors.push(`Query error for '${query}': ${errorMsg}`)

          // Wait longer on error (might be rate limited)
          await sleep(5000)
        }
      }
    }
  }

  // Generate final report
  generateReport()
}

function generateReport(): void {
  console.log('\n' + '═'.repeat(60))
  console.log('IMPORT COMPLETE - FINAL REPORT')
  console.log('═'.repeat(60))

  console.log(`\nEnd time: ${new Date().toISOString()}`)

  console.log('\nOVERALL STATS:')
  console.log(`  Total queries made: ${stats.totalQueries}`)
  console.log(`  Total businesses scraped: ${stats.totalScraped}`)
  console.log(`  Filtered (quality): ${stats.totalFiltered}`)
  console.log(`  Duplicates skipped: ${stats.totalDuplicates}`)
  console.log(`  Successfully imported: ${stats.totalImported}`)

  console.log('\nBY CITY:')
  for (const [city, cityStats] of Object.entries(stats.byCity)) {
    console.log(`  ${city}:`)
    console.log(`    Scraped: ${cityStats.scraped}`)
    console.log(`    Imported: ${cityStats.imported}`)
  }

  console.log('\nBY CATEGORY:')
  const sortedCategories = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])
  for (const [category, count] of sortedCategories) {
    console.log(`  ${category}: ${count} businesses`)
  }

  if (stats.errors.length > 0) {
    console.log(`\nERRORS (${stats.errors.length}):`)
    for (const error of stats.errors.slice(0, 20)) {
      console.log(`  - ${error}`)
    }
    if (stats.errors.length > 20) {
      console.log(`  ... and ${stats.errors.length - 20} more errors`)
    }
  }

  // Save report to file
  const reportFile = `import_report_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  console.log(`\nFull stats available in memory (would save to: ${reportFile})`)
  console.log('\n' + '═'.repeat(60))
}

// ═══════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════

scrapeAndImport().catch(console.error)

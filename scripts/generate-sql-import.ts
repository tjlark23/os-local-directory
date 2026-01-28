/**
 * Generate SQL Import Script
 *
 * Fetches data from Outscraper and generates SQL statements that can be
 * run directly in Supabase SQL Editor (no service role key needed).
 *
 * Usage: npx tsx scripts/generate-sql-import.ts
 * Output: Creates import-businesses.sql file
 */

import * as fs from 'fs'
import * as path from 'path'

// ═══════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════

const OUTSCRAPER_API_KEY = 'OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ'
const OUTSCRAPER_BASE_URL = 'https://api.app.outscraper.com'

// Quality filters
const MIN_RATING = 4.0
const MIN_REVIEWS = 5
const PHOTOS_LIMIT = 5

// Location ID from database (leander location)
const LOCATION_ID = '3714b0ea-56ae-426a-b2f1-5dff20efe29e'

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
  address?: string  // Full address
  street?: string
  city?: string
  state?: string
  state_code?: string
  postal_code?: string
  phone?: string
  website?: string  // Changed from site
  rating?: number
  reviews?: number
  working_hours?: Record<string, string[]>
  photo?: string  // Main photo URL
  photos_count?: number
  latitude?: number
  longitude?: number
  subtypes?: string | string[]
  range?: string  // Price range ($, $$, etc)
  place_id?: string
  business_status?: string
  about?: Record<string, Record<string, boolean>>  // Rich amenities data
}

interface Stats {
  totalQueries: number
  totalScraped: number
  totalFiltered: number
  totalDuplicates: number
  totalGenerated: number
  byCity: Record<string, { scraped: number; filtered: number; generated: number }>
  byCategory: Record<string, number>
  errors: string[]
}

// Stats tracking
const stats: Stats = {
  totalQueries: 0,
  totalScraped: 0,
  totalFiltered: 0,
  totalDuplicates: 0,
  totalGenerated: 0,
  byCity: {},
  byCategory: {},
  errors: []
}

// Store for deduplication
const seenBusinesses = new Set<string>()
const usedSlugs = new Set<string>()

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function normalizeBusinessKey(name: string, address: string): string {
  return `${name.toLowerCase().trim()}|${address.toLowerCase().trim()}`
}

function generateSlug(name: string): string {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)

  // Make unique if already used
  let finalSlug = slug
  let counter = 1
  while (usedSlugs.has(finalSlug)) {
    finalSlug = `${slug}-${counter}`
    counter++
  }
  usedSlugs.add(finalSlug)
  return finalSlug
}

function escapeSQL(str: string | null | undefined): string {
  if (!str) return ''
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\')
}

function parseHours(hoursDict: Record<string, string[]> | undefined): string {
  if (!hoursDict) return '{}'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const result: Record<string, { open: string; close: string; isOpen: boolean }> = {}

  for (const day of days) {
    const hours = hoursDict[day]
    if (hours && hours.length > 0 && hours[0] !== 'Closed') {
      const hourStr = hours[0]
      const match = hourStr.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i)
      if (match) {
        result[day.toLowerCase()] = {
          open: match[1].trim(),
          close: match[2].trim(),
          isOpen: true
        }
      } else {
        result[day.toLowerCase()] = { open: '9:00 AM', close: '5:00 PM', isOpen: true }
      }
    } else {
      result[day.toLowerCase()] = { open: '', close: '', isOpen: false }
    }
  }

  return JSON.stringify(result).replace(/'/g, "''")
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

  if (Array.isArray(data)) {
    return data.flat()
  }

  if (data.data && Array.isArray(data.data)) {
    return data.data.flat()
  }

  return []
}

// ═══════════════════════════════════════════════════════════
// SQL GENERATION
// ═══════════════════════════════════════════════════════════

function generateInsertSQL(
  business: OutscraperBusiness,
  category: string,
  subcategory: string,
  cityName: string
): string | null {
  const name = business.name || ''
  const address = business.address || ''  // Changed from full_address

  // Deduplication check
  const businessKey = normalizeBusinessKey(name, address)
  if (seenBusinesses.has(businessKey)) {
    stats.totalDuplicates++
    return null
  }
  seenBusinesses.add(businessKey)

  const slug = generateSlug(name)

  // Build description from subtypes
  const subtypes = Array.isArray(business.subtypes) ? business.subtypes : (business.subtypes ? [business.subtypes] : [])
  const description = `${escapeSQL(name)} is a ${subcategory.replace(/ restaurants?| shops?| salons?| studios?| centers?| services?/gi, '').toLowerCase()} business located in ${cityName}. ${escapeSQL(subtypes.join(', '))}`.trim()

  // Use the main photo URL
  const mainPhoto = business.photo || '/placeholder.svg?height=400&width=600'
  const photosArray = business.photo ? `ARRAY['${escapeSQL(business.photo)}']` : `'{}'`

  const tags = [category, subcategory.replace(/ in .+$/, ''), cityName].filter(Boolean)
  const tagsArray = `ARRAY[${tags.map(t => `'${escapeSQL(t)}'`).join(', ')}]`

  const specialtiesArray = subtypes.length > 0
    ? `ARRAY[${subtypes.slice(0, 5).map(s => `'${escapeSQL(s)}'`).join(', ')}]`
    : `'{}'`

  // Parse price range from the 'range' field (e.g., "$", "$$", "$$$")
  const priceRange = business.range || null

  return `
  ('${LOCATION_ID}', '${slug}', '${escapeSQL(name)}', '${description}',
   '${category}', '${escapeSQL(subcategory.replace(/ in .+$/, ''))}',
   '${escapeSQL(mainPhoto)}',
   ${photosArray}, '{}',
   '${escapeSQL(business.phone || '')}', NULL, ${business.website ? `'${escapeSQL(business.website)}'` : 'NULL'},
   '${escapeSQL(business.street || address.split(',')[0] || '')}',
   '${escapeSQL(business.city || cityName)}', '${business.state_code || business.state || 'TX'}',
   '${escapeSQL(business.postal_code || '')}',
   ${business.latitude || 'NULL'}, ${business.longitude || 'NULL'},
   '${parseHours(business.working_hours)}',
   ${business.rating || 0}, ${business.reviews || 0},
   ${priceRange ? `'${escapeSQL(priceRange)}'` : 'NULL'},
   ${specialtiesArray}, '{}', ${tagsArray},
   'free', FALSE, FALSE)`
}

// ═══════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════

async function generateSQLImport(): Promise<void> {
  console.log('═'.repeat(60))
  console.log('GENERATING SQL IMPORT FILE')
  console.log(`Start time: ${new Date().toISOString()}`)
  console.log('═'.repeat(60))

  const sqlStatements: string[] = []

  // SQL header
  sqlStatements.push(`-- Generated by Outscraper Import Script`)
  sqlStatements.push(`-- Date: ${new Date().toISOString()}`)
  sqlStatements.push(`-- Target: 6,000-8,000 businesses across 9 cities, 11 categories`)
  sqlStatements.push(``)
  sqlStatements.push(`-- Insert businesses`)
  sqlStatements.push(`INSERT INTO businesses (`)
  sqlStatements.push(`  location_id, slug, name, description,`)
  sqlStatements.push(`  category, subcategory, image, photos, videos,`)
  sqlStatements.push(`  phone, email, website,`)
  sqlStatements.push(`  address_street, address_city, address_state, address_zip,`)
  sqlStatements.push(`  latitude, longitude, hours,`)
  sqlStatements.push(`  rating, review_count, price_range,`)
  sqlStatements.push(`  specialties, amenities, tags,`)
  sqlStatements.push(`  listing_tier, is_featured, backlink_enabled`)
  sqlStatements.push(`) VALUES`)

  const valueStatements: string[] = []

  for (const city of CITIES) {
    const cityName = city.split(',')[0]
    stats.byCity[cityName] = { scraped: 0, filtered: 0, generated: 0 }

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
          const results = await searchGoogleMaps(query, limit)

          stats.totalScraped += results.length
          stats.byCity[cityName].scraped += results.length

          console.log(`    Found: ${results.length} businesses`)

          for (const business of results) {
            const rating = business.rating || 0
            const reviewCount = business.reviews || 0
            const status = (business.business_status || '').toUpperCase()

            if (rating < MIN_RATING || reviewCount < MIN_REVIEWS) {
              stats.totalFiltered++
              stats.byCity[cityName].filtered++
              continue
            }

            if (status.includes('CLOSED')) {
              stats.totalFiltered++
              continue
            }

            const sql = generateInsertSQL(business, category, subcategory, cityName)
            if (sql) {
              valueStatements.push(sql)
              stats.totalGenerated++
              stats.byCity[cityName].generated++
              stats.byCategory[category]++
            }
          }

          // Rate limiting
          await sleep(1500)

        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err)
          console.log(`    ERROR: ${errorMsg}`)
          stats.errors.push(`Query error for '${query}': ${errorMsg}`)
          await sleep(5000)
        }
      }
    }
  }

  // Combine all values
  sqlStatements.push(valueStatements.join(','))
  sqlStatements.push(`;`)
  sqlStatements.push(``)
  sqlStatements.push(`-- Import complete: ${stats.totalGenerated} businesses`)

  // Write SQL file
  const outputPath = path.join(__dirname, '..', 'import-businesses.sql')
  fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf8')

  // Generate report
  generateReport(outputPath)
}

function generateReport(outputPath: string): void {
  console.log('\n' + '═'.repeat(60))
  console.log('GENERATION COMPLETE - FINAL REPORT')
  console.log('═'.repeat(60))

  console.log(`\nEnd time: ${new Date().toISOString()}`)

  console.log('\nOVERALL STATS:')
  console.log(`  Total queries made: ${stats.totalQueries}`)
  console.log(`  Total businesses scraped: ${stats.totalScraped}`)
  console.log(`  Filtered (quality): ${stats.totalFiltered}`)
  console.log(`  Duplicates skipped: ${stats.totalDuplicates}`)
  console.log(`  SQL statements generated: ${stats.totalGenerated}`)

  console.log('\nBY CITY:')
  for (const [city, cityStats] of Object.entries(stats.byCity)) {
    console.log(`  ${city}:`)
    console.log(`    Scraped: ${cityStats.scraped}`)
    console.log(`    Generated: ${cityStats.generated}`)
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
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`SQL FILE SAVED TO: ${outputPath}`)
  console.log(``)
  console.log(`NEXT STEPS:`)
  console.log(`1. Open Supabase SQL Editor:`)
  console.log(`   https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/sql`)
  console.log(`2. Copy and paste the contents of import-businesses.sql`)
  console.log(`3. Run the query`)
  console.log('═'.repeat(60))
}

// Run
generateSQLImport().catch(console.error)

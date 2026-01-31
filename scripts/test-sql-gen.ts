/**
 * Quick test of SQL generation - just 1 city, 2 categories
 */

import * as fs from 'fs'
import * as path from 'path'

const OUTSCRAPER_API_KEY = 'OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ'
const OUTSCRAPER_BASE_URL = 'https://api.app.outscraper.com'
const LOCATION_ID = '3714b0ea-56ae-426a-b2f1-5dff20efe29e'
const MIN_RATING = 4.0
const MIN_REVIEWS = 5

const usedSlugs = new Set<string>()
const seenBusinesses = new Set<string>()

function escapeSQL(str: string | null | undefined): string {
  if (!str) return ''
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\')
}

function generateSlug(name: string): string {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)

  let finalSlug = slug
  let counter = 1
  while (usedSlugs.has(finalSlug)) {
    finalSlug = `${slug}-${counter}`
    counter++
  }
  usedSlugs.add(finalSlug)
  return finalSlug
}

function parseHours(hoursDict: Record<string, string[]> | undefined): string {
  if (!hoursDict) return '{}'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const result: Record<string, { open: string; close: string; isOpen: boolean }> = {}

  for (const day of days) {
    const hours = hoursDict[day]
    if (hours && hours.length > 0 && hours[0] !== 'Closed') {
      const hourStr = hours[0]
      const match = hourStr.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)\s*[-–]?\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)/i)
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

async function searchGoogleMaps(query: string, limit: number): Promise<any[]> {
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
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  if (Array.isArray(data)) return data.flat()
  if (data.data && Array.isArray(data.data)) return data.data.flat()
  return []
}

function normalizeBusinessKey(name: string, address: string): string {
  return `${name.toLowerCase().trim()}|${address.toLowerCase().trim()}`
}

async function testSQLGen(): Promise<void> {
  console.log('Testing SQL generation with small dataset...\n')

  const testQueries = [
    { query: 'Mexican restaurants in Leander, TX', category: 'restaurants', subcategory: 'Mexican restaurants', limit: 5 },
    { query: 'Hair salons in Leander, TX', category: 'beauty', subcategory: 'Hair salons', limit: 5 }
  ]

  const sqlStatements: string[] = []
  sqlStatements.push(`-- Test SQL Import`)
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
  let total = 0

  for (const q of testQueries) {
    console.log(`Query: ${q.query}`)
    const results = await searchGoogleMaps(q.query, q.limit)
    console.log(`  Found: ${results.length}`)

    for (const biz of results) {
      const rating = biz.rating || 0
      const reviews = biz.reviews || 0
      const status = (biz.business_status || '').toUpperCase()

      if (rating < MIN_RATING || reviews < MIN_REVIEWS) continue
      if (status.includes('CLOSED')) continue

      const name = biz.name || ''
      const address = biz.address || ''
      const key = normalizeBusinessKey(name, address)
      if (seenBusinesses.has(key)) continue
      seenBusinesses.add(key)

      const slug = generateSlug(name)
      const subtypes = Array.isArray(biz.subtypes) ? biz.subtypes : (biz.subtypes ? [biz.subtypes] : [])
      const description = `${escapeSQL(name)} is a ${q.subcategory.replace(/ restaurants?| shops?| salons?| studios?| centers?| services?/gi, '').toLowerCase()} business located in Leander. ${escapeSQL(subtypes.join(', '))}`.trim()

      const mainPhoto = biz.photo || '/placeholder.svg?height=400&width=600'
      const photosArray = biz.photo ? `ARRAY['${escapeSQL(biz.photo)}']` : `'{}'`

      const tags = [q.category, q.subcategory, 'Leander']
      const tagsArray = `ARRAY[${tags.map(t => `'${escapeSQL(t)}'`).join(', ')}]`

      const specialtiesArray = subtypes.length > 0
        ? `ARRAY[${subtypes.slice(0, 5).map((s: string) => `'${escapeSQL(s)}'`).join(', ')}]`
        : `'{}'`

      const sql = `
  ('${LOCATION_ID}', '${slug}', '${escapeSQL(name)}', '${description}',
   '${q.category}', '${escapeSQL(q.subcategory)}',
   '${escapeSQL(mainPhoto)}',
   ${photosArray}, '{}',
   '${escapeSQL(biz.phone || '')}', NULL, ${biz.website ? `'${escapeSQL(biz.website)}'` : 'NULL'},
   '${escapeSQL(biz.street || address.split(',')[0] || '')}',
   '${escapeSQL(biz.city || 'Leander')}', '${biz.state_code || 'TX'}',
   '${escapeSQL(biz.postal_code || '')}',
   ${biz.latitude || 'NULL'}, ${biz.longitude || 'NULL'},
   '${parseHours(biz.working_hours)}',
   ${rating}, ${reviews},
   ${biz.range ? `'${escapeSQL(biz.range)}'` : 'NULL'},
   ${specialtiesArray}, '{}', ${tagsArray},
   'free', FALSE, FALSE)`

      valueStatements.push(sql)
      total++
      console.log(`  + ${name} (${rating}★, ${reviews} reviews)`)
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 1000))
  }

  sqlStatements.push(valueStatements.join(','))
  sqlStatements.push(`;`)

  const outputPath = path.join(__dirname, '..', 'test-import.sql')
  fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf8')

  console.log(`\nGenerated ${total} SQL statements`)
  console.log(`Saved to: ${outputPath}`)
}

testSQLGen().catch(console.error)

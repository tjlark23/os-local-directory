/**
 * Import reviews from Outscraper Excel files
 *
 * This script:
 * 1. Reads all 9 Outscraper Excel files
 * 2. Extracts review data (from files that have google_maps_reviews.* columns)
 * 3. Matches reviews to existing businesses by name/address
 * 4. Imports reviews into the reviews table
 */

import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const DOWNLOADS_DIR = 'C:\\Users\\tjlar\\Downloads'
const DRY_RUN = process.argv.includes('--dry-run')
const LIMIT = process.argv.includes('--limit') ?
  parseInt(process.argv[process.argv.indexOf('--limit') + 1]) : undefined

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

interface ReviewData {
  business_id: string
  author_name: string | null
  author_id: string | null
  author_image: string | null
  author_link: string | null
  rating: number
  text: string
  review_date: string | null
  review_timestamp: number | null
  review_id: string
  review_link: string | null
  likes: number
  owner_response: string | null
  owner_response_date: string | null
  source: string
}

interface Stats {
  totalRowsProcessed: number
  rowsWithReviewText: number
  uniqueBusinesses: number
  reviewsImported: number
  duplicatesSkipped: number
  businessNotFound: number
  errors: number
}

const stats: Stats = {
  totalRowsProcessed: 0,
  rowsWithReviewText: 0,
  uniqueBusinesses: 0,
  reviewsImported: 0,
  duplicatesSkipped: 0,
  businessNotFound: 0,
  errors: 0
}

// Cache for business lookups
const businessCache = new Map<string, string | null>()

// Normalize business name for matching
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Find business ID by name and city
async function findBusinessId(name: string, city: string): Promise<string | null> {
  const cacheKey = `${normalizeName(name)}|${city.toLowerCase()}`

  if (businessCache.has(cacheKey)) {
    return businessCache.get(cacheKey) || null
  }

  // Try exact match first
  let { data } = await supabase
    .from('businesses')
    .select('id, name')
    .ilike('name', name)
    .ilike('address_city', `%${city}%`)
    .limit(1)

  if (!data || data.length === 0) {
    // Try fuzzy match
    const normalized = normalizeName(name)
    const { data: fuzzyData } = await supabase
      .from('businesses')
      .select('id, name')
      .ilike('address_city', `%${city}%`)
      .limit(100)

    if (fuzzyData) {
      // Find best match
      const match = fuzzyData.find(b =>
        normalizeName(b.name) === normalized ||
        normalizeName(b.name).includes(normalized) ||
        normalized.includes(normalizeName(b.name))
      )
      if (match) {
        data = [match]
      }
    }
  }

  const businessId = data && data.length > 0 ? data[0].id : null
  businessCache.set(cacheKey, businessId)
  return businessId
}

async function importReviewsFromFile(filePath: string): Promise<void> {
  const fileName = path.basename(filePath)
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Processing: ${fileName}`)
  console.log('─'.repeat(60))

  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[]

  // Check if this file has review text
  const hasReviewText = headers.some(h => h === 'google_maps_reviews.review_text')

  if (!hasReviewText) {
    console.log('  No review text column found, skipping...')
    return
  }

  const data = XLSX.utils.sheet_to_json(sheet) as any[]
  console.log(`  Total rows: ${data.length}`)

  // Group rows by business
  const businessGroups = new Map<string, any[]>()

  for (const row of data) {
    const placeId = row['place_id']
    if (!placeId) continue

    if (!businessGroups.has(placeId)) {
      businessGroups.set(placeId, [])
    }
    businessGroups.get(placeId)!.push(row)
  }

  console.log(`  Unique businesses: ${businessGroups.size}`)

  let processedCount = 0
  const reviewsToInsert: ReviewData[] = []

  for (const [placeId, rows] of businessGroups) {
    const firstRow = rows[0]
    const businessName = firstRow['name']
    const city = firstRow['city'] || ''

    // Find matching business in our database
    const businessId = await findBusinessId(businessName, city)

    if (!businessId) {
      stats.businessNotFound++
      if (stats.businessNotFound <= 5) {
        console.log(`  ⚠️  Business not found: ${businessName} (${city})`)
      }
      continue
    }

    // Extract reviews from all rows for this business
    for (const row of rows) {
      const reviewText = row['google_maps_reviews.review_text']
      if (!reviewText) continue

      stats.rowsWithReviewText++

      const reviewId = row['google_maps_reviews.review_id']
      if (!reviewId) continue

      const review: ReviewData = {
        business_id: businessId,
        author_name: row['google_maps_reviews.author_title'] || null,
        author_id: row['google_maps_reviews.author_id'] || null,
        author_image: row['google_maps_reviews.author_image'] || null,
        author_link: row['google_maps_reviews.author_link'] || null,
        rating: parseInt(row['google_maps_reviews.review_rating']) || 5,
        text: String(reviewText),
        review_date: row['google_maps_reviews.review_datetime_utc'] || null,
        review_timestamp: row['google_maps_reviews.review_timestamp'] || null,
        review_id: String(reviewId),
        review_link: row['google_maps_reviews.review_link'] || null,
        likes: parseInt(row['google_maps_reviews.review_likes']) || 0,
        owner_response: row['google_maps_reviews.owner_answer'] || null,
        owner_response_date: row['google_maps_reviews.owner_answer_timestamp_datetime_utc'] || null,
        source: 'google'
      }

      reviewsToInsert.push(review)
    }

    processedCount++

    if (LIMIT && processedCount >= LIMIT) {
      console.log(`  Reached limit of ${LIMIT} businesses`)
      break
    }

    // Progress update
    if (processedCount % 20 === 0) {
      process.stdout.write(`\r  Processed ${processedCount}/${businessGroups.size} businesses...`)
    }
  }

  console.log(`\n  Reviews to insert: ${reviewsToInsert.length}`)
  stats.uniqueBusinesses += processedCount

  if (DRY_RUN) {
    console.log('  [DRY RUN] Would insert reviews, skipping actual insert')
    stats.reviewsImported += reviewsToInsert.length
    return
  }

  // Insert reviews in batches
  const BATCH_SIZE = 100
  for (let i = 0; i < reviewsToInsert.length; i += BATCH_SIZE) {
    const batch = reviewsToInsert.slice(i, i + BATCH_SIZE)

    const { error } = await supabase
      .from('reviews')
      .upsert(batch, {
        onConflict: 'review_id',
        ignoreDuplicates: true
      })

    if (error) {
      console.log(`  Error inserting batch: ${error.message}`)
      stats.errors++
    } else {
      stats.reviewsImported += batch.length
    }

    process.stdout.write(`\r  Inserted ${Math.min(i + BATCH_SIZE, reviewsToInsert.length)}/${reviewsToInsert.length} reviews...`)
  }
  console.log()
}

async function main() {
  console.log('═'.repeat(60))
  console.log('IMPORTING REVIEWS FROM OUTSCRAPER EXCEL FILES')
  console.log('═'.repeat(60))
  console.log()

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No data will be written')
    console.log()
  }

  if (LIMIT) {
    console.log(`📊 Processing limited to ${LIMIT} businesses per file`)
    console.log()
  }

  // Find all Outscraper Excel files
  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.startsWith('Outscraper-') && f.endsWith('.xlsx'))
    .map(f => path.join(DOWNLOADS_DIR, f))
    .sort((a, b) => fs.statSync(b).size - fs.statSync(a).size) // Largest first

  console.log(`Found ${files.length} Excel files`)

  // Get current review count
  const { count: beforeCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  console.log(`Current reviews in database: ${beforeCount || 0}`)

  // Process each file
  for (const file of files) {
    await importReviewsFromFile(file)
    stats.totalRowsProcessed += 1
  }

  // Final count
  const { count: afterCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  // Print summary
  console.log()
  console.log('═'.repeat(60))
  console.log('IMPORT COMPLETE - SUMMARY')
  console.log('═'.repeat(60))
  console.log()
  console.log(`Files processed: ${files.length}`)
  console.log(`Unique businesses processed: ${stats.uniqueBusinesses}`)
  console.log(`Rows with review text: ${stats.rowsWithReviewText}`)
  console.log(`Reviews imported: ${stats.reviewsImported}`)
  console.log(`Duplicates skipped: ${stats.duplicatesSkipped}`)
  console.log(`Businesses not found: ${stats.businessNotFound}`)
  console.log(`Errors: ${stats.errors}`)
  console.log()
  console.log(`Reviews before: ${beforeCount || 0}`)
  console.log(`Reviews after: ${afterCount || 0}`)
  console.log(`Net new reviews: ${(afterCount || 0) - (beforeCount || 0)}`)
}

main().catch(console.error)

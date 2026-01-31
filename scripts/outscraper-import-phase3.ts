/**
 * Phase 3: Import Round Rock test businesses to database
 * Filters out businesses not in Round Rock
 * Imports businesses + reviews
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface OutscraperBusiness {
  name: string
  city?: string
  full_address?: string
  address?: string
  street?: string
  postal_code?: string
  state?: string
  phone?: string
  website?: string
  site?: string
  rating?: number
  reviews?: number
  latitude?: number
  longitude?: number
  place_id?: string
  photo?: string
  description?: string
  working_hours?: Record<string, string>
  our_category?: string
  reviews_data?: OutscraperReview[]
}

interface OutscraperReview {
  review_text?: string
  author_title?: string
  author_id?: string
  author_image?: string
  review_rating?: number
  review_id?: string
  review_link?: string
  review_likes?: number
  review_datetime_utc?: string
  review_timestamp?: number
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

async function main() {
  console.log('='.repeat(60))
  console.log('PHASE 3: IMPORTING TO DATABASE')
  console.log('='.repeat(60))
  console.log()

  // Load scraped data
  const inputPath = 'C:/Users/tjlar/Desktop/os-local-directory/scripts/roundrock_unique.json'
  const rawData = fs.readFileSync(inputPath, 'utf-8')
  const allBusinesses: OutscraperBusiness[] = JSON.parse(rawData)

  console.log(`Loaded ${allBusinesses.length} businesses from file`)

  // Filter to Round Rock only
  const roundRockBusinesses = allBusinesses.filter(biz =>
    (biz.city || '').toLowerCase().includes('round rock')
  )

  console.log(`After filtering to Round Rock: ${roundRockBusinesses.length} businesses`)
  console.log()

  let importedBusinesses = 0
  let importedReviews = 0
  let skippedDuplicates = 0
  const errors: string[] = []

  console.log('-'.repeat(60))
  console.log('IMPORTING BUSINESSES AND REVIEWS')
  console.log('-'.repeat(60))

  for (let i = 0; i < roundRockBusinesses.length; i++) {
    const biz = roundRockBusinesses[i]
    const name = biz.name || 'Unknown'
    const slug = generateSlug(name) + '-round-rock'

    console.log(`\n[${i + 1}/${roundRockBusinesses.length}] ${name}`)

    // Check if already exists by name and city
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('name', name)
      .eq('address_city', 'Round Rock')
      .single()

    if (existing) {
      console.log(`  [SKIP] Already exists in database`)
      skippedDuplicates++
      continue
    }

    try {
      // Parse address - extract street from full_address
      let street = biz.street || ''
      if (!street && biz.full_address) {
        // full_address is like "1530 I 35 N Frontage Rd, Round Rock, TX 78681"
        const parts = biz.full_address.split(',')
        if (parts.length > 0) {
          street = parts[0].trim()
        }
      }

      // Prepare business data matching actual schema
      const businessData: Record<string, unknown> = {
        name,
        slug,
        address_street: street,
        address_city: 'Round Rock',
        address_state: 'TX',
        address_zip: biz.postal_code,
        phone: biz.phone,
        website: biz.website || biz.site,
        rating: biz.rating || 0,
        review_count: biz.reviews || 0,
        category: biz.our_category || 'Other',
        latitude: biz.latitude,
        longitude: biz.longitude,
        listing_tier: 'free',
        is_featured: false,
        image: biz.photo,
        description: biz.description,
      }

      // Store hours as JSON string if present
      if (biz.working_hours) {
        businessData.hours = JSON.stringify(biz.working_hours)
      }

      // Insert business
      const { data: insertedBiz, error: bizError } = await supabase
        .from('businesses')
        .insert(businessData)
        .select('id')
        .single()

      if (bizError) throw bizError

      const businessId = insertedBiz.id
      importedBusinesses++
      console.log(`  [OK] Imported business (ID: ${businessId.substring(0, 8)}...)`)

      // Import reviews for this business
      const reviewsData = biz.reviews_data || []
      let reviewsImportedForBiz = 0

      for (const review of reviewsData) {
        const reviewText = review.review_text
        if (!reviewText) continue

        let reviewId = review.review_id
        if (!reviewId) {
          // Generate a unique ID if not provided
          reviewId = `${biz.place_id || slug}_${review.author_id || 'unknown'}_${review.review_timestamp || Date.now()}`
        }

        const reviewData: Record<string, unknown> = {
          business_id: businessId,
          author_name: review.author_title,
          author_id: review.author_id,
          author_image: review.author_image,
          rating: Math.round(review.review_rating || 5),
          text: reviewText,
          review_id: reviewId,
          review_link: review.review_link,
          likes: review.review_likes || 0,
          source: 'google'
        }

        // Parse review date if available
        if (review.review_datetime_utc) {
          reviewData.review_date = review.review_datetime_utc
        }

        if (review.review_timestamp) {
          reviewData.review_timestamp = review.review_timestamp
        }

        try {
          const { error: reviewError } = await supabase
            .from('reviews')
            .insert(reviewData)

          if (reviewError) {
            if (!reviewError.message.toLowerCase().includes('duplicate')) {
              // Silently skip non-duplicate errors
            }
          } else {
            importedReviews++
            reviewsImportedForBiz++
          }
        } catch (e) {
          // Ignore errors
        }
      }

      console.log(`  [OK] Imported ${reviewsImportedForBiz} reviews`)

    } catch (e) {
      const errorObj = e as { message?: string; code?: string }
      const errorMsg = `${name}: ${errorObj.message || JSON.stringify(e)}`
      errors.push(errorMsg)
      console.log(`  [ERROR] ${errorMsg.substring(0, 100)}`)
    }
  }

  // ========================================
  // IMPORT SUMMARY
  // ========================================
  console.log()
  console.log('='.repeat(60))
  console.log('IMPORT COMPLETE - SUMMARY')
  console.log('='.repeat(60))
  console.log()
  console.log('Businesses:')
  console.log(`  Imported: ${importedBusinesses}`)
  console.log(`  Skipped (duplicates): ${skippedDuplicates}`)
  console.log(`  Errors: ${errors.length}`)
  console.log()
  console.log('Reviews:')
  console.log(`  Imported: ${importedReviews}`)

  if (errors.length > 0) {
    console.log()
    console.log(`Errors (${errors.length}):`)
    for (const error of errors.slice(0, 10)) {
      console.log(`  - ${error}`)
    }
  }

  // ========================================
  // VERIFY IN DATABASE
  // ========================================
  console.log()
  console.log('='.repeat(60))
  console.log('DATABASE VERIFICATION')
  console.log('='.repeat(60))

  // Count Round Rock businesses
  const { count: dbCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('address_city', 'Round Rock')

  console.log()
  console.log(`Round Rock businesses in database: ${dbCount}`)

  // Count reviews for Round Rock businesses
  const { data: rrBusinesses } = await supabase
    .from('businesses')
    .select('id')
    .eq('address_city', 'Round Rock')

  if (rrBusinesses && rrBusinesses.length > 0) {
    const businessIds = rrBusinesses.map(b => b.id)
    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .in('business_id', businessIds)

    console.log(`Reviews for Round Rock businesses: ${reviewsCount}`)
  }

  // Sample businesses
  console.log()
  console.log('Sample imported businesses:')
  const { data: sample } = await supabase
    .from('businesses')
    .select('name, category, rating, review_count')
    .eq('address_city', 'Round Rock')
    .limit(5)

  if (sample) {
    for (const biz of sample) {
      console.log(`  - ${biz.name} (${biz.category}) - ${biz.rating} stars, ${biz.review_count} reviews`)
    }
  }

  console.log()
  console.log('='.repeat(60))
  console.log('[DONE] Phase 3 complete!')
  console.log('       Check live site: https://wilcoguide.com/directory/round-rock')
  console.log('='.repeat(60))
}

main().catch(console.error)

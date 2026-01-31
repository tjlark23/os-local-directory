/**
 * Import the 4 missing businesses with location_id
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'
const LOCATION_ID = '3714b0ea-56ae-426a-b2f1-5dff20efe29e'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const missingBusinesses = [
  'Family Medicine Associates Of Round Rock',
  'Mathnasium',
  'Partners Pet Center',
  'Round Rock Siding & Trim'
]

interface OutscraperBusiness {
  name: string
  full_address?: string
  street?: string
  postal_code?: string
  phone?: string
  website?: string
  site?: string
  rating?: number
  reviews?: number
  latitude?: number
  longitude?: number
  photo?: string
  description?: string
  working_hours?: Record<string, string>
  our_category?: string
  reviews_data?: Array<{
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
  }>
}

async function importMissing() {
  const data: OutscraperBusiness[] = JSON.parse(
    fs.readFileSync('C:/Users/tjlar/Desktop/os-local-directory/scripts/roundrock_unique.json', 'utf-8')
  )

  for (const biz of data) {
    if (!missingBusinesses.includes(biz.name)) continue

    console.log('Importing:', biz.name)

    // Parse street from full_address
    let street = biz.street || ''
    if (!street && biz.full_address) {
      const parts = biz.full_address.split(',')
      if (parts.length > 0) street = parts[0].trim()
    }

    const slug = biz.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-round-rock'

    const businessData = {
      name: biz.name,
      slug,
      location_id: LOCATION_ID,
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
      description: biz.description || `${biz.name} is a local business in Round Rock, TX.`,
      hours: biz.working_hours ? JSON.stringify(biz.working_hours) : null
    }

    const { data: inserted, error } = await supabase
      .from('businesses')
      .insert(businessData)
      .select('id')
      .single()

    if (error) {
      console.log('  Error:', error.message)
    } else {
      console.log('  Imported with ID:', inserted.id.substring(0, 8) + '...')

      // Import reviews
      const reviews = biz.reviews_data || []
      let reviewCount = 0
      for (const review of reviews) {
        if (!review.review_text) continue

        const reviewId = review.review_id || `${inserted.id}_${review.author_id || 'unknown'}_${review.review_timestamp || Date.now()}`

        const { error: revError } = await supabase.from('reviews').insert({
          business_id: inserted.id,
          author_name: review.author_title,
          author_id: review.author_id,
          author_image: review.author_image,
          rating: Math.round(review.review_rating || 5),
          text: review.review_text,
          review_id: reviewId,
          review_link: review.review_link,
          likes: review.review_likes || 0,
          source: 'google',
          review_date: review.review_datetime_utc,
          review_timestamp: review.review_timestamp
        })

        if (!revError) reviewCount++
      }
      console.log('  Imported', reviewCount, 'reviews')
    }
  }

  console.log('\nDone!')
}

importMissing().catch(console.error)

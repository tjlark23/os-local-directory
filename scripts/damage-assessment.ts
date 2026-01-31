/**
 * Damage Assessment - Check database schema and data state
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function assess() {
  console.log('═'.repeat(60))
  console.log('DAMAGE ASSESSMENT')
  console.log('═'.repeat(60))
  console.log()

  // 1. Total count
  const { count: totalCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
  console.log(`Total businesses in database: ${totalCount}`)

  // 2. Check if reviews table exists and count
  const { count: reviewCount, error: reviewError } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  if (reviewError) {
    console.log(`Reviews table: ERROR - ${reviewError.message}`)
  } else {
    console.log(`Total reviews in database: ${reviewCount}`)
  }

  // 3. Sample business to see actual field values
  console.log('\n--- SAMPLE BUSINESS ---')
  const { data: sample } = await supabase
    .from('businesses')
    .select('*')
    .limit(1)
    .single()

  if (sample) {
    console.log(`Name: ${sample.name}`)
    console.log(`Rating: ${sample.rating} (review_count: ${sample.review_count})`)
    console.log(`Image: ${sample.image ? 'YES' : 'NO'} - ${sample.image?.substring(0, 60)}...`)
    console.log(`Photos: ${sample.photos ? `Array with ${sample.photos.length} items` : 'NULL/Empty'}`)
    console.log(`Hours: ${sample.hours ? 'YES' : 'NULL'}`)
    console.log(`City: ${sample.address_city}`)
    console.log(`Category: ${sample.category}`)
  }

  // 4. Field population stats
  console.log('\n--- FIELD POPULATION ---')
  const { data: allBiz } = await supabase
    .from('businesses')
    .select('image, photos, hours, website, phone, rating, review_count')

  if (allBiz) {
    const stats = {
      hasImage: allBiz.filter(b => b.image && !b.image.includes('placeholder')).length,
      hasPhotosArray: allBiz.filter(b => b.photos && b.photos.length > 0).length,
      hasMultiplePhotos: allBiz.filter(b => b.photos && b.photos.length > 1).length,
      hasHours: allBiz.filter(b => b.hours && Object.keys(b.hours).length > 0).length,
      hasWebsite: allBiz.filter(b => b.website).length,
      hasPhone: allBiz.filter(b => b.phone).length,
    }

    console.log(`Has primary image (not placeholder): ${stats.hasImage}/${allBiz.length}`)
    console.log(`Has photos array (>0): ${stats.hasPhotosArray}/${allBiz.length}`)
    console.log(`Has multiple photos (>1): ${stats.hasMultiplePhotos}/${allBiz.length}`)
    console.log(`Has hours: ${stats.hasHours}/${allBiz.length}`)
    console.log(`Has website: ${stats.hasWebsite}/${allBiz.length}`)
    console.log(`Has phone: ${stats.hasPhone}/${allBiz.length}`)
  }

  // 5. Rating distribution
  console.log('\n--- RATING DISTRIBUTION ---')
  const { data: ratings } = await supabase
    .from('businesses')
    .select('rating')

  if (ratings) {
    const dist: Record<string, number> = {
      '5.0': 0,
      '4.5-4.9': 0,
      '4.0-4.4': 0,
      '3.5-3.9': 0,
      '3.0-3.4': 0,
      '2.5-2.9': 0,
      '<2.5': 0,
    }

    for (const b of ratings) {
      const r = b.rating || 0
      if (r === 5) dist['5.0']++
      else if (r >= 4.5) dist['4.5-4.9']++
      else if (r >= 4) dist['4.0-4.4']++
      else if (r >= 3.5) dist['3.5-3.9']++
      else if (r >= 3) dist['3.0-3.4']++
      else if (r >= 2.5) dist['2.5-2.9']++
      else dist['<2.5']++
    }

    for (const [range, count] of Object.entries(dist)) {
      if (count > 0) {
        console.log(`  ${range}: ${count} (${(count/ratings.length*100).toFixed(1)}%)`)
      }
    }
  }

  // 6. By city
  console.log('\n--- BY CITY ---')
  const { data: cities } = await supabase
    .from('businesses')
    .select('address_city')

  if (cities) {
    const cityCounts: Record<string, number> = {}
    for (const b of cities) {
      cityCounts[b.address_city] = (cityCounts[b.address_city] || 0) + 1
    }
    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])
    for (const [city, count] of sorted.slice(0, 15)) {
      console.log(`  ${city}: ${count}`)
    }
  }

  // 7. By category
  console.log('\n--- BY CATEGORY ---')
  const { data: cats } = await supabase
    .from('businesses')
    .select('category')

  if (cats) {
    const catCounts: Record<string, number> = {}
    for (const b of cats) {
      catCounts[b.category] = (catCounts[b.category] || 0) + 1
    }
    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1])
    for (const [cat, count] of sorted) {
      console.log(`  ${cat}: ${count}`)
    }
  }

  // 8. Check actual photos array content
  console.log('\n--- PHOTOS ARRAY INSPECTION ---')
  const { data: photosCheck } = await supabase
    .from('businesses')
    .select('name, image, photos')
    .not('photos', 'is', null)
    .limit(3)

  if (photosCheck) {
    for (const b of photosCheck) {
      console.log(`\n${b.name}:`)
      console.log(`  image: ${b.image?.substring(0, 50)}...`)
      console.log(`  photos: ${JSON.stringify(b.photos)?.substring(0, 100)}...`)
      console.log(`  photos count: ${Array.isArray(b.photos) ? b.photos.length : 'not array'}`)
    }
  }

  console.log('\n' + '═'.repeat(60))
}

assess().catch(console.error)

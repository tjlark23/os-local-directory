/**
 * Check data quality - ratings, photos, distribution
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function main() {
  console.log('═'.repeat(60))
  console.log('DATA QUALITY CHECK')
  console.log('═'.repeat(60))
  console.log()

  // Total count
  const { count: total } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log(`Total businesses: ${total}`)
  console.log()

  // Top reviewed businesses
  console.log('TOP 10 MOST REVIEWED:')
  const { data: topReviewed } = await supabase
    .from('businesses')
    .select('name, rating, review_count, photos, address_city')
    .order('review_count', { ascending: false })
    .limit(10)

  if (topReviewed) {
    for (const b of topReviewed) {
      const photoCount = Array.isArray(b.photos) ? b.photos.length : 0
      console.log(`  ${b.name}`)
      console.log(`    Rating: ${b.rating} | Reviews: ${b.review_count} | Photos: ${photoCount} | City: ${b.address_city}`)
    }
  }
  console.log()

  // Rating distribution - need to fetch all (no limit)
  console.log('RATING DISTRIBUTION:')
  const { data: ratings } = await supabase
    .from('businesses')
    .select('rating')
    .range(0, 9999)

  if (ratings) {
    const ratingCounts: Record<string, number> = {}
    for (const r of ratings) {
      const bucket = r.rating === null ? 'No rating' : String(Math.floor(r.rating))
      ratingCounts[bucket] = (ratingCounts[bucket] || 0) + 1
    }
    const sorted = Object.entries(ratingCounts).sort((a, b) => b[0].localeCompare(a[0]))
    for (const [rating, count] of sorted) {
      console.log(`  ${rating} stars: ${count} businesses`)
    }
  }
  console.log()

  // Photo distribution
  console.log('PHOTO DISTRIBUTION:')
  const { data: allPhotos } = await supabase
    .from('businesses')
    .select('photos')
    .range(0, 9999)

  if (allPhotos) {
    let noPhotos = 0, onePhoto = 0, multiPhotos = 0
    for (const b of allPhotos) {
      if (!b.photos || !Array.isArray(b.photos) || b.photos.length === 0) noPhotos++
      else if (b.photos.length === 1) onePhoto++
      else multiPhotos++
    }
    console.log(`  No photos: ${noPhotos}`)
    console.log(`  1 photo: ${onePhoto}`)
    console.log(`  Multiple photos: ${multiPhotos}`)
  }
  console.log()

  // City distribution
  console.log('CITY DISTRIBUTION:')
  const { data: cities } = await supabase
    .from('businesses')
    .select('address_city')
    .range(0, 9999)

  if (cities) {
    const cityCounts: Record<string, number> = {}
    for (const c of cities) {
      cityCounts[c.address_city] = (cityCounts[c.address_city] || 0) + 1
    }
    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])
    for (const [city, count] of sorted) {
      console.log(`  ${city}: ${count}`)
    }
  }
  console.log()

  // Category distribution
  console.log('CATEGORY DISTRIBUTION:')
  const { data: cats } = await supabase
    .from('businesses')
    .select('category')
    .range(0, 9999)

  if (cats) {
    const catCounts: Record<string, number> = {}
    for (const c of cats) {
      catCounts[c.category] = (catCounts[c.category] || 0) + 1
    }
    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1])
    for (const [cat, count] of sorted) {
      console.log(`  ${cat}: ${count}`)
    }
  }
  console.log()

  // Check hours data
  console.log('HOURS DATA:')
  const { data: hours } = await supabase
    .from('businesses')
    .select('hours')
    .limit(5)

  let hasHours = 0, noHours = 0
  const { data: allHours } = await supabase.from('businesses').select('hours').range(0, 9999)
  if (allHours) {
    for (const h of allHours) {
      if (h.hours && typeof h.hours === 'object') hasHours++
      else noHours++
    }
  }
  console.log(`  With hours: ${hasHours}`)
  console.log(`  Without hours: ${noHours}`)
  console.log()

  console.log('═'.repeat(60))
  console.log('CHECK COMPLETE')
  console.log('═'.repeat(60))
}

main().catch(console.error)

/**
 * Verify the imported data
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function verify() {
  console.log('═'.repeat(60))
  console.log('VERIFYING IMPORTED DATA')
  console.log('═'.repeat(60))
  console.log()

  // Total count
  const { count: totalCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log(`Total businesses in database: ${totalCount}`)
  console.log()

  // By category
  console.log('BY CATEGORY:')
  const { data: allData } = await supabase
    .from('businesses')
    .select('category')

  if (allData) {
    const categoryCounts: Record<string, number> = {}
    for (const row of allData) {
      categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1
    }
    const sorted = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
    for (const [cat, count] of sorted) {
      console.log(`  ${cat}: ${count}`)
    }
  }
  console.log()

  // By city
  console.log('BY CITY:')
  const { data: cityData } = await supabase
    .from('businesses')
    .select('address_city')

  if (cityData) {
    const cityCounts: Record<string, number> = {}
    for (const row of cityData) {
      cityCounts[row.address_city] = (cityCounts[row.address_city] || 0) + 1
    }
    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])
    for (const [city, count] of sorted) {
      console.log(`  ${city}: ${count}`)
    }
  }
  console.log()

  // Sample businesses
  console.log('SAMPLE BUSINESSES:')
  const { data: samples } = await supabase
    .from('businesses')
    .select('name, category, address_city, rating, review_count')
    .order('rating', { ascending: false })
    .limit(10)

  if (samples) {
    for (const biz of samples) {
      console.log(`  ${biz.name} (${biz.category}) - ${biz.address_city} - ${biz.rating}★ (${biz.review_count} reviews)`)
    }
  }

  console.log()
  console.log('═'.repeat(60))
}

verify().catch(console.error)

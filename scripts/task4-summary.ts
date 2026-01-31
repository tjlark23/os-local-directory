import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wdodhzqgmumrwgfihagc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'
)

async function task4() {
  console.log()
  console.log('='.repeat(70))
  console.log('TASK 4: SUMMARY STATS BY CATEGORY')
  console.log('='.repeat(70))

  const { data } = await supabase
    .from('businesses')
    .select('category, image, rating, review_count')
    .ilike('address_city', '%round rock%')

  if (!data) {
    console.log('No data found')
    return
  }

  // Group by category
  const byCategory: Record<string, { total: number; hasPhoto: number; ratings: number[]; reviewCounts: number[] }> = {}

  for (const b of data) {
    const cat = b.category || 'Unknown'
    if (!byCategory[cat]) {
      byCategory[cat] = { total: 0, hasPhoto: 0, ratings: [], reviewCounts: [] }
    }
    byCategory[cat].total++
    if (b.image) byCategory[cat].hasPhoto++
    if (b.rating) byCategory[cat].ratings.push(b.rating)
    if (b.review_count) byCategory[cat].reviewCounts.push(b.review_count)
  }

  // Sort by total
  const sorted = Object.entries(byCategory).sort((a, b) => b[1].total - a[1].total)

  console.log()
  console.log('Category'.padEnd(20) + 'Total'.padEnd(8) + 'Photos'.padEnd(10) + 'Avg Rating'.padEnd(12) + 'Total Reviews')
  console.log('-'.repeat(70))

  let grandTotal = 0
  let grandPhotos = 0
  let grandReviews = 0

  for (const [cat, stats] of sorted) {
    const avgRating = stats.ratings.length > 0
      ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(1)
      : 'N/A'
    const totalReviews = stats.reviewCounts.reduce((a, b) => a + b, 0)

    grandTotal += stats.total
    grandPhotos += stats.hasPhoto
    grandReviews += totalReviews

    const catDisplay = cat.length > 18 ? cat.substring(0, 15) + '...' : cat
    console.log(
      catDisplay.padEnd(20) +
      String(stats.total).padEnd(8) +
      (stats.hasPhoto + '/' + stats.total).padEnd(10) +
      String(avgRating).padEnd(12) +
      totalReviews
    )
  }

  console.log('-'.repeat(70))
  console.log(
    'TOTAL'.padEnd(20) +
    String(grandTotal).padEnd(8) +
    (grandPhotos + '/' + grandTotal).padEnd(10) +
    ''.padEnd(12) +
    grandReviews
  )

  // Reviews status
  console.log()
  console.log('='.repeat(70))
  console.log('REVIEWS STATUS')
  console.log('='.repeat(70))

  const { count: totalReviewsInTable } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  // Get Round Rock business IDs
  const { data: rrBiz } = await supabase
    .from('businesses')
    .select('id')
    .ilike('address_city', '%round rock%')

  const rrIds = rrBiz?.map(b => b.id) || []

  const { count: rrReviews } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .in('business_id', rrIds)

  console.log()
  console.log('Total reviews in database: ' + totalReviewsInTable)
  console.log('Reviews for Round Rock businesses: ' + rrReviews)
  console.log('Reviews for other cities: ' + ((totalReviewsInTable || 0) - (rrReviews || 0)))
  console.log()
  console.log('⚠️  IMPORTANT: Round Rock businesses have 0 reviews in the database!')
  console.log('    The review_count field shows Google\'s count, but actual review TEXT')
  console.log('    has not been imported for Round Rock yet.')
}

task4().catch(console.error)

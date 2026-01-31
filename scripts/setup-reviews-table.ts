/**
 * Setup reviews table in Supabase
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function main() {
  console.log('═'.repeat(60))
  console.log('CHECKING REVIEWS TABLE')
  console.log('═'.repeat(60))
  console.log()

  // Check if reviews table exists and get count
  const { count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.log('Reviews table status:', error.message)

    if (error.message.includes('does not exist')) {
      console.log('\nReviews table does not exist. Creating it...')

      // Note: We can't create tables via Supabase JS client
      // We need to use raw SQL. Let me check if we can use rpc
      console.log('\nTo create the reviews table, run this SQL in Supabase:')
      console.log('─'.repeat(60))
      console.log(`
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    author_name TEXT,
    author_id TEXT,
    author_image TEXT,
    author_link TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT,
    review_date TIMESTAMPTZ,
    review_timestamp BIGINT,
    review_id TEXT UNIQUE,
    review_link TEXT,
    likes INTEGER DEFAULT 0,
    owner_response TEXT,
    owner_response_date TIMESTAMPTZ,
    source TEXT DEFAULT 'google',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_id ON reviews(review_id);
      `)
      console.log('─'.repeat(60))
    }
  } else {
    console.log('Reviews table exists!')
    console.log(`Current review count: ${count}`)

    // Get sample review if any exist
    if (count && count > 0) {
      const { data: sample } = await supabase
        .from('reviews')
        .select('*')
        .limit(1)

      if (sample && sample.length > 0) {
        console.log('\nSample review structure:')
        console.log(JSON.stringify(sample[0], null, 2))
      }
    }

    // Get table info
    const { data: sampleSchema } = await supabase
      .from('reviews')
      .select('*')
      .limit(0)

    console.log('\nReviews table is ready for import!')
  }
}

main().catch(console.error)

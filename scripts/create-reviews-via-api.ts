/**
 * Create reviews table using Supabase Management API
 */

const PROJECT_REF = 'wdodhzqgmumrwgfihagc'
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

// Split into individual statements to execute separately
const SQL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    author_name TEXT,
    author_id TEXT,
    author_image TEXT,
    author_link TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    review_date TIMESTAMPTZ,
    review_timestamp BIGINT,
    review_id TEXT UNIQUE NOT NULL,
    review_link TEXT,
    likes INTEGER DEFAULT 0,
    owner_response TEXT,
    owner_response_date TIMESTAMPTZ,
    source TEXT DEFAULT 'google',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id)`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_review_id ON reviews(review_id)`,
  `ALTER TABLE reviews ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews`,
  `CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true)`,
  `DROP POLICY IF EXISTS "Service role can insert reviews" ON reviews`,
  `CREATE POLICY "Service role can insert reviews" ON reviews FOR INSERT WITH CHECK (true)`,
  `DROP POLICY IF EXISTS "Service role can update reviews" ON reviews`,
  `CREATE POLICY "Service role can update reviews" ON reviews FOR UPDATE USING (true)`,
]

async function executeSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Try using the Supabase rpc endpoint for running raw SQL
    // This requires a function to be set up, so let's try direct HTTP API

    // Actually, let's try using the postgres-meta API
    const response = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    })

    if (response.ok) {
      return { success: true }
    }

    // If that fails, the table might already exist or we need a different approach
    const text = await response.text()
    return { success: false, error: `${response.status}: ${text}` }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('CREATING REVIEWS TABLE VIA API')
  console.log('═'.repeat(60))
  console.log()

  // First, let's check if the reviews table exists by trying to query it
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data, error: checkError } = await supabase
    .from('reviews')
    .select('id')
    .limit(1)

  if (checkError && checkError.message.includes('does not exist')) {
    console.log('Reviews table does not exist. Need to create it.')
    console.log()
    console.log('⚠️  Cannot create table via API - need to run SQL manually.')
    console.log()
    console.log('Please copy and run this SQL in Supabase SQL Editor:')
    console.log('https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/sql/new')
    console.log()
    console.log('─'.repeat(60))
    console.log(SQL_STATEMENTS.join(';\n\n') + ';')
    console.log('─'.repeat(60))
  } else if (checkError) {
    console.log('Error checking table:', checkError.message)
  } else {
    console.log('Reviews table already exists!')
    console.log('Ready to import reviews.')
  }
}

main().catch(console.error)

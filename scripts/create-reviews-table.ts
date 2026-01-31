/**
 * Create reviews table in Supabase using raw SQL via the REST API
 */

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const CREATE_TABLE_SQL = `
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
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
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_id ON reviews(review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY IF NOT EXISTS "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

-- Create policy for insert with service role
CREATE POLICY IF NOT EXISTS "Service role can insert reviews"
    ON reviews FOR INSERT
    WITH CHECK (true);
`

async function main() {
  console.log('═'.repeat(60))
  console.log('CREATING REVIEWS TABLE')
  console.log('═'.repeat(60))
  console.log()

  // Use the Supabase SQL endpoint
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: CREATE_TABLE_SQL })
  })

  if (!response.ok) {
    // Try alternative: direct postgres connection info
    console.log('RPC method not available, trying alternative...')
    console.log()
    console.log('Please run the following SQL in Supabase SQL Editor:')
    console.log('URL: https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/sql')
    console.log()
    console.log('─'.repeat(60))
    console.log(CREATE_TABLE_SQL)
    console.log('─'.repeat(60))

    // Try to create via Supabase Management API
    console.log()
    console.log('Alternatively, copy the SQL above and run it manually.')
  } else {
    const result = await response.json()
    console.log('Table created successfully!')
    console.log(result)
  }
}

main().catch(console.error)

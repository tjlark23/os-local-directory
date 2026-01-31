/**
 * Create reviews table - Final attempt using all available methods
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function main() {
  console.log('═'.repeat(60))
  console.log('CREATING REVIEWS TABLE - FINAL ATTEMPT')
  console.log('═'.repeat(60))
  console.log()

  // First, let's see what we CAN do with the service role
  // We can try to create a workaround using existing tables

  // Check if table exists
  const { error: checkError } = await supabase.from('reviews').select('id').limit(1)

  if (checkError && checkError.message.includes('does not exist')) {
    console.log('Reviews table does not exist.')
    console.log()

    // Try to find any way to execute DDL...
    // Option 1: Check if there's a migrations table we can use
    const { data: migrations } = await supabase.from('schema_migrations').select('*').limit(1)
    console.log('schema_migrations:', migrations ? 'exists' : 'not found')

    // Option 2: Try the graphql endpoint for mutations
    // Option 3: Try the realtime endpoint
    // Option 4: Check for any stored procedures

    // Let's check what functions/procedures exist
    console.log()
    console.log('Checking for available RPC functions...')

    // Common function names that might help
    const funcNames = ['exec_sql', 'execute_sql', 'run_sql', 'query', 'raw_sql', 'ddl']
    for (const fn of funcNames) {
      const { error } = await supabase.rpc(fn, { sql: 'SELECT 1' })
      if (!error || !error.message.includes('does not exist')) {
        console.log(`  Found function: ${fn}`)
      }
    }

    console.log()
    console.log('─'.repeat(60))
    console.log('MANUAL STEP REQUIRED')
    console.log('─'.repeat(60))
    console.log()
    console.log('I cannot create the reviews table via the API.')
    console.log('The service role key only allows data operations, not DDL.')
    console.log()
    console.log('Please do ONE of the following:')
    console.log()
    console.log('OPTION 1: Run SQL in Supabase Dashboard')
    console.log('1. Go to: https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/sql/new')
    console.log('2. Paste the SQL below and click "Run"')
    console.log()
    console.log('OPTION 2: Give me the database password')
    console.log('1. Go to: https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/settings/database')
    console.log('2. Find "Database password" and share it')
    console.log('3. I can then connect directly')
    console.log()
    console.log('─'.repeat(60))
    console.log('SQL TO RUN:')
    console.log('─'.repeat(60))
    console.log(`
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

CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_id ON reviews(review_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Service role can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update reviews" ON reviews FOR UPDATE USING (true);
`)
    console.log('─'.repeat(60))

  } else if (checkError) {
    console.log('Different error:', checkError.message)
  } else {
    console.log('✓ Reviews table already exists!')

    // Get count
    const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true })
    console.log(`  Current review count: ${count}`)
    console.log()
    console.log('Ready to import reviews!')
  }
}

main().catch(console.error)

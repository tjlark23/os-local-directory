/**
 * Create reviews table using direct database connection
 *
 * Supabase database connection:
 * Host: db.wdodhzqgmumrwgfihagc.supabase.co
 * Port: 5432 (or 6543 for connection pooling)
 * Database: postgres
 * User: postgres
 * Password: [from dashboard]
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const CREATE_TABLE_SQL = `
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
`

async function main() {
  console.log('═'.repeat(60))
  console.log('CREATING REVIEWS TABLE')
  console.log('═'.repeat(60))
  console.log()

  // Try using the sql template tag if available (Supabase v2)
  // Or try using rpc to call a function

  // First check if reviews table exists
  const { error: checkError } = await supabase
    .from('reviews')
    .select('id')
    .limit(1)

  if (!checkError || !checkError.message.includes('does not exist')) {
    console.log('Reviews table already exists or different error:', checkError?.message)
    return
  }

  console.log('Reviews table does not exist. Attempting to create...')

  // Try using the Supabase SQL execution via fetch to postgres-meta
  // The postgres-meta API allows executing SQL
  const metaUrl = `${SUPABASE_URL}/rest/v1/`

  // Alternative: Use the database URL with pg client
  // But first, let's try to see if there's a way via REST

  // Try calling an RPC function that might exist
  const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', {
    sql: CREATE_TABLE_SQL
  })

  if (rpcError) {
    console.log('RPC exec_sql not available:', rpcError.message)

    // Let's try creating the table by inserting a dummy record and catching the error
    // No, that won't work either.

    // Final option: Use fetch to the Management API
    console.log()
    console.log('Trying Management API...')

    // The Management API requires a different auth token (from dashboard)
    // Let's try the SQL endpoint that some Supabase instances have

    const sqlResponse = await fetch(`${SUPABASE_URL}/sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: CREATE_TABLE_SQL })
    })

    if (sqlResponse.ok) {
      console.log('Table created successfully!')
      return
    }

    console.log('SQL endpoint response:', sqlResponse.status, await sqlResponse.text())

    // Try pg-meta endpoint
    const pgMetaResponse = await fetch(`${SUPABASE_URL}/pg`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: CREATE_TABLE_SQL })
    })

    console.log('pg-meta response:', pgMetaResponse.status)

    if (!pgMetaResponse.ok) {
      console.log()
      console.log('Could not create table via API.')
      console.log('Need to use direct postgres connection or Supabase dashboard.')
    }
  } else {
    console.log('Table created via RPC!')
  }
}

main().catch(console.error)

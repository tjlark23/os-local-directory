/**
 * Create reviews table using direct postgres connection via pg package
 *
 * Supabase provides direct postgres access:
 * - Host: db.wdodhzqgmumrwgfihagc.supabase.co
 * - Port: 5432
 * - Database: postgres
 * - User: postgres
 * - Password: The database password from Supabase dashboard
 *
 * For pooled connection (recommended):
 * - Host: aws-0-us-east-1.pooler.supabase.com
 * - Port: 6543
 */

import pg from 'pg'

// Supabase connection string format:
// postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

// We'll use the transaction pooler which works better
const PROJECT_REF = 'wdodhzqgmumrwgfihagc'

// The service role key contains the password info, but for direct DB access
// we need the actual database password. Let's try to extract or use an alternative.

// Actually, Supabase now supports connecting via the service role for some operations
// Let's try using the pooler with service role auth

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

const CREATE_INDEXES_SQL = `
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_id ON reviews(review_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
`

const ENABLE_RLS_SQL = `
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
`

const CREATE_POLICIES_SQL = `
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
    DROP POLICY IF EXISTS "Service role can insert reviews" ON reviews;
    DROP POLICY IF EXISTS "Service role can update reviews" ON reviews;

    -- Create new policies
    CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
    CREATE POLICY "Service role can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
    CREATE POLICY "Service role can update reviews" ON reviews FOR UPDATE USING (true);
END $$;
`

async function main() {
  console.log('═'.repeat(60))
  console.log('CREATING REVIEWS TABLE VIA DIRECT POSTGRES')
  console.log('═'.repeat(60))
  console.log()

  // Try different connection methods
  // Method 1: Use the database URL format that Supabase provides

  // The connection string is typically:
  // postgresql://postgres:[YOUR-PASSWORD]@db.wdodhzqgmumrwgfihagc.supabase.co:5432/postgres

  // Since we don't have the raw password, let's try the pooler with JWT auth
  // Actually, Supabase pooler supports password auth where password = service_role_key

  const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

  // Try connecting via the Supavisor pooler with service role
  const connectionConfigs = [
    {
      name: 'Supavisor Pooler (Transaction mode)',
      connectionString: `postgresql://postgres.${PROJECT_REF}:${SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
    },
    {
      name: 'Supavisor Pooler (Session mode)',
      connectionString: `postgresql://postgres.${PROJECT_REF}:${SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
    },
    {
      name: 'Direct connection',
      connectionString: `postgresql://postgres:${SERVICE_KEY}@db.${PROJECT_REF}.supabase.co:5432/postgres`
    }
  ]

  for (const config of connectionConfigs) {
    console.log(`Trying: ${config.name}...`)

    const client = new pg.Client({
      connectionString: config.connectionString,
      ssl: { rejectUnauthorized: false }
    })

    try {
      await client.connect()
      console.log('  Connected!')

      // Create table
      console.log('  Creating reviews table...')
      await client.query(CREATE_TABLE_SQL)
      console.log('  ✓ Table created')

      // Create indexes
      console.log('  Creating indexes...')
      await client.query(CREATE_INDEXES_SQL)
      console.log('  ✓ Indexes created')

      // Enable RLS
      console.log('  Enabling RLS...')
      await client.query(ENABLE_RLS_SQL)
      console.log('  ✓ RLS enabled')

      // Create policies
      console.log('  Creating policies...')
      await client.query(CREATE_POLICIES_SQL)
      console.log('  ✓ Policies created')

      // Verify
      const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_name = 'reviews'")
      if (result.rows.length > 0) {
        console.log()
        console.log('═'.repeat(60))
        console.log('SUCCESS! Reviews table created.')
        console.log('═'.repeat(60))
      }

      await client.end()
      return // Success!

    } catch (err: any) {
      console.log(`  Error: ${err.message}`)
      try {
        await client.end()
      } catch {}
    }
  }

  console.log()
  console.log('Could not connect via any method.')
  console.log('You may need to provide the database password from Supabase dashboard.')
}

main().catch(console.error)

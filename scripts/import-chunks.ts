/**
 * Import SQL chunks to Supabase using Service Role Key
 *
 * Usage: npx tsx scripts/import-chunks.ts <service_role_key>
 * Or: SUPABASE_SERVICE_ROLE_KEY=xxx npx tsx scripts/import-chunks.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2]

if (!SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required.')
  console.error('')
  console.error('Usage:')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/import-chunks.ts')
  console.error('  OR')
  console.error('  npx tsx scripts/import-chunks.ts your_service_role_key')
  console.error('')
  console.error('Get your Service Role Key from:')
  console.error('  https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/settings/api')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function importChunks() {
  const chunksDir = path.join(__dirname, '..', 'sql-chunks')
  const files = fs.readdirSync(chunksDir)
    .filter(f => f.startsWith('chunk-') && f.endsWith('.sql'))
    .sort()

  console.log(`Found ${files.length} chunk files to import\n`)

  let totalImported = 0
  let totalErrors = 0

  for (const file of files) {
    const filePath = path.join(chunksDir, file)
    const sql = fs.readFileSync(filePath, 'utf8')

    console.log(`Importing ${file}...`)

    try {
      // Use the Supabase REST API to execute raw SQL
      // This requires the service role key
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ query: sql })
      })

      if (!response.ok) {
        // Try alternative: direct database query via edge function or pg connection
        // For now, fall back to insert via REST API
        throw new Error(`SQL execution not available: ${response.status}`)
      }

      console.log(`  ✓ ${file} imported successfully`)
      totalImported++

    } catch (err) {
      console.log(`  ✗ ${file} failed: ${err instanceof Error ? err.message : err}`)
      totalErrors++

      // Try parsing and inserting via Supabase client
      console.log(`  Trying alternative import method...`)
      try {
        // Extract rows from SQL and insert via API
        const rowsMatch = sql.match(/VALUES\s*\n([\s\S]+);/s)
        if (rowsMatch) {
          // This is complex - SQL parsing would be needed
          // For simplicity, recommend manual import
          console.log(`  Alternative method requires manual import`)
        }
      } catch (altErr) {
        console.log(`  Alternative method also failed`)
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Import Summary:`)
  console.log(`  Successful: ${totalImported}`)
  console.log(`  Failed: ${totalErrors}`)
  console.log(`${'='.repeat(50)}`)

  if (totalErrors > 0) {
    console.log(`\nFor failed imports, please use Supabase SQL Editor:`)
    console.log(`  https://supabase.com/dashboard/project/wdodhzqgmumrwgfihagc/sql`)
    console.log(`  Copy contents of each chunk file and run manually`)
  }
}

importChunks().catch(console.error)

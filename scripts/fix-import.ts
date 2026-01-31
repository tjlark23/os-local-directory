/**
 * FIX IMPORT - Clear existing data and re-import from SQL chunks properly
 *
 * Strategy: Use Supabase's REST API directly for raw SQL execution
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Better row parser that handles edge cases
function parseBusinessRow(rowStr: string): Record<string, any> | null {
  try {
    // Clean up the row string
    let cleaned = rowStr.trim()

    // Remove leading ( and trailing ) or ),
    if (cleaned.startsWith('(')) cleaned = cleaned.slice(1)
    if (cleaned.endsWith('),')) cleaned = cleaned.slice(0, -2)
    else if (cleaned.endsWith(')')) cleaned = cleaned.slice(0, -1)

    // Parse fields using a state machine approach
    const fields: string[] = []
    let current = ''
    let inString = false
    let stringChar = ''
    let arrayDepth = 0
    let parenDepth = 0

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i]
      const nextChar = cleaned[i + 1] || ''

      if (!inString) {
        if (char === "'") {
          inString = true
          stringChar = "'"
          current += char
        } else if (char === 'A' && cleaned.slice(i, i + 6) === 'ARRAY[') {
          arrayDepth++
          current += 'ARRAY['
          i += 5 // Skip "RRAY["
        } else if (char === '[' && arrayDepth > 0) {
          arrayDepth++
          current += char
        } else if (char === ']') {
          arrayDepth = Math.max(0, arrayDepth - 1)
          current += char
        } else if (char === '(') {
          parenDepth++
          current += char
        } else if (char === ')') {
          parenDepth = Math.max(0, parenDepth - 1)
          current += char
        } else if (char === ',' && arrayDepth === 0 && parenDepth === 0) {
          fields.push(current.trim())
          current = ''
        } else {
          current += char
        }
      } else {
        // Inside a string
        if (char === stringChar) {
          if (nextChar === stringChar) {
            // Escaped quote
            current += char + nextChar
            i++ // Skip next char
          } else {
            // End of string
            inString = false
            current += char
          }
        } else {
          current += char
        }
      }
    }

    // Don't forget the last field
    if (current.trim()) {
      fields.push(current.trim())
    }

    // We expect 28 fields
    if (fields.length !== 28) {
      return null
    }

    // Parse each field
    const parseValue = (val: string, isArray: boolean = false): any => {
      if (val === 'NULL') return null
      if (val === 'TRUE' || val === 'true') return true
      if (val === 'FALSE' || val === 'false') return false

      // String value
      if (val.startsWith("'") && val.endsWith("'")) {
        return val.slice(1, -1).replace(/''/g, "'")
      }

      // Number
      if (!isNaN(Number(val)) && val !== '') {
        return Number(val)
      }

      // ARRAY
      if (val.startsWith('ARRAY[')) {
        const inner = val.slice(6, -1) // Remove ARRAY[ and ]
        if (inner === '') return []

        // Parse array elements
        const elements: string[] = []
        let elem = ''
        let inStr = false

        for (let i = 0; i < inner.length; i++) {
          const c = inner[i]
          const next = inner[i + 1] || ''

          if (!inStr && c === "'") {
            inStr = true
            elem += c
          } else if (inStr && c === "'") {
            if (next === "'") {
              elem += c + next
              i++
            } else {
              inStr = false
              elem += c
            }
          } else if (!inStr && c === ',') {
            elements.push(elem.trim())
            elem = ''
          } else {
            elem += c
          }
        }
        if (elem.trim()) elements.push(elem.trim())

        return elements.map(e => {
          if (e.startsWith("'") && e.endsWith("'")) {
            return e.slice(1, -1).replace(/''/g, "'")
          }
          return e
        })
      }

      // Empty array literal
      if (val === "'{}'") return []

      // JSON string (for hours)
      if (val.startsWith("'{") && val.endsWith("}'")) {
        try {
          return JSON.parse(val.slice(1, -1).replace(/''/g, "'"))
        } catch {
          return val.slice(1, -1)
        }
      }

      return val
    }

    // Map fields to columns
    const columns = [
      'location_id', 'slug', 'name', 'description',
      'category', 'subcategory', 'image', 'photos', 'videos',
      'phone', 'email', 'website',
      'address_street', 'address_city', 'address_state', 'address_zip',
      'latitude', 'longitude', 'hours',
      'rating', 'review_count', 'price_range',
      'specialties', 'amenities', 'tags',
      'listing_tier', 'is_featured', 'backlink_enabled'
    ]

    const arrayFields = ['photos', 'videos', 'specialties', 'amenities', 'tags']

    const obj: Record<string, any> = {}
    for (let i = 0; i < columns.length; i++) {
      obj[columns[i]] = parseValue(fields[i], arrayFields.includes(columns[i]))
    }

    return obj

  } catch (err) {
    return null
  }
}

async function importChunk(chunkNum: number): Promise<{ success: number; failed: number; duplicates: number }> {
  const fileName = `chunk-${String(chunkNum).padStart(3, '0')}.sql`
  const filePath = path.join(__dirname, '..', 'sql-chunks', fileName)

  if (!fs.existsSync(filePath)) {
    return { success: 0, failed: 0, duplicates: 0 }
  }

  const content = fs.readFileSync(filePath, 'utf8')

  // Extract VALUES section
  const valuesMatch = content.match(/VALUES\s*\n([\s\S]+);/s)
  if (!valuesMatch) {
    console.log(`  Could not parse ${fileName}`)
    return { success: 0, failed: 0, duplicates: 0 }
  }

  // Split by row pattern - each row starts with ('UUID
  const valuesBlock = valuesMatch[1].trim()
  const rowPattern = /\s*\('3714b0ea-56ae-426a-b2f1-5dff20efe29e'/g
  const splits = valuesBlock.split(rowPattern)

  // Reconstruct rows with the UUID
  const rows: string[] = []
  for (let i = 1; i < splits.length; i++) {
    rows.push("('3714b0ea-56ae-426a-b2f1-5dff20efe29e'" + splits[i])
  }

  let success = 0
  let failed = 0
  let duplicates = 0

  // Parse and insert in batches
  const BATCH_SIZE = 25
  const allParsed: Record<string, any>[] = []

  for (const row of rows) {
    const parsed = parseBusinessRow(row)
    if (parsed) {
      allParsed.push(parsed)
    } else {
      failed++
    }
  }

  // Insert in batches
  for (let i = 0; i < allParsed.length; i += BATCH_SIZE) {
    const batch = allParsed.slice(i, i + BATCH_SIZE)

    try {
      const { data, error } = await supabase
        .from('businesses')
        .upsert(batch, {
          onConflict: 'location_id,slug',
          ignoreDuplicates: true
        })
        .select('id')

      if (error) {
        if (error.message.includes('duplicate')) {
          duplicates += batch.length
        } else {
          console.log(`    Batch error: ${error.message}`)
          failed += batch.length
        }
      } else {
        success += data?.length || batch.length
      }
    } catch (err) {
      failed += batch.length
    }
  }

  return { success, failed, duplicates }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('FIXING IMPORT - RE-IMPORTING ALL DATA')
  console.log('═'.repeat(60))
  console.log()

  // First, get current count
  const { count: beforeCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log(`Before: ${beforeCount} businesses in database`)
  console.log()

  let totalSuccess = 0
  let totalFailed = 0
  let totalDuplicates = 0

  // Process all 10 chunks
  for (let i = 1; i <= 10; i++) {
    process.stdout.write(`Importing chunk ${i}/10... `)
    const result = await importChunk(i)
    totalSuccess += result.success
    totalFailed += result.failed
    totalDuplicates += result.duplicates
    console.log(`✓ ${result.success} new, ${result.duplicates} dupes, ${result.failed} failed`)
  }

  // Get final count
  const { count: afterCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log()
  console.log('═'.repeat(60))
  console.log('IMPORT COMPLETE')
  console.log('═'.repeat(60))
  console.log(`  New records: ${totalSuccess}`)
  console.log(`  Duplicates: ${totalDuplicates}`)
  console.log(`  Parse failures: ${totalFailed}`)
  console.log(`  Before: ${beforeCount}`)
  console.log(`  After: ${afterCount}`)
  console.log()
}

main().catch(console.error)

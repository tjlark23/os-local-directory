/**
 * Direct Import to Supabase using Service Role Key
 * Reads generated SQL and imports via Supabase client
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Parse a single SQL row into an object
function parseRow(row: string): Record<string, any> | null {
  try {
    // Remove leading/trailing whitespace and parentheses
    let cleaned = row.trim()
    if (cleaned.startsWith('(')) cleaned = cleaned.slice(1)
    if (cleaned.endsWith(')')) cleaned = cleaned.slice(0, -1)
    if (cleaned.endsWith('),')) cleaned = cleaned.slice(0, -2)

    // Split by comma, but handle quoted strings and arrays
    const values: string[] = []
    let current = ''
    let inString = false
    let inArray = false
    let depth = 0

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i]
      const prevChar = i > 0 ? cleaned[i-1] : ''

      if (char === "'" && prevChar !== "'") {
        inString = !inString
        current += char
      } else if (char === '[' || (char === 'A' && cleaned.slice(i, i+5) === 'ARRAY')) {
        inArray = true
        current += char
      } else if (char === ']') {
        inArray = false
        current += char
      } else if (char === '(' && !inString) {
        depth++
        current += char
      } else if (char === ')' && !inString) {
        depth--
        current += char
      } else if (char === ',' && !inString && !inArray && depth === 0) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    if (current.trim()) {
      values.push(current.trim())
    }

    // Map to column names
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

    if (values.length !== columns.length) {
      console.error(`Column mismatch: expected ${columns.length}, got ${values.length}`)
      return null
    }

    const obj: Record<string, any> = {}
    for (let i = 0; i < columns.length; i++) {
      let val = values[i]

      // Handle NULL
      if (val === 'NULL') {
        obj[columns[i]] = null
        continue
      }

      // Handle strings (remove quotes)
      if (val.startsWith("'") && val.endsWith("'")) {
        obj[columns[i]] = val.slice(1, -1).replace(/''/g, "'")
        continue
      }

      // Handle ARRAY[]
      if (val.startsWith('ARRAY[')) {
        const arrContent = val.slice(6, -1) // Remove ARRAY[ and ]
        if (arrContent === '') {
          obj[columns[i]] = []
        } else {
          // Parse array elements
          const elements: string[] = []
          let elem = ''
          let inStr = false
          for (const c of arrContent) {
            if (c === "'" && elem.slice(-1) !== "'") {
              inStr = !inStr
              elem += c
            } else if (c === ',' && !inStr) {
              elements.push(elem.trim())
              elem = ''
            } else {
              elem += c
            }
          }
          if (elem.trim()) elements.push(elem.trim())

          obj[columns[i]] = elements.map(e => {
            if (e.startsWith("'") && e.endsWith("'")) {
              return e.slice(1, -1).replace(/''/g, "'")
            }
            return e
          })
        }
        continue
      }

      // Handle empty array '{}'
      if (val === "'{}'") {
        obj[columns[i]] = []
        continue
      }

      // Handle boolean
      if (val === 'TRUE' || val === 'true') {
        obj[columns[i]] = true
        continue
      }
      if (val === 'FALSE' || val === 'false') {
        obj[columns[i]] = false
        continue
      }

      // Handle numbers
      if (!isNaN(Number(val))) {
        obj[columns[i]] = Number(val)
        continue
      }

      // Handle JSON (hours field)
      if (val.startsWith("'{") && val.endsWith("}'")) {
        try {
          obj[columns[i]] = JSON.parse(val.slice(1, -1).replace(/''/g, "'"))
        } catch {
          obj[columns[i]] = val.slice(1, -1)
        }
        continue
      }

      obj[columns[i]] = val
    }

    return obj
  } catch (err) {
    console.error('Parse error:', err)
    return null
  }
}

async function importChunk(chunkNum: number): Promise<{ success: number; errors: number }> {
  const fileName = `chunk-${String(chunkNum).padStart(3, '0')}.sql`
  const filePath = path.join(__dirname, '..', 'sql-chunks', fileName)

  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${fileName}`)
    return { success: 0, errors: 0 }
  }

  const content = fs.readFileSync(filePath, 'utf8')

  // Extract VALUES section
  const valuesMatch = content.match(/VALUES\s*\n([\s\S]+);/s)
  if (!valuesMatch) {
    console.log(`  Could not parse: ${fileName}`)
    return { success: 0, errors: 0 }
  }

  // Split into rows
  const valuesBlock = valuesMatch[1].trim()
  const rowStrings = valuesBlock.split(/\),\s*\n\s*\(/g)

  let success = 0
  let errors = 0
  const batchSize = 50
  const batches: Record<string, any>[][] = []

  // Parse all rows first
  const allRows: Record<string, any>[] = []
  for (let i = 0; i < rowStrings.length; i++) {
    let rowStr = rowStrings[i]
    // Add back parentheses that were removed by split
    if (i === 0 && !rowStr.startsWith('(')) rowStr = '(' + rowStr
    if (i === rowStrings.length - 1 && !rowStr.endsWith(')')) rowStr = rowStr + ')'

    const row = parseRow(rowStr)
    if (row) {
      allRows.push(row)
    } else {
      errors++
    }
  }

  // Split into batches
  for (let i = 0; i < allRows.length; i += batchSize) {
    batches.push(allRows.slice(i, i + batchSize))
  }

  // Insert batches
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    try {
      const { error } = await supabase
        .from('businesses')
        .insert(batch)

      if (error) {
        console.log(`    Batch ${i + 1}/${batches.length} error: ${error.message}`)
        errors += batch.length
      } else {
        success += batch.length
        process.stdout.write(`    Batch ${i + 1}/${batches.length}: ${batch.length} businesses inserted\r`)
      }
    } catch (err) {
      console.log(`    Batch ${i + 1} exception: ${err}`)
      errors += batch.length
    }
  }

  console.log(`    ${fileName}: ${success} success, ${errors} errors`)
  return { success, errors }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('IMPORTING BUSINESSES TO SUPABASE')
  console.log('═'.repeat(60))
  console.log()

  let totalSuccess = 0
  let totalErrors = 0

  for (let i = 1; i <= 10; i++) {
    console.log(`\nImporting chunk ${i}/10...`)
    const result = await importChunk(i)
    totalSuccess += result.success
    totalErrors += result.errors
  }

  console.log()
  console.log('═'.repeat(60))
  console.log('IMPORT COMPLETE')
  console.log('═'.repeat(60))
  console.log(`  Total Success: ${totalSuccess}`)
  console.log(`  Total Errors: ${totalErrors}`)
  console.log()

  // Verify count
  const { count, error } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  if (!error) {
    console.log(`  Database now has: ${count} businesses`)
  }
}

main().catch(console.error)

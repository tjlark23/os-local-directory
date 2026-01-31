/**
 * Import from Master SQL File - Direct parser for import-businesses.sql
 *
 * Reads the correct master SQL file and imports to Supabase
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

interface Business {
  location_id: string
  slug: string
  name: string
  description: string | null
  category: string
  subcategory: string | null
  image: string | null
  photos: string[]
  videos: string[]
  phone: string | null
  email: string | null
  website: string | null
  address_street: string | null
  address_city: string
  address_state: string
  address_zip: string | null
  latitude: number | null
  longitude: number | null
  hours: object | null
  rating: number | null
  review_count: number
  price_range: string | null
  specialties: string[]
  amenities: string[]
  tags: string[]
  listing_tier: string
  is_featured: boolean
  backlink_enabled: boolean
}

// Parse a SQL value row into a business object
function parseBusinessRow(rowContent: string): Business | null {
  try {
    // We expect the row to start with ( and end with )
    let content = rowContent.trim()
    if (content.startsWith('(')) content = content.slice(1)
    if (content.endsWith('),')) content = content.slice(0, -2)
    else if (content.endsWith(')')) content = content.slice(0, -1)

    // Parse fields using state machine
    const fields: string[] = []
    let current = ''
    let inString = false
    let stringQuote = ''
    let arrayDepth = 0
    let jsonDepth = 0

    for (let i = 0; i < content.length; i++) {
      const char = content[i]
      const nextChar = content[i + 1] || ''

      if (!inString) {
        // Check for string start
        if (char === "'") {
          inString = true
          stringQuote = "'"
          current += char
        }
        // Check for ARRAY[ start
        else if (content.slice(i, i + 6) === 'ARRAY[') {
          arrayDepth++
          current += 'ARRAY['
          i += 5
        }
        // Check for nested [ in array
        else if (char === '[' && arrayDepth > 0) {
          arrayDepth++
          current += char
        }
        // Check for ] end
        else if (char === ']' && arrayDepth > 0) {
          arrayDepth--
          current += char
        }
        // Check for JSON { start (not in string)
        else if (char === '{' && content[i-1] === "'") {
          // This is start of JSON string, already handled by string logic
          current += char
        }
        // Field separator
        else if (char === ',' && arrayDepth === 0 && jsonDepth === 0) {
          fields.push(current.trim())
          current = ''
        }
        else {
          current += char
        }
      } else {
        // Inside a string
        if (char === stringQuote) {
          if (nextChar === stringQuote) {
            // Escaped quote ''
            current += char + nextChar
            i++
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

    // Don't forget last field
    if (current.trim()) {
      fields.push(current.trim())
    }

    if (fields.length !== 28) {
      return null
    }

    // Parse individual field values
    const parseValue = (val: string, isArray: boolean = false): any => {
      val = val.trim()

      if (val === 'NULL') return null
      // Handle booleans with possible trailing characters
      if (val === 'TRUE' || val === 'true' || val === 'TRUE)' || val === 'true)') return true
      if (val === 'FALSE' || val === 'false' || val === 'FALSE)' || val === 'false)') return false

      // Empty array literal - '{}' in PostgreSQL represents empty array
      if (val === "'{}'" || val === "'{}'") return []

      // String value
      if (val.startsWith("'") && val.endsWith("'")) {
        const inner = val.slice(1, -1).replace(/''/g, "'")
        // '{}' is empty array in PostgreSQL
        if (inner === '{}') return isArray ? [] : {}
        // Check if it's JSON object (for hours field)
        if (inner.startsWith('{') && inner.endsWith('}') && !isArray) {
          try {
            return JSON.parse(inner)
          } catch {
            return inner
          }
        }
        return inner
      }

      // ARRAY[]
      if (val.startsWith('ARRAY[')) {
        const inner = val.slice(6, -1)
        if (inner === '' || inner === "''" || !inner) return []

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

      // Number
      if (!isNaN(Number(val)) && val !== '') {
        return Number(val)
      }

      return val
    }

    // Map to business object
    return {
      location_id: parseValue(fields[0]) as string,
      slug: parseValue(fields[1]) as string,
      name: parseValue(fields[2]) as string,
      description: parseValue(fields[3]) as string | null,
      category: parseValue(fields[4]) as string,
      subcategory: parseValue(fields[5]) as string | null,
      image: parseValue(fields[6]) as string | null,
      photos: parseValue(fields[7], true) as string[],
      videos: parseValue(fields[8], true) as string[],
      phone: parseValue(fields[9]) as string | null,
      email: parseValue(fields[10]) as string | null,
      website: parseValue(fields[11]) as string | null,
      address_street: parseValue(fields[12]) as string | null,
      address_city: parseValue(fields[13]) as string,
      address_state: parseValue(fields[14]) as string,
      address_zip: parseValue(fields[15]) as string | null,
      latitude: parseValue(fields[16]) as number | null,
      longitude: parseValue(fields[17]) as number | null,
      hours: parseValue(fields[18]) as object | null,
      rating: parseValue(fields[19]) as number | null,
      review_count: parseValue(fields[20]) as number,
      price_range: parseValue(fields[21]) as string | null,
      specialties: parseValue(fields[22], true) as string[],
      amenities: parseValue(fields[23], true) as string[],
      tags: parseValue(fields[24], true) as string[],
      listing_tier: parseValue(fields[25]) as string,
      is_featured: parseValue(fields[26]) as boolean,
      backlink_enabled: parseValue(fields[27]) as boolean,
    }

  } catch (err) {
    return null
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('IMPORTING FROM MASTER SQL FILE')
  console.log('═'.repeat(60))
  console.log()

  // Read master SQL file
  const sqlPath = path.join(__dirname, '..', 'import-businesses.sql')
  const content = fs.readFileSync(sqlPath, 'utf8')

  // Extract VALUES section - the file ends with );\n\n-- Import complete
  let valuesMatch = content.match(/VALUES\s*\n([\s\S]+?)\n;\s*\n/s)
  if (!valuesMatch) {
    console.log('Trying alternative pattern...')
    // Try alternative: find from VALUES to the semicolon line
    valuesMatch = content.match(/VALUES\s*\n([\s\S]+)\)\s*\n;/s)
    if (!valuesMatch) {
      console.error('Could not find VALUES section in SQL file')
      process.exit(1)
    }
  }

  const valuesBlock = valuesMatch[1].trim()

  // Split by row pattern - rows are separated by ),\n  (
  // Each row starts with  (' after the comma-newline
  const rowPattern = /\),\s*\n\s*\(/g
  const parts = valuesBlock.split(rowPattern)

  // Reconstruct rows - first part starts with (, others need ( added back
  const rows: string[] = []
  for (let i = 0; i < parts.length; i++) {
    let row = parts[i].trim()
    // Remove any trailing ) that might be left over
    if (row.endsWith(')')) {
      row = row.slice(0, -1).trim()
    }
    if (i === 0) {
      // First row already has (
      rows.push(row + ')')
    } else {
      // Other rows need ( added back
      rows.push('(' + row + ')')
    }
  }

  console.log(`Found ${rows.length} business rows in SQL file`)
  console.log()

  // Get current count
  const { count: beforeCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log(`Current database count: ${beforeCount}`)
  console.log()

  // Parse all rows
  const businesses: Business[] = []
  let parseFailures = 0

  for (let i = 0; i < rows.length; i++) {
    const parsed = parseBusinessRow(rows[i])
    if (parsed) {
      businesses.push(parsed)
    } else {
      parseFailures++
      if (parseFailures <= 5) {
        console.log(`Parse failure ${parseFailures}: Row ${i + 1}`)
        console.log(`  First 200 chars: ${rows[i].slice(0, 200)}...`)
      }
    }
  }

  console.log(`Successfully parsed: ${businesses.length}`)
  console.log(`Parse failures: ${parseFailures}`)
  console.log()

  if (businesses.length === 0) {
    console.log('No businesses parsed, exiting')
    process.exit(1)
  }

  // Use upsert to handle existing records
  console.log('Using upsert mode (will update existing, add new)...')
  console.log()

  // Insert in batches
  const BATCH_SIZE = 50
  let successCount = 0
  let errorCount = 0

  console.log(`Importing ${businesses.length} businesses in batches of ${BATCH_SIZE}...`)

  for (let i = 0; i < businesses.length; i += BATCH_SIZE) {
    const batch = businesses.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(businesses.length / BATCH_SIZE)

    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert(batch)
        .select('id')

      if (error) {
        console.log(`Batch ${batchNum}/${totalBatches} error: ${error.message}`)
        // Debug first item in batch
        if (batchNum <= 2) {
          console.log('Sample item videos:', JSON.stringify(batch[0].videos))
          console.log('Sample item amenities:', JSON.stringify(batch[0].amenities))
        }
        errorCount += batch.length
      } else {
        successCount += data?.length || batch.length
        process.stdout.write(`\rBatch ${batchNum}/${totalBatches}: ${successCount} imported`)
      }
    } catch (err) {
      console.log(`Batch ${batchNum} exception: ${err}`)
      errorCount += batch.length
    }
  }

  console.log()
  console.log()

  // Final count
  const { count: finalCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log('═'.repeat(60))
  console.log('IMPORT COMPLETE')
  console.log('═'.repeat(60))
  console.log(`  Parsed: ${businesses.length}`)
  console.log(`  Imported: ${successCount}`)
  console.log(`  Errors: ${errorCount}`)
  console.log(`  Parse failures: ${parseFailures}`)
  console.log(`  Final DB count: ${finalCount}`)
  console.log()
}

main().catch(console.error)

/**
 * Import the last 40 missing businesses
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const SUPABASE_URL = 'https://wdodhzqgmumrwgfihagc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkb2RoenFnbXVtcndnZmloYWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQzMDg5MywiZXhwIjoyMDg0MDA2ODkzfQ.37GkaFzO39tg-4ln_rXfjvZ_5BTwtNH5ls8GeswwdAE'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Parse a SQL value row into a business object
function parseBusinessRow(rowContent: string): Record<string, any> | null {
  try {
    let content = rowContent.trim()
    if (content.startsWith('(')) content = content.slice(1)
    if (content.endsWith(')')) content = content.slice(0, -1)
    if (content.endsWith('),')) content = content.slice(0, -2)

    const fields: string[] = []
    let current = ''
    let inString = false
    let arrayDepth = 0

    for (let i = 0; i < content.length; i++) {
      const char = content[i]
      const nextChar = content[i + 1] || ''

      if (!inString) {
        if (char === "'") {
          inString = true
          current += char
        } else if (content.slice(i, i + 6) === 'ARRAY[') {
          arrayDepth++
          current += 'ARRAY['
          i += 5
        } else if (char === '[' && arrayDepth > 0) {
          arrayDepth++
          current += char
        } else if (char === ']' && arrayDepth > 0) {
          arrayDepth--
          current += char
        } else if (char === ',' && arrayDepth === 0) {
          fields.push(current.trim())
          current = ''
        } else {
          current += char
        }
      } else {
        if (char === "'" && nextChar === "'") {
          current += char + nextChar
          i++
        } else if (char === "'") {
          inString = false
          current += char
        } else {
          current += char
        }
      }
    }

    if (current.trim()) {
      fields.push(current.trim())
    }

    if (fields.length !== 28) {
      console.log(`Field count: ${fields.length}`)
      return null
    }

    const parseValue = (val: string, isArray: boolean = false): any => {
      val = val.trim()

      // Clean up trailing )
      if (val.endsWith(')') && !val.includes('(') && !val.includes('[')) {
        val = val.slice(0, -1)
      }

      if (val === 'NULL') return null
      if (val === 'TRUE' || val === 'true') return true
      if (val === 'FALSE' || val === 'false') return false

      if (val === "'{}'" || val === "'{}'") return []

      if (val.startsWith("'") && val.endsWith("'")) {
        const inner = val.slice(1, -1).replace(/''/g, "'")
        if (inner === '{}') return isArray ? [] : {}
        if (inner.startsWith('{') && inner.endsWith('}') && !isArray) {
          try { return JSON.parse(inner) } catch { return inner }
        }
        return inner
      }

      if (val.startsWith('ARRAY[')) {
        const inner = val.slice(6, -1)
        if (!inner) return []

        const elements: string[] = []
        let elem = ''
        let inStr = false

        for (const c of inner) {
          if (!inStr && c === "'") {
            inStr = true
            elem += c
          } else if (inStr && c === "'") {
            elem += c
            inStr = false
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

      if (!isNaN(Number(val)) && val !== '') return Number(val)
      return val
    }

    return {
      location_id: parseValue(fields[0]),
      slug: parseValue(fields[1]),
      name: parseValue(fields[2]),
      description: parseValue(fields[3]),
      category: parseValue(fields[4]),
      subcategory: parseValue(fields[5]),
      image: parseValue(fields[6]),
      photos: parseValue(fields[7], true),
      videos: parseValue(fields[8], true),
      phone: parseValue(fields[9]),
      email: parseValue(fields[10]),
      website: parseValue(fields[11]),
      address_street: parseValue(fields[12]),
      address_city: parseValue(fields[13]),
      address_state: parseValue(fields[14]),
      address_zip: parseValue(fields[15]),
      latitude: parseValue(fields[16]),
      longitude: parseValue(fields[17]),
      hours: parseValue(fields[18]),
      rating: parseValue(fields[19]),
      review_count: parseValue(fields[20]),
      price_range: parseValue(fields[21]),
      specialties: parseValue(fields[22], true),
      amenities: parseValue(fields[23], true),
      tags: parseValue(fields[24], true),
      listing_tier: parseValue(fields[25]),
      is_featured: parseValue(fields[26]),
      backlink_enabled: parseValue(fields[27]),
    }
  } catch (err) {
    console.error('Parse error:', err)
    return null
  }
}

async function main() {
  console.log('Getting existing slugs from database...')

  // Get all existing slugs
  const { data: existing } = await supabase
    .from('businesses')
    .select('slug')

  const existingSlugs = new Set(existing?.map(b => b.slug) || [])
  console.log(`Found ${existingSlugs.size} existing businesses`)

  // Read SQL file
  const sqlPath = path.join(__dirname, '..', 'import-businesses.sql')
  const content = fs.readFileSync(sqlPath, 'utf8')

  // Parse all rows
  const valuesMatch = content.match(/VALUES\s*\n([\s\S]+?)\n;\s*\n/s)
  if (!valuesMatch) {
    console.error('Could not parse SQL')
    process.exit(1)
  }

  const valuesBlock = valuesMatch[1].trim()
  const parts = valuesBlock.split(/\),\s*\n\s*\(/g)

  const allRows: Record<string, any>[] = []
  for (let i = 0; i < parts.length; i++) {
    let row = parts[i].trim()
    if (row.endsWith(')')) row = row.slice(0, -1)
    if (i === 0) row = row + ')'
    else row = '(' + row + ')'

    const parsed = parseBusinessRow(row)
    if (parsed) allRows.push(parsed)
  }

  console.log(`Parsed ${allRows.length} businesses from SQL`)

  // Find missing businesses
  const missing = allRows.filter(b => !existingSlugs.has(b.slug))
  console.log(`Found ${missing.length} missing businesses`)

  if (missing.length === 0) {
    console.log('No missing businesses!')
    return
  }

  // Show sample
  console.log('Sample missing:')
  for (const m of missing.slice(0, 3)) {
    console.log(`  - ${m.name} (${m.slug})`)
  }

  // Insert missing
  console.log(`\nInserting ${missing.length} missing businesses...`)

  const { data, error } = await supabase
    .from('businesses')
    .insert(missing)
    .select('id')

  if (error) {
    console.error('Insert error:', error.message)
    // Try one by one
    console.log('Trying one by one...')
    let success = 0
    for (const biz of missing) {
      const { error: singleError } = await supabase
        .from('businesses')
        .insert(biz)

      if (singleError) {
        console.log(`  Failed: ${biz.name} - ${singleError.message}`)
      } else {
        success++
      }
    }
    console.log(`Inserted ${success} of ${missing.length}`)
  } else {
    console.log(`Successfully inserted ${data?.length || missing.length} businesses`)
  }

  // Final count
  const { count } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })

  console.log(`\nFinal database count: ${count}`)
}

main().catch(console.error)

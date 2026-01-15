/**
 * OutScraper CSV Import Script
 *
 * HOW TO USE (Tomorrow when you have the real CSV):
 *
 * 1. Export your OutScraper data as CSV
 *
 * 2. Place the CSV file in this directory as `outscraper-data.csv`
 *
 * 3. Run: npx tsx lib/data/import-outscraper.ts
 *
 * 4. This will generate a new `businesses-imported.ts` file
 *
 * 5. Replace the mock data in `businesses.ts` with the imported data
 *
 * 6. Run `npm run build` to verify everything works
 *
 * 7. Deploy to Vercel!
 */

import * as fs from 'fs'
import * as path from 'path'
import { importFromOutScraper, type OutScraperRow } from './index'

// Simple CSV parser (handles basic cases)
function parseCSV(csvContent: string): OutScraperRow[] {
  const lines = csvContent.split('\n')
  if (lines.length < 2) return []

  // Parse header row
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

  const rows: OutScraperRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV parsing (handles quoted fields with commas)
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    // Map values to OutScraperRow
    const row: Partial<OutScraperRow> = {}
    headers.forEach((header, index) => {
      const value = values[index] || ''
      const cleanValue = value.replace(/^"|"$/g, '')

      // Map common OutScraper column names
      switch (header.toLowerCase()) {
        case 'name':
          row.name = cleanValue
          break
        case 'site':
        case 'website':
          row.site = cleanValue
          break
        case 'phone':
        case 'phone_number':
          row.phone = cleanValue
          break
        case 'full_address':
        case 'address':
          row.full_address = cleanValue
          break
        case 'street':
          row.street = cleanValue
          break
        case 'city':
          row.city = cleanValue
          break
        case 'state':
          row.state = cleanValue
          break
        case 'postal_code':
        case 'zip':
          row.postal_code = cleanValue
          break
        case 'latitude':
        case 'lat':
          row.latitude = parseFloat(cleanValue) || undefined
          break
        case 'longitude':
        case 'lng':
          row.longitude = parseFloat(cleanValue) || undefined
          break
        case 'category':
        case 'type':
          row.category = cleanValue
          break
        case 'subtypes':
        case 'types':
          row.subtypes = cleanValue
          break
        case 'rating':
          row.rating = parseFloat(cleanValue) || undefined
          break
        case 'reviews':
        case 'reviews_count':
        case 'review_count':
          row.reviews = parseInt(cleanValue) || undefined
          break
        case 'photo':
        case 'photos':
        case 'main_photo':
          row.photo = cleanValue
          break
        case 'working_hours':
        case 'hours':
          row.working_hours = cleanValue
          break
        case 'verified':
          row.verified = cleanValue.toLowerCase() === 'true'
          break
        case 'price_range':
        case 'price_level':
          row.price_range = cleanValue
          break
        case 'description':
        case 'about':
          row.description = cleanValue
          break
        case 'place_id':
        case 'google_place_id':
          row.place_id = cleanValue
          break
        case 'reviews_per_score':
          row.reviews_per_score = cleanValue
          break
      }
    })

    if (row.name) {
      rows.push(row as OutScraperRow)
    }
  }

  return rows
}

// Main import function
async function main() {
  const csvPath = path.join(__dirname, 'outscraper-data.csv')

  if (!fs.existsSync(csvPath)) {
    console.log('❌ No CSV file found at:', csvPath)
    console.log('')
    console.log('To import OutScraper data:')
    console.log('1. Place your OutScraper CSV export at: lib/data/outscraper-data.csv')
    console.log('2. Run this script again: npx tsx lib/data/import-outscraper.ts')
    return
  }

  console.log('📂 Reading CSV file...')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')

  console.log('🔍 Parsing CSV data...')
  const rows = parseCSV(csvContent)
  console.log(`   Found ${rows.length} rows in CSV`)

  console.log('🏢 Converting to business format...')
  const businesses = importFromOutScraper(rows)
  console.log(`   Converted ${businesses.length} businesses for target cities`)

  // Count by city
  const cityCounts = {
    'Leander': businesses.filter(b => b.address.city === 'Leander').length,
    'Cedar Park': businesses.filter(b => b.address.city === 'Cedar Park').length,
    'Liberty Hill': businesses.filter(b => b.address.city === 'Liberty Hill').length,
  }
  console.log('   By city:', cityCounts)

  // Generate TypeScript file
  console.log('📝 Generating TypeScript file...')

  const outputContent = `// Auto-generated from OutScraper CSV import
// Generated at: ${new Date().toISOString()}
// Total businesses: ${businesses.length}

import { Business } from "../types"

export const importedBusinesses: Business[] = ${JSON.stringify(businesses, null, 2)}

export const IMPORTED_BUSINESS_COUNT = ${businesses.length}
`

  const outputPath = path.join(__dirname, 'businesses-imported.ts')
  fs.writeFileSync(outputPath, outputContent)

  console.log('')
  console.log('✅ Import complete!')
  console.log(`   Output file: ${outputPath}`)
  console.log('')
  console.log('Next steps:')
  console.log('1. Review the generated businesses-imported.ts file')
  console.log('2. Update businesses.ts to use the imported data')
  console.log('3. Run: npm run build')
  console.log('4. Deploy to Vercel!')
}

main().catch(console.error)

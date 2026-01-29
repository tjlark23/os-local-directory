/**
 * Split the large SQL file into smaller chunks for easier import
 */

import * as fs from 'fs'
import * as path from 'path'

const inputFile = path.join(__dirname, '..', 'import-businesses.sql')
const outputDir = path.join(__dirname, '..', 'sql-chunks')

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const content = fs.readFileSync(inputFile, 'utf8')

// Extract the header and footer
const headerMatch = content.match(/^(-- Generated.*?VALUES)\s*\n/s)
const header = headerMatch ? headerMatch[1] : ''

// Extract all value rows (each starts with a newline + spaces + '(')
const valuesMatch = content.match(/VALUES\s*\n([\s\S]+)\n;\s*\n/s)
if (!valuesMatch) {
  console.error('Could not find VALUES section')
  process.exit(1)
}

// Split by row - each row ends with ),\n or );\n
const valuesBlock = valuesMatch[1].trim()
const rows = valuesBlock.split(/\),\n\s*(?=\(')/g)

// Add back the opening paren that was split
const cleanRows = rows.map((row, i) => {
  if (i === 0) return row.trim()
  return '(' + row.trim()
})

// Remove trailing ) from last row if present
if (cleanRows.length > 0) {
  cleanRows[cleanRows.length - 1] = cleanRows[cleanRows.length - 1].replace(/\);?\s*$/, '')
}

console.log(`Total rows: ${cleanRows.length}`)

// Split into chunks of 500 rows each
const CHUNK_SIZE = 500
const chunks: string[][] = []
for (let i = 0; i < cleanRows.length; i += CHUNK_SIZE) {
  chunks.push(cleanRows.slice(i, i + CHUNK_SIZE))
}

console.log(`Created ${chunks.length} chunks of up to ${CHUNK_SIZE} rows each`)

// Write each chunk to a separate file
const sqlHeader = `-- Chunk import for WilCo Guide businesses
-- Run these in order: chunk-001.sql, chunk-002.sql, etc.

INSERT INTO businesses (
  location_id, slug, name, description,
  category, subcategory, image, photos, videos,
  phone, email, website,
  address_street, address_city, address_state, address_zip,
  latitude, longitude, hours,
  rating, review_count, price_range,
  specialties, amenities, tags,
  listing_tier, is_featured, backlink_enabled
) VALUES
`

for (let i = 0; i < chunks.length; i++) {
  const chunkNum = String(i + 1).padStart(3, '0')
  const fileName = `chunk-${chunkNum}.sql`
  const filePath = path.join(outputDir, fileName)

  const chunkContent = sqlHeader + chunks[i].join('),\n') + ');\n'
  fs.writeFileSync(filePath, chunkContent, 'utf8')

  console.log(`  Created ${fileName} with ${chunks[i].length} businesses`)
}

console.log(`\nAll chunks saved to: ${outputDir}`)
console.log('\nTo import:')
console.log('1. Go to Supabase SQL Editor')
console.log('2. Run each chunk file in order')
console.log('3. Or use: npx tsx scripts/import-chunks.ts <service_role_key>')

/**
 * Examine Outscraper Excel files to understand structure
 */

import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const DOWNLOADS_DIR = 'C:\\Users\\tjlar\\Downloads'

async function main() {
  console.log('═'.repeat(60))
  console.log('EXAMINING OUTSCRAPER EXCEL FILES')
  console.log('═'.repeat(60))
  console.log()

  // Find all Outscraper Excel files
  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.startsWith('Outscraper-') && f.endsWith('.xlsx'))
    .map(f => path.join(DOWNLOADS_DIR, f))

  console.log(`Found ${files.length} Excel files:`)
  for (const f of files) {
    const stats = fs.statSync(f)
    console.log(`  ${path.basename(f)} - ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
  }
  console.log()

  // Examine first file
  const firstFile = files[0]
  console.log(`Examining: ${path.basename(firstFile)}`)
  console.log('─'.repeat(60))

  const workbook = XLSX.readFile(firstFile)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  // Convert to JSON to get structure
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

  // Get headers (first row)
  const headers = data[0] as string[]
  console.log(`\nTotal columns: ${headers.length}`)
  console.log(`Total rows: ${data.length - 1}`)
  console.log()

  // Show all column names
  console.log('COLUMN NAMES:')
  console.log('─'.repeat(60))
  for (let i = 0; i < headers.length; i++) {
    console.log(`  ${i + 1}. ${headers[i]}`)
  }
  console.log()

  // Find review-related columns
  const reviewColumns = headers.filter(h =>
    h && (h.toLowerCase().includes('review') || h.toLowerCase().includes('author'))
  )
  console.log('REVIEW-RELATED COLUMNS:')
  for (const col of reviewColumns) {
    console.log(`  - ${col}`)
  }
  console.log()

  // Find photo-related columns
  const photoColumns = headers.filter(h =>
    h && h.toLowerCase().includes('photo')
  )
  console.log('PHOTO-RELATED COLUMNS:')
  for (const col of photoColumns) {
    console.log(`  - ${col}`)
  }
  console.log()

  // Show sample data (first 3 data rows)
  console.log('SAMPLE DATA (first 3 rows):')
  console.log('─'.repeat(60))

  const jsonData = XLSX.utils.sheet_to_json(sheet) as any[]

  for (let i = 0; i < Math.min(3, jsonData.length); i++) {
    const row = jsonData[i]
    console.log(`\nRow ${i + 1}:`)
    console.log(`  name: ${row['name']}`)
    console.log(`  address: ${row['address']?.substring(0, 50)}...`)
    console.log(`  place_id: ${row['place_id']}`)
    console.log(`  rating: ${row['rating']}`)
    console.log(`  reviews: ${row['reviews']}`)
    console.log(`  photo: ${row['photo']?.substring(0, 60)}...`)

    // Show review data if present
    const reviewText = row['google_maps_reviews.review_text'] || row['reviews_text']
    const reviewRating = row['google_maps_reviews.review_rating'] || row['review_rating']
    const authorName = row['google_maps_reviews.author_title'] || row['author_name']

    if (reviewText) {
      console.log(`  --- REVIEW DATA ---`)
      console.log(`  author: ${authorName}`)
      console.log(`  review_rating: ${reviewRating}`)
      console.log(`  review_text: ${reviewText?.substring(0, 80)}...`)
    }
  }

  // Count unique businesses vs total rows
  console.log()
  console.log('─'.repeat(60))
  const placeIds = new Set(jsonData.map(r => r['place_id']).filter(Boolean))
  console.log(`Unique place_ids in first file: ${placeIds.size}`)
  console.log(`Total rows: ${jsonData.length}`)
  console.log(`Average rows per business: ${(jsonData.length / placeIds.size).toFixed(1)}`)

  // Count rows with review text
  const rowsWithReviews = jsonData.filter(r =>
    r['google_maps_reviews.review_text'] || r['reviews_text'] || r['review_text']
  ).length
  console.log(`Rows with review text: ${rowsWithReviews}`)
}

main().catch(console.error)

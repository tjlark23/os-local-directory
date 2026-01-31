/**
 * Examine ALL Outscraper Excel files to find reviews
 */

import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const DOWNLOADS_DIR = 'C:\\Users\\tjlar\\Downloads'

async function main() {
  console.log('═'.repeat(60))
  console.log('EXAMINING ALL OUTSCRAPER EXCEL FILES FOR REVIEWS')
  console.log('═'.repeat(60))
  console.log()

  // Find all Outscraper Excel files
  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.startsWith('Outscraper-') && f.endsWith('.xlsx'))
    .map(f => path.join(DOWNLOADS_DIR, f))
    .sort((a, b) => fs.statSync(b).size - fs.statSync(a).size) // Largest first

  let totalRows = 0
  let totalUniqueBusinesses = new Set<string>()
  let totalRowsWithReviewText = 0
  let allReviewColumns = new Set<string>()

  for (const file of files) {
    const fileName = path.basename(file)
    const fileSize = (fs.statSync(file).size / 1024 / 1024).toFixed(2)

    console.log(`\n${'─'.repeat(60)}`)
    console.log(`FILE: ${fileName} (${fileSize} MB)`)
    console.log('─'.repeat(60))

    try {
      const workbook = XLSX.readFile(file)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[]
      const data = XLSX.utils.sheet_to_json(sheet) as any[]

      console.log(`  Columns: ${headers.length}`)
      console.log(`  Rows: ${data.length}`)

      totalRows += data.length

      // Find review columns
      const reviewCols = headers.filter(h =>
        h && (h.includes('review') || h.includes('author'))
      )

      for (const col of reviewCols) {
        allReviewColumns.add(col)
      }

      if (reviewCols.length > 0) {
        console.log(`  Review columns found: ${reviewCols.length}`)
        for (const col of reviewCols.slice(0, 10)) {
          console.log(`    - ${col}`)
        }
        if (reviewCols.length > 10) {
          console.log(`    ... and ${reviewCols.length - 10} more`)
        }
      }

      // Count unique businesses
      const placeIds = data.map(r => r['place_id']).filter(Boolean)
      for (const id of placeIds) {
        totalUniqueBusinesses.add(id)
      }
      const uniqueInFile = new Set(placeIds).size
      console.log(`  Unique businesses: ${uniqueInFile}`)

      // Check for review text
      const reviewTextCol = headers.find(h =>
        h && (h.includes('review_text') || h === 'review_text')
      )

      if (reviewTextCol) {
        const rowsWithText = data.filter(r => r[reviewTextCol]).length
        totalRowsWithReviewText += rowsWithText
        console.log(`  Rows with review text (${reviewTextCol}): ${rowsWithText}`)

        // Show sample review
        const sampleRow = data.find(r => r[reviewTextCol])
        if (sampleRow) {
          console.log(`\n  SAMPLE REVIEW:`)
          console.log(`    Business: ${sampleRow['name']}`)
          console.log(`    Author: ${sampleRow['google_maps_reviews.author_title'] || sampleRow['author_title'] || 'N/A'}`)
          console.log(`    Rating: ${sampleRow['google_maps_reviews.review_rating'] || sampleRow['review_rating'] || 'N/A'}`)
          console.log(`    Text: ${String(sampleRow[reviewTextCol]).substring(0, 100)}...`)
        }
      } else {
        console.log(`  No review text column found`)
      }

    } catch (err) {
      console.log(`  ERROR reading file: ${err}`)
    }
  }

  console.log()
  console.log('═'.repeat(60))
  console.log('SUMMARY')
  console.log('═'.repeat(60))
  console.log(`Total files: ${files.length}`)
  console.log(`Total rows across all files: ${totalRows}`)
  console.log(`Total unique businesses (by place_id): ${totalUniqueBusinesses.size}`)
  console.log(`Total rows with review text: ${totalRowsWithReviewText}`)
  console.log()
  console.log('All review-related columns found:')
  for (const col of Array.from(allReviewColumns).sort()) {
    console.log(`  - ${col}`)
  }
}

main().catch(console.error)

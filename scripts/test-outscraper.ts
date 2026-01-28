/**
 * Quick test of Outscraper API
 */

const OUTSCRAPER_API_KEY = 'OWEyMjRmNTZlYzY3NDU3N2IzYWRkMGU4MjUwNmRiYjV8ZjQ3Y2Y3MjM1YQ'
const OUTSCRAPER_BASE_URL = 'https://api.app.outscraper.com'

async function testOutscraper(): Promise<void> {
  console.log('Testing Outscraper API...\n')

  const query = 'Mexican restaurants in Leander, TX'
  const limit = 5

  const url = new URL(`${OUTSCRAPER_BASE_URL}/maps/search-v3`)
  url.searchParams.set('query', query)
  url.searchParams.set('limit', limit.toString())
  url.searchParams.set('language', 'en')
  url.searchParams.set('region', 'us')
  url.searchParams.set('async', 'false')
  url.searchParams.set('enrichment', 'true') // Get enriched data

  console.log(`Query: ${query}`)
  console.log(`URL: ${url.toString()}\n`)

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-API-KEY': OUTSCRAPER_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    console.log(`Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error: ${errorText}`)
      return
    }

    const data = await response.json()

    let results: any[] = []
    if (Array.isArray(data)) {
      results = data.flat()
    } else if (data.data && Array.isArray(data.data)) {
      results = data.data.flat()
    }

    console.log(`\nFound ${results.length} businesses:\n`)

    // Show raw first result to see all fields
    console.log('RAW FIRST RESULT:')
    console.log(JSON.stringify(results[0], null, 2))
    console.log('')

    for (const biz of results.slice(0, 5)) {
      console.log(`  Name: ${biz.name}`)
      console.log(`  Address: ${biz.full_address || biz.address}`)
      console.log(`  Street: ${biz.street}`)
      console.log(`  City: ${biz.city}`)
      console.log(`  Rating: ${biz.rating} (${biz.reviews} reviews)`)
      console.log(`  Phone: ${biz.phone}`)
      console.log(`  Website: ${biz.site || biz.website}`)
      console.log(`  Photos: ${biz.photos?.length || biz.photos_count || 0}`)
      console.log('')
    }

    console.log('API test successful!')

  } catch (err) {
    console.error('Error:', err)
  }
}

testOutscraper()

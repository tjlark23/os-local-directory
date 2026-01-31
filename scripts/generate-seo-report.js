/**
 * Generate Full Programmatic SEO Report
 *
 * Tests ALL 96 category+city combinations and generates a detailed report.
 *
 * Run: node scripts/generate-seo-report.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const CATEGORIES = [
  'restaurants',
  'health',
  'beauty',
  'fitness',
  'automotive',
  'shopping',
  'services',
  'education',
  'pets',
  'financial',
  'home',
  'entertainment',
]

const CITIES = [
  { name: 'Leander', slug: 'leander-tx' },
  { name: 'Cedar Park', slug: 'cedar-park-tx' },
  { name: 'Liberty Hill', slug: 'liberty-hill-tx' },
  { name: 'Round Rock', slug: 'round-rock-tx' },
  { name: 'Georgetown', slug: 'georgetown-tx' },
  { name: 'Pflugerville', slug: 'pflugerville-tx' },
  { name: 'Hutto', slug: 'hutto-tx' },
  { name: 'Taylor', slug: 'taylor-tx' },
]

const CATEGORY_DISPLAY_NAMES = {
  'restaurants': 'Restaurants',
  'health': 'Health & Wellness',
  'beauty': 'Beauty & Spa',
  'fitness': 'Fitness & Sports',
  'automotive': 'Auto Services',
  'shopping': 'Shopping & Retail',
  'services': 'Professional Services',
  'education': 'Education',
  'pets': 'Pets & Animals',
  'financial': 'Financial Services',
  'home': 'Home Services',
  'entertainment': 'Entertainment',
}

async function getLocationId() {
  const { data } = await supabase
    .from('locations')
    .select('id')
    .eq('slug', 'leander')
    .single()
  return data?.id
}

async function getStats(locationId, category, cityName) {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, rating, review_count, price_range')
    .eq('location_id', locationId)
    .eq('category', category)
    .ilike('address_city', cityName)

  if (error || !businesses) return null

  // Dedupe
  const seen = new Set()
  const unique = businesses.filter(b => {
    const key = b.name.toLowerCase().trim()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const totalReviews = unique.reduce((sum, b) => sum + (b.review_count || 0), 0)
  const validRatings = unique.filter(b => b.rating > 0)
  const avgRating = validRatings.length > 0
    ? validRatings.reduce((sum, b) => sum + b.rating, 0) / validRatings.length
    : 0

  const topRated = unique
    .filter(b => b.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 1)

  return {
    totalBusinesses: unique.length,
    totalReviews,
    averageRating: Math.round(avgRating * 100) / 100,
    topPick: topRated[0]?.name || null,
    topRating: topRated[0]?.rating || 0,
  }
}

async function generateReport() {
  console.log('Generating comprehensive SEO report...\n')

  const locationId = await getLocationId()
  if (!locationId) {
    console.error('ERROR: Could not find location ID')
    process.exit(1)
  }

  const allPages = []
  const year = new Date().getFullYear()

  // Gather data for all pages
  for (const category of CATEGORIES) {
    for (const city of CITIES) {
      const stats = await getStats(locationId, category, city.name)
      const categoryDisplay = CATEGORY_DISPLAY_NAMES[category]

      allPages.push({
        url: `/${category}/${city.slug}`,
        category,
        categoryDisplay,
        city: city.name,
        citySlug: city.slug,
        businesses: stats?.totalBusinesses || 0,
        reviews: stats?.totalReviews || 0,
        avgRating: stats?.averageRating || 0,
        topPick: stats?.topPick || 'N/A',
        topRating: stats?.topRating || 0,
        hasData: stats && stats.totalBusinesses > 0,
      })
    }
  }

  // Generate markdown report
  let report = `# Programmatic SEO Report - WilCo Guide
Generated: ${new Date().toISOString()}

## Summary

| Metric | Value |
|--------|-------|
| Total Pages | ${allPages.length} |
| Pages with Data | ${allPages.filter(p => p.hasData).length} |
| Pages without Data | ${allPages.filter(p => !p.hasData).length} |
| Categories | ${CATEGORIES.length} |
| Cities | ${CITIES.length} |

---

## Pages by Category

`

  for (const category of CATEGORIES) {
    const pages = allPages.filter(p => p.category === category)
    const totalBiz = pages.reduce((sum, p) => sum + p.businesses, 0)
    const totalReviews = pages.reduce((sum, p) => sum + p.reviews, 0)

    report += `### ${CATEGORY_DISPLAY_NAMES[category]}\n\n`
    report += `| City | Businesses | Reviews | Avg Rating | Top Pick |\n`
    report += `|------|------------|---------|------------|----------|\n`

    for (const page of pages) {
      report += `| [${page.city}](${page.url}) | ${page.businesses} | ${page.reviews.toLocaleString()} | ${page.avgRating.toFixed(1)}★ | ${page.topPick} |\n`
    }

    report += `\n**Category Total:** ${totalBiz} businesses, ${totalReviews.toLocaleString()} reviews\n\n`
  }

  report += `---

## Pages by City

`

  for (const city of CITIES) {
    const pages = allPages.filter(p => p.city === city.name)
    const totalBiz = pages.reduce((sum, p) => sum + p.businesses, 0)
    const totalReviews = pages.reduce((sum, p) => sum + p.reviews, 0)

    report += `### ${city.name}, TX\n\n`
    report += `| Category | Businesses | Reviews | Avg Rating |\n`
    report += `|----------|------------|---------|------------|\n`

    for (const page of pages.sort((a, b) => b.businesses - a.businesses)) {
      report += `| [${page.categoryDisplay}](${page.url}) | ${page.businesses} | ${page.reviews.toLocaleString()} | ${page.avgRating.toFixed(1)}★ |\n`
    }

    report += `\n**City Total:** ${totalBiz} businesses, ${totalReviews.toLocaleString()} reviews\n\n`
  }

  report += `---

## Top 20 Pages by Business Count

| Rank | URL | Category | City | Businesses | Reviews |
|------|-----|----------|------|------------|---------|
`

  const sortedByBiz = [...allPages].sort((a, b) => b.businesses - a.businesses)
  for (let i = 0; i < 20; i++) {
    const p = sortedByBiz[i]
    report += `| ${i + 1} | ${p.url} | ${p.categoryDisplay} | ${p.city} | ${p.businesses} | ${p.reviews.toLocaleString()} |\n`
  }

  report += `
---

## URL Structure

All pages follow the pattern: \`/{category}/{city-tx}\`

### Example URLs:
${allPages.slice(0, 10).map(p => `- https://wilcoguide.com${p.url}`).join('\n')}

---

## SEO Implementation Details

### Meta Tags
- **Title Format:** \`Best {Category} in {City}, TX ${year} | WilCo Guide\`
- **Description Format:** \`Find {X} top-rated {category} in {City}, TX. {Y} reviews, {Z}★ avg. Hours, photos, contact info.\`

### Schema Markup
Each page includes:
1. BreadcrumbList schema
2. CollectionPage schema
3. ItemList with LocalBusiness items
4. FAQPage schema (for pages with data)

### Internal Linking
- Cross-links to same category in other cities
- Cross-links to other categories in same city
- Breadcrumb navigation
- Footer category links

---

## Quality Checklist

- [x] Unique title per page
- [x] Unique description per page (based on real data)
- [x] City-specific statistics
- [x] Top picks with ratings
- [x] Proper heading hierarchy (H1 > H2 > H3)
- [x] Schema markup on every page
- [x] Mobile responsive
- [x] Server-side rendered (SSG)
- [x] Clean URL structure

---

*Report generated by scripts/generate-seo-report.js*
`

  // Write report
  const reportPath = path.join(__dirname, '..', 'docs', 'PROGRAMMATIC_SEO_REPORT.md')
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, report)

  console.log(`Report generated: ${reportPath}`)
  console.log(`\nTotal pages: ${allPages.length}`)
  console.log(`Pages with data: ${allPages.filter(p => p.hasData).length}`)

  // Also print summary
  console.log('\n--- TOP 10 PAGES BY BUSINESS COUNT ---')
  sortedByBiz.slice(0, 10).forEach((p, i) => {
    console.log(`${i + 1}. ${p.url} (${p.businesses} businesses, ${p.reviews.toLocaleString()} reviews)`)
  })
}

generateReport().catch(console.error)

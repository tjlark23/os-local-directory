# Programmatic SEO Setup - WilCo Guide

This document explains how the programmatic SEO page generation system works.

## Overview

The programmatic SEO system automatically generates unique pages for every category+city combination in our directory. With 12 categories and 8 cities, this creates **96 unique landing pages**, each optimized for local search.

## URL Structure

```
/{category}/{city-tx}
```

### Examples:
- `/restaurants/cedar-park-tx`
- `/dentists/round-rock-tx`
- `/plumbers/georgetown-tx`
- `/auto-repair/leander-tx`

## File Structure

```
components/programmatic/
├── DataAggregator.ts     # Stats aggregation logic
└── CategoryCityTemplate.tsx   # Page template component

lib/seo/
└── programmatic.ts       # SEO utilities (meta, schema)

app/(public)/[category]/[city]/
├── page.tsx              # Dynamic route handler
├── loading.tsx           # Loading skeleton
└── not-found.tsx         # 404 page
```

## How It Works

### 1. Data Aggregation (`DataAggregator.ts`)

The DataAggregator fetches and aggregates real data from Supabase:

```typescript
const stats = await getAggregatedStats('restaurants', 'Cedar Park')
// Returns:
// {
//   totalBusinesses: 126,
//   totalReviews: 117699,
//   averageRating: 4.5,
//   topRatedBusinesses: [...],
//   pricingDistribution: {...},
//   categoryInsights: {...}
// }
```

### 2. Unique Content Generation

Each page generates unique content based on real data:

```typescript
const content = generateUniqueContent('restaurants', 'Cedar Park', stats)
// Returns:
// {
//   intro: "Cedar Park offers an impressive selection of 126 restaurants...",
//   valueProps: ["117,699+ verified reviews...", "Average 4.5-star rating..."],
//   facts: ["There are 126 restaurants serving the Cedar Park area..."]
// }
```

### 3. SEO Meta Generation (`lib/seo/programmatic.ts`)

Meta tags are generated with real data:

```typescript
const meta = generatePageMeta('restaurants', 'Restaurants', city, stats)
// Returns:
// {
//   title: "Best Restaurants in Cedar Park, TX 2026 | WilCo Guide",
//   description: "Find 126 top-rated restaurants in Cedar Park, TX. 117,699 reviews, 4.5★ avg.",
//   keywords: [...],
//   canonical: "https://wilcoguide.com/restaurants/cedar-park-tx"
// }
```

### 4. Schema Markup

Each page includes structured data:

- **BreadcrumbList** - Navigation path
- **CollectionPage** - Page metadata
- **ItemList** - Top businesses with LocalBusiness schema
- **FAQPage** - Common questions about the category/city

## Adding New Categories

1. Add the category to `VALID_CATEGORIES` in `app/(public)/[category]/[city]/page.tsx`:

```typescript
const VALID_CATEGORIES = [
  'restaurants',
  'health',
  // ... add new category
  'lawn-care',  // New category
]
```

2. Add display name to `CATEGORY_DISPLAY_NAMES`:

```typescript
const CATEGORY_DISPLAY_NAMES = {
  // ... existing
  'lawn-care': 'Lawn Care & Landscaping',
}
```

3. Ensure businesses in the database have the matching category value.

## Adding New Cities

1. Add the city to `lib/locations-config.ts`:

```typescript
{
  slug: 'austin-tx',
  name: 'Austin',
  state: 'TX',
  fullName: 'Austin, TX',
  region: 'Travis County',
  hasData: true,  // Set true when data is available
  subdivisions: []
}
```

2. The system will automatically generate pages for all categories in the new city.

## Modifying the Template

The main template is in `components/programmatic/CategoryCityTemplate.tsx`.

### Key Sections:

1. **HeroSection** - Title, intro text, badges
2. **StatsBar** - Key metrics (businesses, reviews, rating)
3. **ValuePropositions** - Why use WilCo Guide
4. **TopPicksSection** - Highest rated & most reviewed
5. **PricingBreakdown** - Price range distribution
6. **BusinessListing** - Full grid of businesses
7. **RelatedCityLinks** - Same category in other cities
8. **RelatedCategoryLinks** - Other categories in same city
9. **UniqueFacts** - Data-driven facts section
10. **FAQSection** - Common questions

## SEO Best Practices Applied

### Content Uniqueness
- Every page has unique intro text based on stats
- Top picks are different per city
- Facts are generated from real data
- NOT just variable swaps

### Technical SEO
- Proper heading hierarchy (H1 > H2 > H3)
- Schema markup on every page
- Canonical tags
- OpenGraph tags
- Mobile responsive
- Server-side rendered (SSG)

### Internal Linking
- Hub and spoke model
- Cross-links to same category in other cities
- Cross-links to other categories in same city
- Breadcrumb navigation

## Quality Checklist

Before launching new pages:

- [ ] Each page has unique content (not just city name swapped)
- [ ] Meta title under 60 characters
- [ ] Meta description under 160 characters
- [ ] City name appears in title
- [ ] Category name appears in title
- [ ] Schema markup validates (test with Google Rich Results)
- [ ] Page loads in under 2 seconds
- [ ] Mobile responsive
- [ ] Internal links work correctly

## Running Validation

```bash
# Validate all pages
node scripts/validate-programmatic-seo.js

# Generate full report
node scripts/generate-seo-report.js
```

## Troubleshooting

### Pages show "Coming Soon"
This means no businesses exist for that category+city combination. Either:
1. The category name doesn't match the database
2. No businesses are tagged with that city

### TypeScript errors
The codebase has some pre-existing Supabase type inference issues. These don't affect runtime - the build will succeed.

### Pages not generating
1. Check that the category is in `VALID_CATEGORIES`
2. Check that the city is in `CITIES` array in `locations-config.ts`
3. Run `npm run build` to regenerate static pages

## Performance

- Pages are statically generated at build time (SSG)
- Each page is ~136 bytes of unique JS
- Database queries are cached during build
- Images are lazy loaded
- First Load JS: ~123 kB

## Next Steps

1. Add more categories as needed
2. Import reviews for cities with low review counts
3. Add neighborhood-level pages (e.g., `/restaurants/crystal-falls-leander-tx`)
4. Consider adding filters (price, rating) to each page

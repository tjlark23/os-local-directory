/**
 * Centralized Location Configuration
 * All cities, subdivisions, and location-related constants in one place
 */

// ============================================================
// CITY CONFIGURATION
// ============================================================

export interface CityConfig {
  slug: string           // URL slug (e.g., "leander-tx")
  name: string           // Display name (e.g., "Leander")
  state: string          // State abbreviation
  fullName: string       // Full location name (e.g., "Leander, TX")
  region: string         // Geographic region for grouping
  hasData: boolean       // Whether we have business data for this city
  subdivisions: SubdivisionConfig[]
}

export interface SubdivisionConfig {
  slug: string           // URL slug (e.g., "crystal-falls-leander-tx")
  name: string           // Display name (e.g., "Crystal Falls")
  parentCity: string     // Parent city name
}

// All supported cities
export const CITIES: CityConfig[] = [
  // PRIMARY CITIES (Current - have data)
  {
    slug: 'leander-tx',
    name: 'Leander',
    state: 'TX',
    fullName: 'Leander, TX',
    region: 'Williamson County',
    hasData: true,
    subdivisions: [
      { slug: 'crystal-falls-leander-tx', name: 'Crystal Falls', parentCity: 'Leander' },
      { slug: 'travisso-leander-tx', name: 'Travisso', parentCity: 'Leander' },
      { slug: 'bryson-leander-tx', name: 'Bryson', parentCity: 'Leander' },
      { slug: 'vista-ridge-leander-tx', name: 'Vista Ridge', parentCity: 'Leander' },
      { slug: 'mason-hills-leander-tx', name: 'Mason Hills', parentCity: 'Leander' },
      { slug: 'summerlyn-leander-tx', name: 'Summerlyn', parentCity: 'Leander' },
      { slug: 'north-creek-leander-tx', name: 'North Creek', parentCity: 'Leander' },
      { slug: 'benbrook-ranch-leander-tx', name: 'Benbrook Ranch', parentCity: 'Leander' },
    ]
  },
  {
    slug: 'cedar-park-tx',
    name: 'Cedar Park',
    state: 'TX',
    fullName: 'Cedar Park, TX',
    region: 'Williamson County',
    hasData: true,
    subdivisions: [
      { slug: 'buttercup-creek-cedar-park-tx', name: 'Buttercup Creek', parentCity: 'Cedar Park' },
      { slug: 'ranch-at-cypress-creek-cedar-park-tx', name: 'Ranch at Cypress Creek', parentCity: 'Cedar Park' },
      { slug: 'cypress-canyon-cedar-park-tx', name: 'Cypress Canyon', parentCity: 'Cedar Park' },
      { slug: 'whitestone-oaks-cedar-park-tx', name: 'Whitestone Oaks', parentCity: 'Cedar Park' },
      { slug: 'anderson-mill-west-cedar-park-tx', name: 'Anderson Mill West', parentCity: 'Cedar Park' },
      { slug: 'twin-creeks-cedar-park-tx', name: 'Twin Creeks', parentCity: 'Cedar Park' },
      { slug: 'carriage-hills-cedar-park-tx', name: 'Carriage Hills', parentCity: 'Cedar Park' },
    ]
  },
  {
    slug: 'liberty-hill-tx',
    name: 'Liberty Hill',
    state: 'TX',
    fullName: 'Liberty Hill, TX',
    region: 'Williamson County',
    hasData: true,
    subdivisions: [
      { slug: 'santa-rita-ranch-liberty-hill-tx', name: 'Santa Rita Ranch', parentCity: 'Liberty Hill' },
      { slug: 'clearwater-ranch-liberty-hill-tx', name: 'Clearwater Ranch', parentCity: 'Liberty Hill' },
      { slug: 'gabriel-woods-liberty-hill-tx', name: 'Gabriel Woods', parentCity: 'Liberty Hill' },
    ]
  },

  // NEW CITIES (Expansion - data coming soon)
  {
    slug: 'hutto-tx',
    name: 'Hutto',
    state: 'TX',
    fullName: 'Hutto, TX',
    region: 'Williamson County',
    hasData: false,
    subdivisions: [
      { slug: 'co-op-district-hutto-tx', name: 'Co-Op District', parentCity: 'Hutto' },
      { slug: 'hutto-town-center-hutto-tx', name: 'Hutto Town Center', parentCity: 'Hutto' },
      { slug: 'brushy-creek-hutto-tx', name: 'Brushy Creek', parentCity: 'Hutto' },
      { slug: 'star-ranch-hutto-tx', name: 'Star Ranch', parentCity: 'Hutto' },
    ]
  },
  {
    slug: 'pflugerville-tx',
    name: 'Pflugerville',
    state: 'TX',
    fullName: 'Pflugerville, TX',
    region: 'Travis County',
    hasData: false,
    subdivisions: [
      { slug: 'blackhawk-pflugerville-tx', name: 'Blackhawk', parentCity: 'Pflugerville' },
      { slug: 'falcon-pointe-pflugerville-tx', name: 'Falcon Pointe', parentCity: 'Pflugerville' },
      { slug: 'wells-branch-pflugerville-tx', name: 'Wells Branch', parentCity: 'Pflugerville' },
      { slug: 'stone-hill-pflugerville-tx', name: 'Stone Hill', parentCity: 'Pflugerville' },
    ]
  },
  {
    slug: 'round-rock-tx',
    name: 'Round Rock',
    state: 'TX',
    fullName: 'Round Rock, TX',
    region: 'Williamson County',
    hasData: false,
    subdivisions: [
      { slug: 'downtown-round-rock-tx', name: 'Downtown Round Rock', parentCity: 'Round Rock' },
      { slug: 'cat-hollow-round-rock-tx', name: 'Cat Hollow', parentCity: 'Round Rock' },
      { slug: 'forest-creek-round-rock-tx', name: 'Forest Creek', parentCity: 'Round Rock' },
      { slug: 'teravista-round-rock-tx', name: 'Teravista', parentCity: 'Round Rock' },
      { slug: 'brushy-creek-round-rock-tx', name: 'Brushy Creek', parentCity: 'Round Rock' },
    ]
  },
  {
    slug: 'taylor-tx',
    name: 'Taylor',
    state: 'TX',
    fullName: 'Taylor, TX',
    region: 'Williamson County',
    hasData: false,
    subdivisions: [
      { slug: 'downtown-taylor-tx', name: 'Downtown Taylor', parentCity: 'Taylor' },
      { slug: 'north-taylor-tx', name: 'North Taylor', parentCity: 'Taylor' },
    ]
  },

  // NEARBY CITIES (For SEO coverage)
  {
    slug: 'austin-tx',
    name: 'Austin',
    state: 'TX',
    fullName: 'Austin, TX',
    region: 'Travis County',
    hasData: false,
    subdivisions: []
  },
  {
    slug: 'georgetown-tx',
    name: 'Georgetown',
    state: 'TX',
    fullName: 'Georgetown, TX',
    region: 'Williamson County',
    hasData: false,
    subdivisions: []
  },
]

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get all city slugs
 */
export function getAllCitySlugs(): string[] {
  return CITIES.map(c => c.slug)
}

/**
 * Get all subdivision slugs
 */
export function getAllSubdivisionSlugs(): string[] {
  return CITIES.flatMap(c => c.subdivisions.map(s => s.slug))
}

/**
 * Get all location slugs (cities + subdivisions)
 */
export function getAllLocationSlugs(): string[] {
  return [...getAllCitySlugs(), ...getAllSubdivisionSlugs()]
}

/**
 * Get city by slug
 */
export function getCityBySlug(slug: string): CityConfig | null {
  return CITIES.find(c => c.slug === slug) || null
}

/**
 * Get city by name
 */
export function getCityByName(name: string): CityConfig | null {
  return CITIES.find(c => c.name.toLowerCase() === name.toLowerCase()) || null
}

/**
 * Get subdivision by slug
 */
export function getSubdivisionBySlug(slug: string): (SubdivisionConfig & { parentCityConfig: CityConfig }) | null {
  for (const city of CITIES) {
    const subdivision = city.subdivisions.find(s => s.slug === slug)
    if (subdivision) {
      return { ...subdivision, parentCityConfig: city }
    }
  }
  return null
}

/**
 * Get all cities with data
 */
export function getCitiesWithData(): CityConfig[] {
  return CITIES.filter(c => c.hasData)
}

/**
 * Get all cities without data (new/expansion)
 */
export function getCitiesWithoutData(): CityConfig[] {
  return CITIES.filter(c => !c.hasData)
}

/**
 * Get city names array
 */
export function getCityNames(): string[] {
  return CITIES.map(c => c.name)
}

/**
 * Check if a location slug is a city
 */
export function isCity(slug: string): boolean {
  return CITIES.some(c => c.slug === slug)
}

/**
 * Check if a location slug is a subdivision
 */
export function isSubdivision(slug: string): boolean {
  return CITIES.some(c => c.subdivisions.some(s => s.slug === slug))
}

// ============================================================
// CATEGORY SLUGS BY CITY
// ============================================================

/**
 * Generate category slug for a specific city
 * Example: slugifyCategoryForCity("restaurants", "leander-tx") → "restaurants-leander-tx"
 */
export function slugifyCategoryForCity(category: string, citySlug: string): string {
  return `${category}-${citySlug}`
}

/**
 * Parse a category slug to extract category and city
 * Example: parseCategorySlug("restaurants-leander-tx") → { category: "restaurants", citySlug: "leander-tx" }
 */
export function parseCategorySlug(slug: string): { category: string; citySlug: string } | null {
  for (const city of CITIES) {
    if (slug.endsWith(`-${city.slug}`)) {
      const category = slug.replace(`-${city.slug}`, '')
      return { category, citySlug: city.slug }
    }
  }
  // Fallback for legacy leander-tx format
  if (slug.endsWith('-leander-tx')) {
    return { category: slug.replace('-leander-tx', ''), citySlug: 'leander-tx' }
  }
  return null
}

// ============================================================
// FLAT NEIGHBORHOOD LIST (for backwards compatibility)
// ============================================================

export interface NeighborhoodItem {
  slug: string
  city: string
  displayName: string
  state: string
  type: 'city' | 'subdivision'
  parentCity?: string
}

/**
 * Get all neighborhoods as a flat list (cities + subdivisions)
 * Maintains backwards compatibility with existing code
 */
export function getAllNeighborhoods(): NeighborhoodItem[] {
  const neighborhoods: NeighborhoodItem[] = []

  for (const city of CITIES) {
    // Add the city itself
    neighborhoods.push({
      slug: city.slug,
      city: city.name,
      displayName: city.name,
      state: city.state,
      type: 'city',
    })

    // Add all subdivisions
    for (const subdivision of city.subdivisions) {
      neighborhoods.push({
        slug: subdivision.slug,
        city: city.name,
        displayName: subdivision.name,
        state: city.state,
        type: 'subdivision',
        parentCity: subdivision.parentCity,
      })
    }
  }

  return neighborhoods
}

// ============================================================
// SEO HELPERS
// ============================================================

/**
 * Get SEO-friendly title for a city
 */
export function getCityTitle(city: CityConfig, suffix?: string): string {
  const base = `${city.name}, ${city.state}`
  return suffix ? `${base} ${suffix}` : base
}

/**
 * Get canonical URL for a city page
 */
export function getCityCanonicalUrl(citySlug: string): string {
  return `https://directory.leanderscoop.com/neighborhoods/${citySlug}`
}

/**
 * Get canonical URL for a category page in a city
 */
export function getCategoryCanonicalUrl(category: string, citySlug: string): string {
  return `https://directory.leanderscoop.com/categories/${category}-${citySlug}`
}

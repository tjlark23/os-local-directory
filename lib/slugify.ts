/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * All supported city slugs for pattern matching
 */
export const CITY_SLUGS = [
  'leander-tx',
  'cedar-park-tx',
  'liberty-hill-tx',
  'hutto-tx',
  'pflugerville-tx',
  'round-rock-tx',
  'taylor-tx',
  'austin-tx',
  'georgetown-tx',
] as const;

export type CitySlug = typeof CITY_SLUGS[number];

/**
 * Convert category name to SEO-friendly URL slug for a specific city
 * Example: slugifyCategoryForCity("restaurants", "leander-tx") → "restaurants-leander-tx"
 */
export function slugifyCategoryForCity(category: string, citySlug: CitySlug = 'leander-tx'): string {
  // Handle comma-separated categories (e.g., "American, Contemporary")
  const cleanCategory = category.split(',')[0].trim();

  let slug = slugify(cleanCategory);

  // Pluralize common category types
  const pluralMap: Record<string, string> = {
    'restaurant': 'restaurants',
    'shop': 'shops',
    'bar': 'bars',
    'cafe': 'cafes',
    'brewery': 'breweries',
    'bakery': 'bakeries',
    'store': 'stores',
    'service': 'services',
  };

  for (const [singular, plural] of Object.entries(pluralMap)) {
    if (slug.endsWith(`-${singular}`)) {
      slug = slug.replace(new RegExp(`-${singular}$`), `-${plural}`);
    }
  }

  // Add location suffix
  return `${slug}-${citySlug}`;
}

/**
 * Legacy function - Convert category name to SEO-friendly URL slug (defaults to Leander)
 * Example: "restaurants" → "restaurants-leander-tx"
 */
export function slugifyCategory(category: string): string {
  return slugifyCategoryForCity(category, 'leander-tx');
}

/**
 * Parse a category slug to extract category and city
 * Example: parseCategorySlug("restaurants-leander-tx") → { category: "restaurants", citySlug: "leander-tx" }
 */
export function parseCategorySlug(slug: string): { category: string; citySlug: CitySlug; cityName: string } | null {
  const cityMap: Record<CitySlug, string> = {
    'leander-tx': 'Leander',
    'cedar-park-tx': 'Cedar Park',
    'liberty-hill-tx': 'Liberty Hill',
    'hutto-tx': 'Hutto',
    'pflugerville-tx': 'Pflugerville',
    'round-rock-tx': 'Round Rock',
    'taylor-tx': 'Taylor',
    'austin-tx': 'Austin',
    'georgetown-tx': 'Georgetown',
  };

  for (const citySlug of CITY_SLUGS) {
    if (slug.endsWith(`-${citySlug}`)) {
      const category = slug.replace(`-${citySlug}`, '');
      return { category, citySlug, cityName: cityMap[citySlug] };
    }
  }
  return null;
}

/**
 * Convert slug back to readable text
 * Example: "restaurants-leander-tx" → "Restaurants"
 */
export function unslugify(slug: string): string {
  // Remove any city suffix
  let cleanSlug = slug;
  for (const citySlug of CITY_SLUGS) {
    cleanSlug = cleanSlug.replace(new RegExp(`-${citySlug}$`, 'i'), '');
  }

  return cleanSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Category display names for SEO-friendly titles
 */
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
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
};

/**
 * All database categories
 */
export const DB_CATEGORIES = [
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
];

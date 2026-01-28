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
 * Convert category name to SEO-friendly URL slug
 * Example: "restaurants" → "restaurants-leander-tx"
 */
export function slugifyCategory(category: string): string {
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
  return `${slug}-leander-tx`;
}

/**
 * Convert slug back to readable text
 * Example: "restaurants-leander-tx" → "Restaurants"
 */
export function unslugify(slug: string): string {
  return slug
    .replace(/-leander-tx$/i, '')
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

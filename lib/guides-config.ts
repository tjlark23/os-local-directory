/**
 * Guides Configuration
 * Defines all guide types and generates guides for all cities
 */

import { CITIES, type CityConfig } from './locations-config'
import { CATEGORY_DISPLAY_NAMES, DB_CATEGORIES } from './slugify'

// ============================================================
// GUIDE TYPES
// ============================================================

export interface GuideConfig {
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  city: CityConfig | null  // null means multi-city
  cities?: CityConfig[]    // for multi-city guides
  tags?: string[]
  featured?: boolean
}

// ============================================================
// BASE GUIDE TEMPLATES
// ============================================================

// Template for "Best [Category] in [City]" guides
interface CategoryGuideTemplate {
  category: string
  titleTemplate: (city: string) => string
  subtitleTemplate: (year: number) => string
  descriptionTemplate: (city: string) => string
  tags?: string[]
}

const CATEGORY_GUIDE_TEMPLATES: CategoryGuideTemplate[] = [
  {
    category: 'restaurants',
    titleTemplate: (city) => `Best Restaurants in ${city}, TX`,
    subtitleTemplate: (year) => `Top-Rated Dining Spots for ${year}`,
    descriptionTemplate: (city) => `Discover the best restaurants in ${city}, Texas. From family-friendly spots to date-night destinations, here are the top-rated places to eat.`,
  },
  {
    category: 'health',
    titleTemplate: (city) => `Best Health & Wellness in ${city}, TX`,
    subtitleTemplate: (year) => `Top Healthcare Providers for ${year}`,
    descriptionTemplate: (city) => `Find the best doctors, clinics, and healthcare providers in ${city}, Texas. Your guide to quality healthcare in the area.`,
  },
  {
    category: 'beauty',
    titleTemplate: (city) => `Best Beauty & Spa in ${city}, TX`,
    subtitleTemplate: (year) => `Top Salons & Spas for ${year}`,
    descriptionTemplate: (city) => `Discover the best salons, spas, and beauty services in ${city}, Texas. From haircuts to massages, find your perfect spot.`,
  },
  {
    category: 'fitness',
    titleTemplate: (city) => `Best Gyms & Fitness in ${city}, TX`,
    subtitleTemplate: (year) => `Top Fitness Centers for ${year}`,
    descriptionTemplate: (city) => `Find the best gyms, fitness centers, and workout spots in ${city}, Texas. Your guide to staying fit and healthy.`,
  },
  {
    category: 'automotive',
    titleTemplate: (city) => `Best Auto Services in ${city}, TX`,
    subtitleTemplate: (year) => `Top Mechanics & Auto Shops for ${year}`,
    descriptionTemplate: (city) => `Find trusted auto repair shops, mechanics, and car services in ${city}, Texas. Keep your vehicle running smoothly.`,
  },
  {
    category: 'shopping',
    titleTemplate: (city) => `Best Shopping in ${city}, TX`,
    subtitleTemplate: (year) => `Top Retail & Shops for ${year}`,
    descriptionTemplate: (city) => `Discover the best shopping destinations in ${city}, Texas. From boutiques to big box stores, find everything you need.`,
  },
  {
    category: 'services',
    titleTemplate: (city) => `Best Professional Services in ${city}, TX`,
    subtitleTemplate: (year) => `Top Local Services for ${year}`,
    descriptionTemplate: (city) => `Find trusted professional services in ${city}, Texas. Lawyers, accountants, and more for your business and personal needs.`,
  },
  {
    category: 'education',
    titleTemplate: (city) => `Best Education & Tutoring in ${city}, TX`,
    subtitleTemplate: (year) => `Top Learning Centers for ${year}`,
    descriptionTemplate: (city) => `Find the best tutoring services, learning centers, and educational programs in ${city}, Texas.`,
  },
  {
    category: 'pets',
    titleTemplate: (city) => `Best Pet Services in ${city}, TX`,
    subtitleTemplate: (year) => `Top Pet Care for ${year}`,
    descriptionTemplate: (city) => `Find the best veterinarians, groomers, and pet services in ${city}, Texas. Quality care for your furry friends.`,
  },
  {
    category: 'home',
    titleTemplate: (city) => `Best Home Services in ${city}, TX`,
    subtitleTemplate: (year) => `Top Home Contractors for ${year}`,
    descriptionTemplate: (city) => `Find trusted home services in ${city}, Texas. Plumbers, electricians, landscapers, and more.`,
  },
  {
    category: 'entertainment',
    titleTemplate: (city) => `Best Entertainment in ${city}, TX`,
    subtitleTemplate: (year) => `Top Fun Activities for ${year}`,
    descriptionTemplate: (city) => `Discover the best entertainment venues and activities in ${city}, Texas. From movies to bowling, find your fun.`,
  },
]

// Specialty guides (food sub-categories, etc.)
interface SpecialtyGuideTemplate {
  slugSuffix: string
  titleTemplate: (city: string) => string
  subtitleTemplate: (year: number) => string
  descriptionTemplate: (city: string) => string
  category: string
  tags: string[]
  cities: string[]  // which cities this applies to
}

const SPECIALTY_GUIDE_TEMPLATES: SpecialtyGuideTemplate[] = [
  {
    slugSuffix: 'bbq',
    titleTemplate: (city) => `Best BBQ in ${city}, TX`,
    subtitleTemplate: (year) => `Top Texas Barbecue for ${year}`,
    descriptionTemplate: (city) => `Find the best BBQ joints in ${city}, Texas. Authentic Texas barbecue at its finest.`,
    category: 'restaurants',
    tags: ['bbq', 'barbecue', 'smokehouse', 'brisket'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'mexican-food',
    titleTemplate: (city) => `Best Mexican Food in ${city}, TX`,
    subtitleTemplate: (year) => `Top Tex-Mex & Authentic Mexican for ${year}`,
    descriptionTemplate: (city) => `The best Mexican restaurants in ${city}, Texas. Tacos, enchiladas, and authentic flavors.`,
    category: 'restaurants',
    tags: ['mexican', 'tex-mex', 'tacos', 'enchiladas'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'pizza',
    titleTemplate: (city) => `Best Pizza in ${city}, TX`,
    subtitleTemplate: (year) => `Top Pizza Places for ${year}`,
    descriptionTemplate: (city) => `Craving pizza? Here are the best pizza restaurants in ${city}, Texas.`,
    category: 'restaurants',
    tags: ['pizza', 'italian', 'pizzeria'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'coffee-shops',
    titleTemplate: (city) => `Best Coffee Shops in ${city}, TX`,
    subtitleTemplate: (year) => `Top Cafes & Coffee Spots for ${year}`,
    descriptionTemplate: (city) => `Find the best coffee shops and cafes in ${city}, Texas. Perfect for your morning brew.`,
    category: 'restaurants',
    tags: ['coffee', 'cafe', 'espresso', 'breakfast'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'family-restaurants',
    titleTemplate: (city) => `Best Family-Friendly Restaurants in ${city}, TX`,
    subtitleTemplate: (year) => `Top Kid-Friendly Dining for ${year}`,
    descriptionTemplate: (city) => `Looking for a great place to eat with the kids? Best family-friendly restaurants in ${city}.`,
    category: 'restaurants',
    tags: ['family', 'kids', 'casual'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'breakfast-brunch',
    titleTemplate: (city) => `Best Breakfast & Brunch in ${city}, TX`,
    subtitleTemplate: (year) => `Top Morning Spots for ${year}`,
    descriptionTemplate: (city) => `Find the best breakfast and brunch spots in ${city}, Texas. Start your day right.`,
    category: 'restaurants',
    tags: ['breakfast', 'brunch', 'morning', 'eggs'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'happy-hour',
    titleTemplate: (city) => `Best Happy Hour in ${city}, TX`,
    subtitleTemplate: (year) => `Top Bars & Deals for ${year}`,
    descriptionTemplate: (city) => `Find the best happy hour spots in ${city}, Texas. Great drinks and deals.`,
    category: 'restaurants',
    tags: ['bar', 'happy hour', 'drinks', 'cocktails'],
    cities: ['Leander', 'Cedar Park'],
  },
  {
    slugSuffix: 'dentists',
    titleTemplate: (city) => `Best Dentists in ${city}, TX`,
    subtitleTemplate: (year) => `Top Dental Care for ${year}`,
    descriptionTemplate: (city) => `Find the best dentists in ${city}, Texas. Quality dental care for your family.`,
    category: 'health',
    tags: ['dentist', 'dental', 'teeth', 'orthodontist'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'hair-salons',
    titleTemplate: (city) => `Best Hair Salons in ${city}, TX`,
    subtitleTemplate: (year) => `Top Salons for ${year}`,
    descriptionTemplate: (city) => `Find the best hair salons in ${city}, Texas. Cuts, color, and styling.`,
    category: 'beauty',
    tags: ['hair', 'salon', 'haircut', 'stylist'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
  {
    slugSuffix: 'nail-salons',
    titleTemplate: (city) => `Best Nail Salons in ${city}, TX`,
    subtitleTemplate: (year) => `Top Nail Care for ${year}`,
    descriptionTemplate: (city) => `Find the best nail salons in ${city}, Texas. Manicures, pedicures, and nail art.`,
    category: 'beauty',
    tags: ['nails', 'manicure', 'pedicure', 'nail salon'],
    cities: ['Leander', 'Cedar Park', 'Liberty Hill'],
  },
]

// ============================================================
// GUIDE GENERATION
// ============================================================

/**
 * Generate all guides
 */
export function getAllGuides(): GuideConfig[] {
  const guides: GuideConfig[] = []
  const year = new Date().getFullYear()

  // Cities with data
  const citiesWithData = CITIES.filter(c => c.hasData)

  // Generate category guides for cities with data
  for (const city of citiesWithData) {
    for (const template of CATEGORY_GUIDE_TEMPLATES) {
      guides.push({
        slug: `best-${template.category}-${city.slug}`,
        title: template.titleTemplate(city.name),
        subtitle: template.subtitleTemplate(year),
        description: template.descriptionTemplate(city.name),
        category: template.category,
        city: city,
        featured: template.category === 'restaurants',
      })
    }
  }

  // Generate specialty guides for cities with data
  for (const template of SPECIALTY_GUIDE_TEMPLATES) {
    for (const cityName of template.cities) {
      const city = citiesWithData.find(c => c.name === cityName)
      if (city) {
        guides.push({
          slug: `best-${template.slugSuffix}-${city.slug}`,
          title: template.titleTemplate(city.name),
          subtitle: template.subtitleTemplate(year),
          description: template.descriptionTemplate(city.name),
          category: template.category,
          city: city,
          tags: template.tags,
        })
      }
    }
  }

  return guides
}

/**
 * Get guide by slug
 */
export function getGuideBySlug(slug: string): GuideConfig | null {
  return getAllGuides().find(g => g.slug === slug) || null
}

/**
 * Get featured guides
 */
export function getFeaturedGuides(): GuideConfig[] {
  return getAllGuides().filter(g => g.featured)
}

/**
 * Get guides by category
 */
export function getGuidesByCategory(category: string): GuideConfig[] {
  return getAllGuides().filter(g => g.category === category)
}

/**
 * Get guides by city
 */
export function getGuidesByCity(citySlug: string): GuideConfig[] {
  return getAllGuides().filter(g => g.city?.slug === citySlug)
}

/**
 * Get all guide slugs (for static generation)
 */
export function getAllGuideSlugs(): string[] {
  return getAllGuides().map(g => g.slug)
}

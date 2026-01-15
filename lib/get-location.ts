import { headers } from 'next/headers'
import { getLocationByDomain, getLocationBySlug } from './db'
import type { Location } from './database.types'

// Default location slug for development and fallback
const DEFAULT_LOCATION_SLUG = 'leander'

export async function getCurrentLocation(): Promise<Location | null> {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  // In development, use default location
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return getLocationBySlug(DEFAULT_LOCATION_SLUG)
  }

  // Try to find location by domain
  const location = await getLocationByDomain(host)
  if (location) {
    return location
  }

  // Check for subdomain pattern (e.g., leander.directory.com)
  const subdomain = host.split('.')[0]
  if (subdomain && subdomain !== 'www' && subdomain !== 'directory') {
    const locationBySubdomain = await getLocationBySlug(subdomain)
    if (locationBySubdomain) {
      return locationBySubdomain
    }
  }

  // Fallback to default location
  return getLocationBySlug(DEFAULT_LOCATION_SLUG)
}

// Helper to get location with caching for static generation
let cachedLocation: Location | null = null

export async function getLocationForStaticGeneration(): Promise<Location | null> {
  if (cachedLocation) return cachedLocation
  cachedLocation = await getLocationBySlug(DEFAULT_LOCATION_SLUG)
  return cachedLocation
}

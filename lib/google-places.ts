interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  opening_hours?: {
    weekday_text: string[]
    open_now: boolean
  }
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  types: string[]
}

export class GooglePlacesService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Search for businesses in a specific area
  async searchPlaces(query: string, location: string, radius = 5000) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
        `query=${encodeURIComponent(query + " " + location)}&` +
        `radius=${radius}&` +
        `key=${this.apiKey}`,
    )

    const data = await response.json()
    return data.results
  }

  // Get detailed information about a specific place
  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
        `place_id=${placeId}&` +
        `fields=place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,reviews,geometry,types&` +
        `key=${this.apiKey}`,
    )

    const data = await response.json()
    return data.result
  }

  // Get photo URL from photo reference
  getPhotoUrl(photoReference: string, maxWidth = 400): string {
    return (
      `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=${maxWidth}&` +
      `photo_reference=${photoReference}&` +
      `key=${this.apiKey}`
    )
  }

  // Search for places near coordinates
  async searchNearby(lat: number, lng: number, type: string, radius = 5000) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${lat},${lng}&` +
        `radius=${radius}&` +
        `type=${type}&` +
        `key=${this.apiKey}`,
    )

    const data = await response.json()
    return data.results
  }
}

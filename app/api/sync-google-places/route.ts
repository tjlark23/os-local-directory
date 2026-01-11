import { type NextRequest, NextResponse } from "next/server"
import { GooglePlacesService } from "@/lib/google-places"

const placesService = new GooglePlacesService(process.env.GOOGLE_PLACES_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { location, categories } = await request.json()

    const businesses = []

    // Search for different types of businesses
    for (const category of categories) {
      const results = await placesService.searchPlaces(category, location)

      for (const place of results) {
        // Get detailed information
        const details = await placesService.getPlaceDetails(place.place_id)

        // Transform Google data to your business format
        const business = {
          googlePlaceId: details.place_id,
          name: details.name,
          category: mapGoogleTypeToCategory(details.types),
          address: {
            full: details.formatted_address,
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          },
          phone: details.formatted_phone_number,
          website: details.website,
          rating: details.rating || 0,
          reviewCount: details.user_ratings_total || 0,
          hours: details.opening_hours?.weekday_text || [],
          currentlyOpen: details.opening_hours?.open_now || false,
          photos: details.photos?.map((photo) => placesService.getPhotoUrl(photo.photo_reference, 600)) || [],
          reviews:
            details.reviews?.map((review) => ({
              author: review.author_name,
              rating: review.rating,
              text: review.text,
              date: new Date(review.time * 1000).toISOString(),
            })) || [],
          lastSynced: new Date().toISOString(),
        }

        businesses.push(business)

        // Add delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    // Here you would save to your database
    // await saveBusiness(business)

    return NextResponse.json({
      success: true,
      count: businesses.length,
      businesses,
    })
  } catch (error) {
    console.error("Google Places sync error:", error)
    return NextResponse.json({ error: "Failed to sync with Google Places" }, { status: 500 })
  }
}

function mapGoogleTypeToCategory(types: string[]): string {
  const categoryMap: Record<string, string> = {
    restaurant: "Restaurants",
    food: "Restaurants",
    meal_takeaway: "Restaurants",
    cafe: "Restaurants",
    bar: "Restaurants",
    store: "Shopping",
    shopping_mall: "Shopping",
    clothing_store: "Shopping",
    electronics_store: "Shopping",
    car_repair: "Auto Services",
    gas_station: "Auto Services",
    car_dealer: "Auto Services",
    hospital: "Health & Beauty",
    doctor: "Health & Beauty",
    dentist: "Health & Beauty",
    pharmacy: "Health & Beauty",
    beauty_salon: "Health & Beauty",
    spa: "Health & Beauty",
    gym: "Health & Beauty",
    movie_theater: "Entertainment",
    amusement_park: "Entertainment",
    bowling_alley: "Entertainment",
    night_club: "Entertainment",
    veterinary_care: "Pets",
    pet_store: "Pets",
    real_estate_agency: "Real Estate",
  }

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type]
    }
  }

  return "Services"
}

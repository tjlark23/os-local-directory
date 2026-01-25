export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ListingTier = 'free' | 'premium' | 'featured'

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string
          slug: string
          name: string
          domain: string | null
          logo_url: string | null
          primary_color: string
          tagline: string | null
          cities: string[]
          state: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          domain?: string | null
          logo_url?: string | null
          primary_color?: string
          tagline?: string | null
          cities: string[]
          state?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          domain?: string | null
          logo_url?: string | null
          primary_color?: string
          tagline?: string | null
          cities?: string[]
          state?: string
          timezone?: string
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          location_id: string
          slug: string
          name: string
          description: string
          custom_description: string | null
          category: string
          subcategory: string | null
          image: string
          photos: string[]
          videos: string[]
          phone: string
          email: string | null
          website: string | null
          address_street: string
          address_city: string
          address_state: string
          address_zip: string
          latitude: number | null
          longitude: number | null
          hours: Json
          rating: number
          review_count: number
          price_range: string | null
          year_established: number | null
          owner: string | null
          specialties: string[]
          amenities: Json[]
          tags: string[]
          social_links: Json | null
          listing_tier: ListingTier
          is_featured: boolean
          premium_since: string | null
          backlink_enabled: boolean
          deals_banner: string | null
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          location_id: string
          slug: string
          name: string
          description: string
          custom_description?: string | null
          category: string
          subcategory?: string | null
          image: string
          photos?: string[]
          videos?: string[]
          phone: string
          email?: string | null
          website?: string | null
          address_street: string
          address_city: string
          address_state: string
          address_zip: string
          latitude?: number | null
          longitude?: number | null
          hours: Json
          rating?: number
          review_count?: number
          price_range?: string | null
          year_established?: number | null
          owner?: string | null
          specialties?: string[]
          amenities?: Json[]
          tags?: string[]
          social_links?: Json | null
          listing_tier?: ListingTier
          is_featured?: boolean
          premium_since?: string | null
          backlink_enabled?: boolean
          deals_banner?: string | null
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          slug?: string
          name?: string
          description?: string
          custom_description?: string | null
          category?: string
          subcategory?: string | null
          image?: string
          photos?: string[]
          videos?: string[]
          phone?: string
          email?: string | null
          website?: string | null
          address_street?: string
          address_city?: string
          address_state?: string
          address_zip?: string
          latitude?: number | null
          longitude?: number | null
          hours?: Json
          rating?: number
          review_count?: number
          price_range?: string | null
          year_established?: number | null
          owner?: string | null
          specialties?: string[]
          amenities?: Json[]
          tags?: string[]
          social_links?: Json | null
          listing_tier?: ListingTier
          is_featured?: boolean
          premium_since?: string | null
          backlink_enabled?: boolean
          deals_banner?: string | null
          last_updated?: string
          created_at?: string
        }
      }
      business_inquiries: {
        Row: {
          id: string
          location_id: string | null
          business_name: string
          contact_name: string
          email: string
          phone: string | null
          currently_listed: boolean
          interested_in: string
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          location_id?: string | null
          business_name: string
          contact_name: string
          email: string
          phone?: string | null
          currently_listed?: boolean
          interested_in: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          location_id?: string | null
          business_name?: string
          contact_name?: string
          email?: string
          phone?: string | null
          currently_listed?: boolean
          interested_in?: string
          message?: string | null
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      listing_tier: ListingTier
    }
  }
}

// Helper types for easier use
export type Location = Database['public']['Tables']['locations']['Row']
export type LocationInsert = Database['public']['Tables']['locations']['Insert']
export type Business = Database['public']['Tables']['businesses']['Row']
export type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
export type BusinessInquiry = Database['public']['Tables']['business_inquiries']['Row']
export type BusinessInquiryInsert = Database['public']['Tables']['business_inquiries']['Insert']

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a safe client that handles missing env vars during build
function createSafeClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a placeholder client for build time
    // This allows static pages to generate without env vars
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSafeClient()

// Server-side client for use in server components and API routes
export function createServerClient(): SupabaseClient<Database> {
  return createSafeClient()
}

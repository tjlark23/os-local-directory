import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Get env vars - they should be available at runtime in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create client - env vars are always available at runtime for server components
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client for use in server components and API routes
export function createServerClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

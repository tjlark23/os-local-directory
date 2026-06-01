import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const fallbackSupabaseUrl = 'https://example.supabase.co'
const fallbackSupabaseAnonKey = 'missing-supabase-anon-key'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn('Missing Supabase public env vars. Using build-safe placeholders.')
  }

  return {
    url: url || fallbackSupabaseUrl,
    anonKey: anonKey || fallbackSupabaseAnonKey,
  }
}

const supabaseConfig = getSupabaseConfig()

export const supabase = createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey)

// Server-side client for use in server components and API routes
export function createServerClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey)
}

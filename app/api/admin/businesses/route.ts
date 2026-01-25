import { NextResponse } from 'next/server'
import { getAllBusinessesForAdmin, getBusinessStats } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const businesses = await getAllBusinessesForAdmin()

    // Get location for stats
    const { data: location } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', 'leander')
      .single()

    let stats = { total: 0, free: 0, premium: 0, featured: 0 }
    if (location) {
      stats = await getBusinessStats(location.id)
    }

    return NextResponse.json({ businesses, stats })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 })
  }
}

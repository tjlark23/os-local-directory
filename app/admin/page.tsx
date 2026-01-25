"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MessageSquare, TrendingUp, Eye, Star } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { supabase } from "@/lib/supabase"

interface Stats {
  totalBusinesses: number
  featuredBusinesses: number
  totalReviews: number
  monthlyViews: number
  averageRating: number
  pendingReviews: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    featuredBusinesses: 0,
    totalReviews: 0,
    monthlyViews: 0,
    averageRating: 0,
    pendingReviews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get location ID
        const { data: location } = await supabase
          .from('locations')
          .select('id')
          .eq('slug', 'leander')
          .single()

        if (!location) return

        // Get total businesses count
        const { count: totalBusinesses } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('location_id', location.id)

        // Get featured businesses count
        const { count: featuredBusinesses } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('location_id', location.id)
          .eq('is_featured', true)

        // Get average rating and total reviews
        const { data: businessData } = await supabase
          .from('businesses')
          .select('rating, review_count')
          .eq('location_id', location.id)

        let totalReviews = 0
        let totalRating = 0
        let ratedCount = 0

        if (businessData) {
          businessData.forEach(b => {
            totalReviews += b.review_count || 0
            if (b.rating) {
              totalRating += Number(b.rating)
              ratedCount++
            }
          })
        }

        const averageRating = ratedCount > 0 ? totalRating / ratedCount : 0

        setStats({
          totalBusinesses: totalBusinesses || 0,
          featuredBusinesses: featuredBusinesses || 0,
          totalReviews,
          monthlyViews: 0, // Would need analytics tracking
          averageRating: Math.round(averageRating * 10) / 10,
          pendingReviews: 0, // Would need review moderation system
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
              <p className="text-xs text-muted-foreground">In directory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.featuredBusinesses}</div>
              <p className="text-xs text-muted-foreground">Premium listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Listings</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBusinesses - stats.featuredBusinesses}</div>
              <p className="text-xs text-muted-foreground">Standard listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Across all businesses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Business types</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Directory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              <p className="mb-2">
                Your directory currently has <span className="font-semibold text-foreground">{stats.totalBusinesses}</span> businesses
                with a total of <span className="font-semibold text-foreground">{stats.totalReviews.toLocaleString()}</span> reviews.
              </p>
              <p>
                {stats.featuredBusinesses > 0 ? (
                  <>You have <span className="font-semibold text-primary">{stats.featuredBusinesses}</span> featured listings generating premium revenue.</>
                ) : (
                  <>No featured listings yet. Promote the upgrade option to business owners!</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">Add Business</h3>
              <p className="text-sm text-gray-600">Add a new business to the directory</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Review Reports</h3>
              <p className="text-sm text-gray-600">Moderate reported reviews</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="font-semibold mb-2">View Analytics</h3>
              <p className="text-sm text-gray-600">Check platform performance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

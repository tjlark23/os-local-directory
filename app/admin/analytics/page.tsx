"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Building2, MessageSquare, Eye } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

// Mock analytics data
const analytics = {
  overview: {
    totalViews: 45672,
    viewsChange: 15.2,
    totalUsers: 2847,
    usersChange: 8.4,
    totalBusinesses: 156,
    businessesChange: 12.1,
    totalReviews: 1293,
    reviewsChange: 23.5,
  },
  topBusinesses: [
    { name: "Bluebonnet BBQ", views: 1234, reviews: 45 },
    { name: "Hill Country Cafe", views: 987, reviews: 32 },
    { name: "Joe's Pizza", views: 876, reviews: 28 },
    { name: "Tech Repair Pro", views: 654, reviews: 19 },
  ],
  topCategories: [
    { name: "Restaurants", businesses: 45, percentage: 28.8 },
    { name: "Services", businesses: 32, percentage: 20.5 },
    { name: "Shopping", businesses: 28, percentage: 17.9 },
    { name: "Health & Beauty", businesses: 24, percentage: 15.4 },
  ],
  recentActivity: [
    { action: "New business added", details: "Hill Country Dental", time: "2 hours ago" },
    { action: "Review reported", details: "Joe's Pizza review", time: "4 hours ago" },
    { action: "User registered", details: "sarah.johnson@email.com", time: "6 hours ago" },
    { action: "Business claimed", details: "Artisan Coffee Roasters", time: "1 day ago" },
  ],
}

export default function AdminAnalytics() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Platform performance and insights</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalViews.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />+{analytics.overview.viewsChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />+{analytics.overview.usersChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalBusinesses}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />+{analytics.overview.businessesChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.overview.totalReviews.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />+{analytics.overview.reviewsChange}% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Businesses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topBusinesses.map((business, index) => (
                  <div key={business.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{business.name}</p>
                        <p className="text-sm text-gray-500">{business.reviews} reviews</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{business.views.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Business Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCategories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.businesses} businesses</p>
                    </div>
                    <Badge variant="secondary">{category.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, MessageSquare, TrendingUp, Eye, Star } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

// Mock data - in production, this would come from your database
const stats = {
  totalBusinesses: 156,
  totalUsers: 2847,
  totalReviews: 1293,
  monthlyViews: 45672,
  averageRating: 4.3,
  pendingReviews: 23,
}

const recentActivity = [
  {
    id: 1,
    type: "business_added",
    message: "New business 'Hill Country Dental' was added",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "review_reported",
    message: "Review for 'Joe's Pizza' was reported",
    time: "4 hours ago",
    status: "needs_review",
  },
  {
    id: 3,
    type: "user_registered",
    message: "New user 'sarah.johnson@email.com' registered",
    time: "6 hours ago",
    status: "completed",
  },
  {
    id: 4,
    type: "business_claimed",
    message: "'Artisan Coffee Roasters' was claimed by owner",
    time: "1 day ago",
    status: "completed",
  },
]

export default function AdminDashboard() {
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
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+89 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
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
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "completed"
                        ? "default"
                        : activity.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {activity.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
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

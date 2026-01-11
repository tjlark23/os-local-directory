"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Flag, CheckCircle, XCircle, Star, Filter } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

// Mock review data
const reviews = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    business: {
      name: "Bluebonnet BBQ",
      id: "bluebonnet-bbq",
    },
    rating: 5,
    content: "Amazing BBQ! The brisket was tender and flavorful. Highly recommend!",
    date: "2024-01-15",
    status: "published",
    reports: 0,
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    business: {
      name: "Joe's Pizza",
      id: "joes-pizza",
    },
    rating: 1,
    content: "Terrible service and cold pizza. Would not recommend to anyone.",
    date: "2024-01-14",
    status: "reported",
    reports: 3,
  },
  {
    id: "3",
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    business: {
      name: "Hill Country Cafe",
      id: "hill-country-cafe",
    },
    rating: 4,
    content: "Great food and atmosphere. The staff was very friendly and attentive.",
    date: "2024-01-13",
    status: "pending",
    reports: 0,
  },
]

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
            <p className="text-gray-600">Moderate and manage user reviews</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {statusFilter === "all" ? "All" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("published")}>Published</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("reported")}>Reported</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Review List */}
        <Card>
          <CardHeader>
            <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar>
                      <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{review.user.name}</h3>
                        <span className="text-gray-500">reviewed</span>
                        <span className="font-medium text-blue-600">{review.business.name}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>

                      <p className="text-gray-700 mb-2">{review.content}</p>

                      {review.reports > 0 && (
                        <div className="flex items-center space-x-2">
                          <Flag className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">{review.reports} reports</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        review.status === "published"
                          ? "default"
                          : review.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {review.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {review.status === "pending" && (
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Review
                          </DropdownMenuItem>
                        )}
                        {review.status === "published" && (
                          <DropdownMenuItem>
                            <XCircle className="w-4 h-4 mr-2" />
                            Hide Review
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Flag className="w-4 h-4 mr-2" />
                          Delete Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

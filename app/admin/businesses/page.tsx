"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import Image from "next/image"

// Mock business data
const businesses = [
  {
    id: "1",
    name: "Bluebonnet BBQ",
    category: "Restaurants",
    status: "active",
    claimed: true,
    rating: 4.6,
    reviewCount: 127,
    address: "123 Main St, Leander, TX",
    phone: "(512) 555-1234",
    image: "/placeholder.svg?height=60&width=60&text=BBQ",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Hill Country Cafe",
    category: "Restaurants",
    status: "active",
    claimed: true,
    rating: 4.5,
    reviewCount: 76,
    address: "789 Bell Blvd, Cedar Park, TX",
    phone: "(512) 555-2345",
    image: "/placeholder.svg?height=60&width=60&text=Cafe",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    name: "Tech Repair Pro",
    category: "Services",
    status: "pending",
    claimed: false,
    rating: 4.9,
    reviewCount: 156,
    address: "789 Pine St, Leander, TX",
    phone: "(512) 555-9012",
    image: "/placeholder.svg?height=60&width=60&text=Tech",
    lastUpdated: "2024-01-13",
  },
]

export default function AdminBusinesses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || business.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
            <p className="text-gray-600">Manage all businesses in your directory</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Business
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
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
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Business List */}
        <Card>
          <CardHeader>
            <CardTitle>All Businesses ({filteredBusinesses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={business.image || "/placeholder.svg"}
                      alt={business.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{business.name}</h3>
                        {business.claimed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{business.category}</span>
                        <span>•</span>
                        <span>
                          ⭐ {business.rating} ({business.reviewCount} reviews)
                        </span>
                        <span>•</span>
                        <span>{business.phone}</span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">{business.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        business.status === "active"
                          ? "default"
                          : business.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {business.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Business
                        </DropdownMenuItem>
                        {business.status === "pending" && (
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <XCircle className="w-4 h-4 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
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

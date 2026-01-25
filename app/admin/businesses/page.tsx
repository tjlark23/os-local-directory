"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Eye, CheckCircle, Filter, Star, Crown, Loader2 } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import Image from "next/image"
import { CATEGORIES } from "@/lib/db"
import type { Business } from "@/lib/types"

export default function AdminBusinesses() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [stats, setStats] = useState({ total: 0, free: 0, premium: 0, featured: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const response = await fetch('/api/admin/businesses')
        if (response.ok) {
          const data = await response.json()
          setBusinesses(data.businesses || [])
          setStats(data.stats || { total: 0, free: 0, premium: 0, featured: 0 })
        }
      } catch (error) {
        console.error('Error fetching businesses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinesses()
  }, [])

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address?.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || business.category === categoryFilter
    const matchesTier = tierFilter === "all" || business.listingTier === tierFilter
    return matchesSearch && matchesCategory && matchesTier
  })

  // Sort: premium/featured first, then by name
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    if (a.listingTier === "featured" && b.listingTier !== "featured") return -1
    if (b.listingTier === "featured" && a.listingTier !== "featured") return 1
    if (a.listingTier === "premium" && b.listingTier === "free") return -1
    if (b.listingTier === "premium" && a.listingTier === "free") return 1
    return a.name.localeCompare(b.name)
  })

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "featured":
        return <Badge className="bg-yellow-500 text-white"><Crown className="w-3 h-3 mr-1" />Featured</Badge>
      case "premium":
        return <Badge className="bg-blue-500 text-white"><Star className="w-3 h-3 mr-1" />Premium</Badge>
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
            <p className="text-gray-600">Manage all {stats.total} businesses in your directory</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Businesses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.featured}</div>
              <p className="text-sm text-muted-foreground">Featured</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.premium}</div>
              <p className="text-sm text-muted-foreground">Premium</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.free}</div>
              <p className="text-sm text-muted-foreground">Free</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, category, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Category: {categoryFilter === "all" ? "All" : CATEGORIES.find(c => c.id === categoryFilter)?.name || categoryFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                  {CATEGORIES.map((cat) => (
                    <DropdownMenuItem key={cat.id} onClick={() => setCategoryFilter(cat.id)}>
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Tier: {tierFilter === "all" ? "All" : tierFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTierFilter("all")}>All Tiers</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTierFilter("featured")}>Featured</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTierFilter("premium")}>Premium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTierFilter("free")}>Free</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Business List */}
        <Card>
          <CardHeader>
            <CardTitle>Businesses ({sortedBusinesses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedBusinesses.map((business) => (
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
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {getTierBadge(business.listingTier)}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{business.category}</span>
                        <span>•</span>
                        <span>⭐ {business.rating} ({business.reviewCount} reviews)</span>
                        <span>•</span>
                        <span>{business.address?.city}</span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">{business.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/business/${business.id}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            View Live Page
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/businesses/edit/${business.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Business
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {sortedBusinesses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No businesses found matching your filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

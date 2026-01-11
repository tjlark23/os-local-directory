"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, MapPin } from "lucide-react"

export function GoogleSyncAdmin() {
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState("Leander, TX")
  const [results, setResults] = useState<any[]>([])
  const [syncStatus, setSyncStatus] = useState("")

  const categories = [
    "restaurants",
    "coffee shops",
    "auto repair",
    "hair salon",
    "dentist",
    "veterinarian",
    "real estate",
    "shopping",
    "entertainment",
  ]

  const handleSync = async () => {
    setIsLoading(true)
    setSyncStatus("Starting sync...")

    try {
      const response = await fetch("/api/sync-google-places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          categories,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.businesses)
        setSyncStatus(`Successfully synced ${data.count} businesses`)
      } else {
        setSyncStatus("Sync failed: " + data.error)
      }
    } catch (error) {
      setSyncStatus("Sync failed: " + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Google Places Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter city, state" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categories to Sync</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleSync} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              "Start Sync"
            )}
          </Button>

          {syncStatus && (
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-sm">{syncStatus}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Results ({results.length} businesses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((business, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{business.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {business.address.full}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{business.category}</Badge>
                    <p className="text-sm text-gray-500 mt-1">
                      ⭐ {business.rating} ({business.reviewCount})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

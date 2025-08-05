"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Image from "next/image"

interface BusinessPageContentProps {
  business: {
    name: string
    description: string
    specialties: string[]
    photos: string[]
    videos: string[]
  }
}

export function BusinessPageContent({ business }: BusinessPageContentProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-1 border-b-2 font-medium text-sm ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={`pb-3 px-1 border-b-2 font-medium text-sm ${
            activeTab === "photos"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Photos ({business.photos.length})
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`pb-3 px-1 border-b-2 font-medium text-sm ${
            activeTab === "videos"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Videos ({business.videos.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Photos & Videos Preview */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Photos & Videos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {business.photos.slice(0, 3).map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
                {business.videos.length > 0 && (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">+{business.videos.length}</p>
                      <p className="text-xs text-gray-500">Videos</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About {business.name}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{business.description}</p>

              <div>
                <h4 className="font-semibold mb-3">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {business.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "photos" && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {business.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={photo || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "videos" && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.videos.map((video, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                >
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

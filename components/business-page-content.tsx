"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Camera, Video, Info, Sparkles } from "lucide-react"
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "photos", label: `Photos (${business.photos.length})`, icon: Camera },
    { id: "videos", label: `Videos (${business.videos.length})`, icon: Video },
  ]

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">Photos & Videos</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {business.photos.slice(0, 3).map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(photo)}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
                  </div>
                ))}
                {business.videos.length > 0 && (
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer group hover:bg-muted/80 transition-colors">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary ml-1" />
                      </div>
                      <p className="font-medium text-foreground">+{business.videos.length}</p>
                      <p className="text-sm text-muted-foreground">Videos</p>
                    </div>
                  </div>
                )}
              </div>
              {business.photos.length > 3 && (
                <Button variant="outline" className="w-full mt-4 bg-transparent" onClick={() => setActiveTab("photos")}>
                  View all {business.photos.length} photos
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">About {business.name}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-base">{business.description}</p>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">Specialties</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {business.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default"
                    >
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
        <Card className="overflow-hidden border-border/50 animate-fade-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {business.photos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(photo)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "videos" && (
        <Card className="overflow-hidden border-border/50 animate-fade-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {business.videos.map((video, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer group"
                >
                  <Image src={video || "/placeholder.svg"} alt={`Video ${index + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center group-hover:bg-foreground/40 transition-colors">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-foreground/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image src={selectedImage || "/placeholder.svg"} alt="Full size" fill className="object-contain" />
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-background rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

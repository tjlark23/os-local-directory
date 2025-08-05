"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const featuredBusinesses = [
  {
    name: "Joe's Pizza",
    image: "/placeholder.svg?height=800&width=1200",
    description: "Photo from the business owner",
  },
  {
    name: "Sunset Cafe",
    image: "/placeholder.svg?height=800&width=1200",
    description: "Photo from the business owner",
  },
  {
    name: "Green Thumb Nursery",
    image: "/placeholder.svg?height=800&width=1200",
    description: "Photo from the business owner",
  },
  {
    name: "Mike's Auto Repair",
    image: "/placeholder.svg?height=800&width=1200",
    description: "Photo from the business owner",
  },
  {
    name: "Bella's Salon",
    image: "/placeholder.svg?height=800&width=1200",
    description: "Photo from the business owner",
  },
  {
    name: "Family Fun Center",
    image: "/placeholder.svg?height=800&width=1200",
    description: "Photo from the business owner",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredBusinesses.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&location=Leander, TX`)
    }
  }

  const currentBusiness = featuredBusinesses[currentSlide]

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentBusiness.image || "/placeholder.svg"}
          alt={currentBusiness.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Discover Local
              <br />
              Excellence
            </h1>

            {/* Search Bar */}
            <div className="flex max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="restaurants, plumbers, Joe's Pizza..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-r-none border-r-0 bg-white"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-l-none text-lg font-medium"
              >
                Find local businesses
              </Button>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="absolute bottom-8 left-8">
          <h3 className="text-white text-xl font-semibold mb-1">{currentBusiness.name}</h3>
          <p className="text-white/80 text-sm">{currentBusiness.description}</p>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredBusinesses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

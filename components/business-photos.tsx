"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BusinessPhotosProps {
  images: string[]
}

export function BusinessPhotos({ images }: BusinessPhotosProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={images[currentImage] || "/placeholder.svg"}
            alt="Business photo"
            width={600}
            height={400}
            className="w-full h-80 object-cover rounded-t-lg"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden ${
                    index === currentImage ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image src={image || "/placeholder.svg"} alt={`Photo ${index + 1}`} fill className="object-cover" />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">+{images.length - 4}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

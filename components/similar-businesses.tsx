import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Business } from "@/lib/types"

interface SimilarBusinessesProps {
  businesses: Business[]
}

export function SimilarBusinesses({ businesses }: SimilarBusinessesProps) {
  if (businesses.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Similar Businesses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {businesses.map((business) => (
          <Link
            key={business.id}
            href={`/business/${business.id}`}
            className="flex gap-3 group"
          >
            <div className="relative flex-shrink-0">
              <Image
                src={business.image || "/placeholder.svg"}
                alt={business.name}
                width={80}
                height={60}
                className="w-20 h-16 object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                {business.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {business.category}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{business.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({business.reviewCount})
                </span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{business.address.city}</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

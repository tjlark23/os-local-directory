import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>

        <p className="text-muted-foreground mb-6">
          We couldn't find the category or city you're looking for.
          It may have been moved or doesn't exist yet.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search Businesses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

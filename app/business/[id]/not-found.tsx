import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Home, Search } from "lucide-react"

export default function BusinessNotFound() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-4">Business Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The business you're looking for doesn't exist or may have been removed from our directory.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Businesses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

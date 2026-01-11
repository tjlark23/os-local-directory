import { MapPin } from "lucide-react"

export function HeroTagline() {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-3">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Leander, TX & Surrounding Areas</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
          Discover the Best Local Businesses
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Find trusted restaurants, services, and shops in your neighborhood. Read reviews, compare options, and support
          local.
        </p>
      </div>
    </div>
  )
}

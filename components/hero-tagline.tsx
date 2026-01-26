import { MapPin } from "lucide-react"

export function HeroTagline() {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium uppercase tracking-wider">Leander, Cedar Park, Liberty Hill, Texas</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 text-balance">
          Discover the Best Local Businesses
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Find trusted restaurants, services, and shops in your neighborhood. Read reviews, compare options, and support local.
        </p>
      </div>
    </div>
  )
}

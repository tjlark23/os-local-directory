"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  Menu,
  MapPin,
  Utensils,
  Home,
  Car,
  Sparkles,
  PartyPopper,
  ShoppingBag,
  PawPrint,
  Briefcase,
  Mail,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLocationOptional } from "@/lib/location-context"

const categories = [
  { name: "Restaurants", href: "/search?category=restaurants", icon: Utensils },
  { name: "Home Services", href: "/search?category=home", icon: Home },
  { name: "Auto Services", href: "/search?category=automotive", icon: Car },
  { name: "Health & Beauty", href: "/search?category=health", icon: Sparkles },
  { name: "Entertainment", href: "/search?category=entertainment", icon: PartyPopper },
  { name: "Shopping", href: "/search?category=shopping", icon: ShoppingBag },
  { name: "Pets", href: "/search?category=pets", icon: PawPrint },
  { name: "Services", href: "/search?category=services", icon: Briefcase },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  // Get location context if available (multi-tenant)
  const locationContext = useLocationOptional()
  const cities = locationContext?.cities || ["Austin", "Cedar Park", "Georgetown", "Leander", "Liberty Hill", "Pflugerville", "Round Rock"]
  const brandName = locationContext?.brandName || "Leander Scoop"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) {
      params.set("q", searchQuery)
    }
    if (selectedCity !== "all") {
      params.set("city", selectedCity)
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`)
    setIsOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-card"
      }`}
    >
      {/* Main Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo - use location logo if available, otherwise default */}
            <Link href="/" className="flex-shrink-0 group">
              {locationContext?.location.logo_url ? (
                <Image
                  src={locationContext.location.logo_url}
                  alt={brandName}
                  width={160}
                  height={36}
                  className="h-8 w-auto group-hover:opacity-80 transition-opacity duration-300"
                />
              ) : (
                <Image
                  src="/images/leander-20scoop-20text-20logo.png"
                  alt={brandName}
                  width={160}
                  height={36}
                  className="h-8 w-auto group-hover:opacity-80 transition-opacity duration-300"
                />
              )}
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-muted/50 border-border rounded-lg focus:bg-card focus:ring-2 focus:ring-primary/30 transition-all w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-10 w-[140px] border-border bg-muted/50 rounded-lg flex-shrink-0">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                size="sm"
                className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex-shrink-0"
              >
                Search
              </Button>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Link href="/business-inquiry">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  For Businesses
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </Link>
            </div>

            {/* Mobile Search Button & Menu */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/search")}
                className="text-muted-foreground"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-4 mt-8">
                    {/* Mobile Search */}
                    <div className="space-y-3">
                      <Input
                        placeholder="Search businesses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </div>

                    {/* Mobile Nav Links */}
                    <div className="border-t border-border pt-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">
                        Categories
                      </p>
                      {categories.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Icon className="mr-2 h-4 w-4" />
                              {item.name}
                            </Button>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <Link href="/business-inquiry" onClick={() => setIsOpen(false)}>
                        <Button variant="default" className="w-full bg-primary hover:bg-primary/90">
                          For Businesses
                        </Button>
                      </Link>
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Us
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar - Desktop Only */}
      <div className="hidden md:block bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

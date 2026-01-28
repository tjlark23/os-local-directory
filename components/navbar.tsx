"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Menu,
  MapPin,
  Utensils,
  Home,
  Car,
  Sparkles,
  PartyPopper,
  PawPrint,
  Briefcase,
  Newspaper,
  Building2,
  FolderOpen,
  BriefcaseBusiness,
  BookOpen,
} from "lucide-react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useLocationOptional } from "@/lib/location-context"
import { siteConfig } from "@/lib/site-config"

const categories = [
  { name: "Restaurants", href: "/categories/restaurants-leander-tx", icon: Utensils },
  { name: "Home Services", href: "/categories/home-leander-tx", icon: Home },
  { name: "Auto Services", href: "/categories/automotive-leander-tx", icon: Car },
  { name: "Health & Beauty", href: "/categories/health-leander-tx", icon: Sparkles },
  { name: "Entertainment", href: "/categories/entertainment-leander-tx", icon: PartyPopper },
  { name: "Pets", href: "/categories/pets-leander-tx", icon: PawPrint },
  { name: "Services", href: "/categories/services-leander-tx", icon: Briefcase },
]

// Main navigation items
const mainNav = [
  { name: "News", href: "/news", icon: Newspaper, status: "coming-soon" as const },
  { name: "Business", href: "/business-insights", icon: Building2, status: "coming-soon" as const },
  { name: "Directory", href: "/", icon: FolderOpen, status: "active" as const },
  { name: "Jobs", href: "/jobs", icon: BriefcaseBusiness, status: "coming-soon" as const },
  { name: "Resources", href: "/guides", icon: BookOpen, status: "active" as const },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Get location context if available (multi-tenant)
  const locationContext = useLocationOptional()
  const cities = locationContext?.cities || ["Austin", "Cedar Park", "Georgetown", "Leander", "Liberty Hill", "Pflugerville", "Round Rock", "Hutto", "Taylor"]

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

  // Check if a nav item is active
  const isNavActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname.startsWith("/search") || pathname.startsWith("/categories") || pathname.startsWith("/neighborhoods") || pathname.startsWith("/business/")
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg" : "bg-card"
      }`}
    >
      {/* Main Navigation Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{siteConfig.name}</span>
            </Link>

            {/* Desktop Main Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNav.map((item) => {
                const Icon = item.icon
                const active = isNavActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {item.status === "coming-soon" && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700">
                        Soon
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-muted/50 border-border rounded-lg focus:bg-card focus:ring-2 focus:ring-primary/30 transition-all w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                size="sm"
                className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Search
              </Button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Link href="/business-inquiry">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  List Your Business
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="flex lg:hidden items-center gap-2">
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

                    {/* Mobile Main Nav */}
                    <div className="border-t border-border pt-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">
                        Sections
                      </p>
                      {mainNav.map((item) => {
                        const Icon = item.icon
                        const active = isNavActive(item.href)
                        return (
                          <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className="w-full justify-start"
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {item.name}
                              {item.status === "coming-soon" && (
                                <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700">
                                  Soon
                                </Badge>
                              )}
                            </Button>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Mobile Categories */}
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
                          List Your Business
                        </Button>
                      </Link>
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
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
      <div className="hidden lg:block bg-muted/60 border-b border-border">
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

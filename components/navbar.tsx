"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  Menu,
  User,
  Heart,
  LogOut,
  ChevronDown,
  MapPin,
  Utensils,
  Home,
  Car,
  Sparkles,
  PartyPopper,
  Baby,
  PawPrint,
  Building,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"
import { useRouter } from "next/navigation"

const categories = [
  { name: "Restaurants", href: "/search?category=restaurants", icon: Utensils },
  { name: "Home & Garden", href: "/search?category=home-garden", icon: Home },
  { name: "Auto Services", href: "/search?category=auto-services", icon: Car },
  { name: "Health & Beauty", href: "/search?category=health-beauty", icon: Sparkles },
  { name: "Entertainment", href: "/search?category=entertainment", icon: PartyPopper },
  { name: "Kids", href: "/search?category=kids", icon: Baby },
  { name: "Pets", href: "/search?category=pets", icon: PawPrint },
  { name: "Real Estate", href: "/search?category=real-estate", icon: Building },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Leander, TX")
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`)
    }
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
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <Image
                src="/images/leander-20scoop-20text-20logo.png"
                alt="Leander Scoop"
                width={160}
                height={36}
                className="h-8 w-auto group-hover:opacity-80 transition-opacity duration-300"
              />
            </Link>

            <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-muted/50 border-border rounded-lg focus:bg-card focus:ring-2 focus:ring-primary/30 transition-all"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-10 w-[160px] border-border bg-muted/50 rounded-lg">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Leander, TX">Leander, TX</SelectItem>
                  <SelectItem value="Cedar Park, TX">Cedar Park, TX</SelectItem>
                  <SelectItem value="Liberty Hill, TX">Liberty Hill, TX</SelectItem>
                  <SelectItem value="Round Rock, TX">Round Rock, TX</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                size="sm"
                className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              >
                Search
              </Button>
            </div>

            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    For Business
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/business/add">Add Your Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/business/claim">Claim Your Business</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/advertise">Advertise</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/reviews/write">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Write a Review
                </Button>
              </Link>

              {user ? (
                <>
                  <Link href="/favorites">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full ring-2 ring-border hover:ring-primary transition-all"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="space-y-3">
                    <Input
                      placeholder="Search businesses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leander, TX">Leander, TX</SelectItem>
                        <SelectItem value="Cedar Park, TX">Cedar Park, TX</SelectItem>
                        <SelectItem value="Liberty Hill, TX">Liberty Hill, TX</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSearch} className="w-full bg-primary hover:bg-primary/90">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    {user ? (
                      <>
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Link href="/favorites" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Heart className="mr-2 h-4 w-4" />
                            Favorites
                          </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full">
                            Log in
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-primary hover:bg-primary/90">Sign up</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="bg-muted/60 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto scrollbar-hide">
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

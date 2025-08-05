"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, User, Heart, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Leander, TX")
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image src="/leander-scoop-logo.png" alt="Leander Scoop" width={40} height={40} className="w-16 h-16" />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex w-full shadow-sm">
              <Input
                placeholder="restaurants, plumbers, Joe's Pizza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-12 rounded-r-none border-r-0 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-32 h-12 rounded-none border-l-0 border-r-0 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                className="h-12 px-4 bg-blue-600 hover:bg-blue-700 rounded-l-none border-l-0"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  Leander Scoop for Business
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Write a Review
              </Button>
            </Link>

            {user ? (
              <>
                <Link href="/favorites">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="space-y-2">
                  <Input
                    placeholder="restaurants, plumbers, Joe's Pizza..."
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
                  <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>

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
                    <Button variant="ghost" className="w-full justify-start" onClick={logout}>
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
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8 h-12 overflow-x-auto">
            <Link
              href="/search?category=restaurants"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Restaurants</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=home-garden"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Home & Garden</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=auto-services"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Auto Services</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=health-beauty"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Health & Beauty</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=entertainment"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Entertainment</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=kids"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Kids</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=pets"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Pets</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
            <Link
              href="/search?category=real-estate"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <span className="text-sm font-medium">Real Estate</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/leander-scoop-logo.png" alt="Leander Scoop" width={48} height={48} className="w-12 h-12" />
              <div>
                <div className="font-bold text-xl">LEANDER</div>
                <div className="font-bold text-xl">SCOOP</div>
              </div>
            </div>
            <h3 className="font-semibold mb-2">Local Directory</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted source for discovering the best local businesses in Leander, Cedar Park, and Liberty Hill.
            </p>
            <p className="text-gray-400 text-sm">Connecting communities with quality businesses since 2024.</p>

            <div className="flex space-x-3 mt-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search?location=leander" className="text-gray-400 hover:text-white">
                  Leander Businesses
                </Link>
              </li>
              <li>
                <Link href="/search?location=cedar-park" className="text-gray-400 hover:text-white">
                  Cedar Park Businesses
                </Link>
              </li>
              <li>
                <Link href="/search?location=liberty-hill" className="text-gray-400 hover:text-white">
                  Liberty Hill Businesses
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/featured" className="text-gray-400 hover:text-white">
                  Featured Businesses
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h3 className="font-semibold mb-4">For Businesses</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/business/add" className="text-gray-400 hover:text-white">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/business/claim" className="text-gray-400 hover:text-white">
                  Claim Your Listing
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-gray-400 hover:text-white">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link href="/business/resources" className="text-gray-400 hover:text-white">
                  Business Resources
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">Get updates on new businesses and local events.</p>
            <div className="flex space-x-2 mb-4">
              <Input
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">✓</Button>
            </div>

            <div className="space-y-1 text-sm text-gray-400">
              <div>hello@leanderscoop.com</div>
              <div>(512) 555-0123</div>
              <div>Leander, TX</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Leander Scoop Directory. All rights reserved.
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="text-sm text-gray-400">Our Network</div>
              <div className="flex space-x-4 text-sm">
                <Link href="/news" className="text-gray-400 hover:text-white">
                  Leander Scoop News
                </Link>
                <Link href="/round-rock" className="text-gray-400 hover:text-white">
                  Round Rock Scoop
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-4 mt-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white">
              Cookie Policy
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact Us
            </Link>
            <Link href="/sitemap" className="hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

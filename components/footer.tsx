import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        {/* 4-column grid - About takes 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">

          {/* Column 1: About (wider - 2 columns) */}
          <div className="lg:col-span-2">
            {/* Logo Image */}
            <Image
              src="/images/leander-20scoop-20text-20logo.png"
              alt="Leander Scoop"
              width={200}
              height={60}
              className="mb-4"
              quality={75}
            />
            <p className="text-sm mb-4 leading-relaxed">
              Discover the best local businesses in Leander, Cedar Park, and Liberty Hill. Your trusted community directory.
            </p>
            {/* Social media icons */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/categories/restaurants-leander-tx" className="hover:text-white transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/categories/automotive-leander-tx" className="hover:text-white transition-colors">
                  Auto Services
                </Link>
              </li>
              <li>
                <Link href="/categories/health-leander-tx" className="hover:text-white transition-colors">
                  Health & Beauty
                </Link>
              </li>
              <li>
                <Link href="/categories/home-leander-tx" className="hover:text-white transition-colors">
                  Home Services
                </Link>
              </li>
              <li>
                <Link href="/categories/entertainment-leander-tx" className="hover:text-white transition-colors">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/categories/pets-leander-tx" className="hover:text-white transition-colors">
                  Pets
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: For Businesses */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">For Businesses</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/business-inquiry" className="hover:text-white transition-colors">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link href="/upgrade" className="hover:text-white transition-colors">
                  Upgrade Listing
                </Link>
              </li>
              <li>
                <Link href="/business-inquiry" className="hover:text-white transition-colors">
                  Advertise With Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Business Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 Leander Scoop. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/leander-scoop-logo.png" alt="Leander Scoop" width={48} height={48} className="w-12 h-12" />
              <div>
                <div className="font-bold text-xl">Leander Scoop</div>
                <div className="text-sm text-background/60">Local Directory</div>
              </div>
            </div>
            <p className="text-background/70 text-sm mb-6 leading-relaxed">
              Your trusted source for discovering the best local businesses in Leander, Cedar Park, and Liberty Hill.
              Connecting communities since 2024.
            </p>

            <div className="flex gap-2">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
              ].map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="text-background/60 hover:text-background hover:bg-background/10 rounded-full transition-all"
                  asChild
                >
                  <Link href={social.href}>
                    <social.icon className="w-5 h-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Home", href: "/" },
                { name: "Leander Businesses", href: "/search?city=Leander" },
                { name: "Cedar Park Businesses", href: "/search?city=Cedar Park" },
                { name: "Liberty Hill Businesses", href: "/search?city=Liberty Hill" },
                { name: "All Categories", href: "/search" },
                { name: "Featured Businesses", href: "/search" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors inline-flex items-center group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Contact */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">About</h3>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors inline-flex items-center group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Stay Connected</h3>
            <p className="text-background/70 text-sm mb-4">Get updates on new businesses and local events.</p>
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:bg-background/20"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 text-sm text-background/60">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@leanderscoop.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>(512) 487-7302</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Leander, TX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/50">© 2025 Leander Scoop Directory. All rights reserved.</div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-background/40">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Cookie Policy", href: "/cookies" },
                { name: "Contact Us", href: "/contact" },
              ].map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-background transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/components/auth-provider"
import { Footer } from "@/components/footer"
import { getCurrentLocation } from "@/lib/get-location"
import { LocationProvider } from "@/lib/location-context"

const inter = Inter({ subsets: ["latin"] })

// Default site config - will be overridden per location when DB is set up
const siteConfig = {
  name: "Leander Scoop Directory",
  description: "Find the best local businesses in Leander, Cedar Park, and Liberty Hill, Texas. Browse restaurants, services, shops, and more with reviews and ratings from your neighbors.",
  url: "https://directory.leanderscoop.com",
  ogImage: "/og-image.jpg",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Leander Scoop Directory | Local Businesses in Leander, Cedar Park & Liberty Hill TX",
    template: "%s | Leander Scoop Directory",
  },
  description: siteConfig.description,
  keywords: [
    "Leander Texas",
    "Cedar Park Texas",
    "Liberty Hill Texas",
    "local business directory",
    "Leander restaurants",
    "Cedar Park businesses",
    "Liberty Hill shops",
    "Austin area businesses",
    "Williamson County directory",
    "local services Leander",
    "best restaurants Leander TX",
    "Leander Scoop",
  ],
  authors: [{ name: "Leander Scoop" }],
  creator: "Leander Scoop",
  publisher: "Leander Scoop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Leander Scoop Directory - Local Businesses in Leander, Cedar Park & Liberty Hill",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    // Add these after setting up Google Search Console
    // google: "your-google-verification-code",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Try to get location from database, fallback gracefully if not set up yet
  let location = null
  try {
    location = await getCurrentLocation()
  } catch (error) {
    // Database not set up yet, continue with default config
    console.log('Location fetch failed, using defaults:', error)
  }

  const content = (
    <AuthProvider>
      <Navbar />
      <main className="pt-28">{children}</main>
      <Footer />
    </AuthProvider>
  )

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f97316" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        {location ? (
          <LocationProvider location={location}>
            {content}
          </LocationProvider>
        ) : (
          content
        )}
      </body>
    </html>
  )
}

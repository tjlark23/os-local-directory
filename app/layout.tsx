import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getCurrentLocation } from "@/lib/get-location"
import { LocationProvider } from "@/lib/location-context"
import { siteConfig } from "@/lib/site-config"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Local Businesses in Williamson County TX`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Williamson County Texas",
    "Leander Texas",
    "Cedar Park Texas",
    "Liberty Hill Texas",
    "Round Rock Texas",
    "Pflugerville Texas",
    "Georgetown Texas",
    "local business directory",
    "Leander restaurants",
    "Cedar Park businesses",
    "Round Rock shops",
    "Austin area businesses",
    "Williamson County directory",
    "local services",
    "WilCo Guide",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.jpg"],
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
    // Google Search Console verification
    // google: "PASTE_YOUR_CODE_HERE",
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
            {children}
          </LocationProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/components/auth-provider"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leander Scoop - Discover Local Excellence",
  description:
    "Find the best local businesses in Leander, Cedar Park, and Liberty Hill. Read reviews and connect with your community.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="pt-28">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

import type React from "react"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/components/auth-provider"
import { Footer } from "@/components/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="pt-28">{children}</main>
      <Footer />
    </AuthProvider>
  )
}

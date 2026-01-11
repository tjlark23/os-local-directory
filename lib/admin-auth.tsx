"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminUser {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "moderator"
  permissions: string[]
}

interface AdminAuthContextType {
  adminUser: AdminUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Mock admin users - in production, this would be in your database
const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@leanderscoop.com",
    password: "admin123", // In production, this would be hashed
    name: "Admin User",
    role: "super_admin" as const,
    permissions: ["manage_businesses", "manage_users", "manage_reviews", "view_analytics", "manage_admins"],
  },
  {
    id: "2",
    email: "moderator@leanderscoop.com",
    password: "mod123",
    name: "Moderator User",
    role: "moderator" as const,
    permissions: ["manage_businesses", "manage_reviews", "view_analytics"],
  },
]

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing admin session
    const savedAdmin = localStorage.getItem("admin_user")
    if (savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call your API
    const user = ADMIN_USERS.find((u) => u.email === email && u.password === password)

    if (user) {
      const adminUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      }
      setAdminUser(adminUser)
      localStorage.setItem("admin_user", JSON.stringify(adminUser))
      return true
    }
    return false
  }

  const logout = () => {
    setAdminUser(null)
    localStorage.removeItem("admin_user")
  }

  return (
    <AdminAuthContext.Provider value={{ adminUser, login, logout, isLoading }}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

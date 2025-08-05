"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call your API
    setUser({
      id: "1",
      name: "John Doe",
      email,
      avatar: "/placeholder.svg?height=32&width=32",
    })
  }

  const logout = () => {
    setUser(null)
  }

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - in real app, this would call your API
    setUser({
      id: "1",
      name,
      email,
      avatar: "/placeholder.svg?height=32&width=32",
    })
  }

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Location } from "./database.types"

interface LocationContextType {
  location: Location
  cities: string[]
  brandName: string
  primaryColor: string
  tagline: string
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({
  children,
  location
}: {
  children: ReactNode
  location: Location
}) {
  const value: LocationContextType = {
    location,
    cities: location.cities,
    brandName: location.name,
    primaryColor: location.primary_color,
    tagline: location.tagline || `Your Local Guide to ${location.cities.join(', ')}`,
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}

// Optional hook that returns null instead of throwing
export function useLocationOptional() {
  return useContext(LocationContext)
}

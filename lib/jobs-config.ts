/**
 * Job Board Configuration
 * Types and sample data structure for the jobs feature
 */

export interface Job {
  id: string
  title: string
  company: string
  businessId?: string // Link to business in directory
  location: string
  city: string
  type: "full-time" | "part-time" | "contract" | "temporary" | "internship"
  salary?: {
    min?: number
    max?: number
    period: "hourly" | "yearly"
  }
  description: string
  requirements?: string[]
  benefits?: string[]
  category: string
  postedDate: string
  expiresDate?: string
  featured: boolean
  applyUrl?: string
  applyEmail?: string
}

export const JOB_CATEGORIES = [
  { id: "restaurant-hospitality", name: "Restaurant & Hospitality" },
  { id: "retail", name: "Retail" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "automotive", name: "Automotive" },
  { id: "technology", name: "Technology" },
  { id: "professional-services", name: "Professional Services" },
  { id: "construction-trades", name: "Construction & Trades" },
  { id: "other", name: "Other" },
]

export const JOB_TYPES = [
  { id: "full-time", name: "Full-time" },
  { id: "part-time", name: "Part-time" },
  { id: "contract", name: "Contract" },
  { id: "temporary", name: "Temporary" },
  { id: "internship", name: "Internship" },
]

// Sample jobs for initial display (will be replaced with DB)
export const SAMPLE_JOBS: Job[] = [
  {
    id: "1",
    title: "Line Cook",
    company: "Local BBQ Restaurant",
    location: "Leander, TX",
    city: "Leander",
    type: "full-time",
    salary: { min: 15, max: 20, period: "hourly" },
    description: "We're looking for an experienced line cook to join our growing BBQ team. Must have experience with smokers and grills.",
    requirements: ["2+ years kitchen experience", "Food handler certification", "Ability to work weekends"],
    category: "restaurant-hospitality",
    postedDate: "2025-01-25",
    featured: true,
  },
  {
    id: "2",
    title: "Dental Hygienist",
    company: "Cedar Park Family Dentistry",
    location: "Cedar Park, TX",
    city: "Cedar Park",
    type: "full-time",
    salary: { min: 70000, max: 85000, period: "yearly" },
    description: "Join our friendly dental practice as a registered dental hygienist. Great team environment with modern equipment.",
    requirements: ["RDH license in Texas", "2+ years experience", "Excellent patient communication"],
    benefits: ["Health insurance", "401k matching", "Paid time off"],
    category: "healthcare",
    postedDate: "2025-01-24",
    featured: true,
  },
  {
    id: "3",
    title: "Retail Sales Associate",
    company: "Boutique Shop",
    location: "Round Rock, TX",
    city: "Round Rock",
    type: "part-time",
    salary: { min: 14, max: 16, period: "hourly" },
    description: "Part-time sales position at our local boutique. Perfect for students or those seeking flexible hours.",
    requirements: ["Customer service experience preferred", "Flexible schedule"],
    category: "retail",
    postedDate: "2025-01-23",
    featured: false,
  },
]

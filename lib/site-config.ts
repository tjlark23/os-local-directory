/**
 * Site Configuration
 * Centralized branding and site settings for WilCo Guide
 */

export const siteConfig = {
  name: "WilCo Guide",
  url: "https://wilcoguide.com",
  tagline: "Your Complete Guide to Williamson County",
  description: "Your complete guide to Williamson County - news, businesses, jobs and more",

  // Contact
  email: "hello@leanderscoop.com",

  // Social/attribution
  poweredBy: [
    { name: "Leander Scoop", url: "https://leanderscoop.com" },
    { name: "Round Rock Scoop", url: "https://roundrockscoop.com" },
  ],

  // Navigation sections
  navigation: [
    { name: "News", href: "/news", status: "coming-soon" },
    { name: "Business", href: "/business-insights", status: "coming-soon" },
    { name: "Directory", href: "/", status: "active" },
    { name: "Jobs", href: "/jobs", status: "coming-soon" },
    { name: "Resources", href: "/guides", status: "active" },
  ],

  // Source filtering
  sources: {
    leander: {
      cities: ["Leander", "Cedar Park", "Liberty Hill"],
      attribution: "Brought to you by Leander Scoop",
      attributionLink: "https://leanderscoop.com",
    },
    roundrock: {
      cities: ["Round Rock", "Pflugerville", "Hutto", "Georgetown", "Taylor"],
      attribution: "Brought to you by Round Rock Scoop",
      attributionLink: "https://roundrockscoop.com",
    },
  },

  // All covered cities
  allCities: [
    "Leander", "Cedar Park", "Liberty Hill",
    "Round Rock", "Pflugerville", "Hutto",
    "Georgetown", "Taylor", "Austin"
  ],
}

export type SiteConfig = typeof siteConfig

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login', '/signup'],
    },
    sitemap: 'https://directory.leanderscoop.com/sitemap.xml',
  }
}

import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://directory.leanderscoop.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/signup",
          "/logout",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

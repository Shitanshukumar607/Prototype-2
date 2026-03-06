import type { MetadataRoute } from "next"

// Allow search engines to crawl and index the public site.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/api/*"],
      },
    ],
    // You can add a real sitemap URL later if you generate one.
    sitemap: undefined,
  }
}



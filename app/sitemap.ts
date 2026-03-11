import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luminus.rnsit.ac.in";

  const routes = ["/", "/events", "/about", "/schedule", "/contact"];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));
}

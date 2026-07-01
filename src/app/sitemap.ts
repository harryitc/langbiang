import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/2025`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

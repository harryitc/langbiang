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
    {
      url: `${site.url}/tin-tuc`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/gay-quy`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

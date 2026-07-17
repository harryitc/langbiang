import type { MetadataRoute } from "next";
import { news, site } from "@/lib/site";

const lastModified = new Date("2026-07-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/chuong-trinh", changeFrequency: "monthly", priority: 0.8 },
    { path: "/gay-quy", changeFrequency: "monthly", priority: 0.8 },
    { path: "/dong-gop", changeFrequency: "monthly", priority: 0.7 },
    { path: "/ban-to-chuc", changeFrequency: "monthly", priority: 0.7 },
    { path: "/cam-nhan", changeFrequency: "monthly", priority: 0.6 },
    { path: "/tin-tuc", changeFrequency: "weekly", priority: 0.8 },
    { path: "/2025", changeFrequency: "monthly", priority: 0.7 },
  ];

  const staticRoutes = routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const newsRoutes = news.map((post) => ({
    url: `${site.url}/tin-tuc/${post.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getContent } from "@/lib/content/store";

const lastModified = new Date("2026-07-06");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { news, pastYears } = await getContent();

  const routes: { path: string; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/chuong-trinh", changeFrequency: "monthly", priority: 0.8 },
    { path: "/gay-quy", changeFrequency: "monthly", priority: 0.8 },
    { path: "/ban-to-chuc", changeFrequency: "monthly", priority: 0.7 },
    { path: "/tin-tuc", changeFrequency: "weekly", priority: 0.8 },
  ];

  const staticRoutes = routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Trang "Nhìn lại" của từng năm đã qua (FR4), mới → cũ.
  const yearRoutes = [...pastYears]
    .sort((a, b) => b.year - a.year)
    .map((y) => ({
      url: `${site.url}/${y.year}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const newsRoutes = news.map((post) => ({
    url: `${site.url}/tin-tuc/${post.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...yearRoutes, ...newsRoutes];
}

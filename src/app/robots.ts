import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Chặn khu vực quản trị & API khỏi công cụ tìm kiếm.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

import { news, site } from "@/lib/site";
import { CONTENT_VERSION, type SiteContent } from "./schema";

/**
 * Giá trị mặc định = nội dung đang hard-code trong site.ts.
 * Đây là "lưới an toàn": nếu Redis trống hoặc lỗi, website vẫn hiển thị đầy đủ.
 */
export const defaultContent: SiteContent = {
  version: CONTENT_VERSION,
  site: {
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    subtitle: site.subtitle,
    dateLabel: site.dateLabel,
    dateISO: site.dateISO,
    location: site.location,
    description: site.description,
    facebook: site.facebook,
    email: site.email,
    shopee: site.shopee,
    keywords: [...site.keywords],
  },
  news: news.map((n) => ({ ...n, body: n.body ? [...n.body] : undefined })),
};

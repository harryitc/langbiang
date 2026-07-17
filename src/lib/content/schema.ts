import type { NewsPost } from "@/lib/site";

/**
 * Phần thông tin chung của site có thể chỉnh trong trang quản trị.
 * (Riêng `url` vẫn lấy từ biến môi trường, không cho sửa qua admin.)
 */
export type SiteMeta = {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  dateLabel: string;
  dateISO: string;
  location: string;
  description: string;
  facebook: string;
  email: string;
  shopee: string;
  keywords: string[];
};

/**
 * Toàn bộ nội dung động của website (nguồn sự thật khi có bản lưu trong Redis).
 * Thiết kế để mở rộng dần: hiện demo quản lý `site` (SEO) và `news`,
 * các phần khác (activities, timeline, gallery, faqs, sponsors, board...) sẽ
 * thêm field vào đây theo cùng một khuôn mẫu.
 */
export type SiteContent = {
  /** Phiên bản schema để về sau còn migrate an toàn. */
  version: number;
  site: SiteMeta;
  news: NewsPost[];
};

export const CONTENT_VERSION = 1;

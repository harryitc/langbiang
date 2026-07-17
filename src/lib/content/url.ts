// Tiện ích URL cho SEO/JSON-LD.
// Ảnh trong store có thể là đường dẫn nội bộ ("/og.jpg") hoặc URL tuyệt đối
// (khi tải lên Vercel Blob) — JSON-LD/OG luôn cần URL tuyệt đối.
import { site } from "@/lib/site";

/** Trả về URL tuyệt đối cho một đường dẫn ảnh/trang. */
export function absoluteUrl(path: string): string {
  if (!path) return site.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

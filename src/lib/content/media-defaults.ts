// Kho ảnh mặc định — nạp sẵn các ảnh đang có trong web (/public) để chọn lại
// được ngay. Ảnh upload mới sẽ được thêm vào kho khi lưu.
import { gallery, news, board } from "@/lib/site";
import { gallery2025 } from "@/lib/gallery2025";
import type { MediaAlbum, MediaItem, MediaLibrary } from "./media";

// Id album cố định (để ảnh nạp sẵn gắn vào đúng album).
export const GALLERY_ALBUM_ID = "alb-thu-vien";
export const NEWS_ALBUM_ID = "alb-tin-tuc";
export const TEAM_ALBUM_ID = "alb-ban-to-chuc";
export const Y2025_ALBUM_ID = "alb-mua-2025";
/** Ảnh khách tự tải lên khi điền form đăng ký (ô nhập kiểu "Ảnh"). */
export const VOLUNTEER_ALBUM_ID = "alb-tnv";
export const MISC_ALBUM_ID = "alb-khac";

const albums: MediaAlbum[] = [
  { id: GALLERY_ALBUM_ID, name: "Thư viện chính", system: true },
  { id: NEWS_ALBUM_ID, name: "Tin tức", system: true },
  { id: TEAM_ALBUM_ID, name: "Ban tổ chức", system: true },
  { id: Y2025_ALBUM_ID, name: "Mùa 2025", system: true },
  { id: VOLUNTEER_ALBUM_ID, name: "Tình nguyện viên", system: true },
  { id: MISC_ALBUM_ID, name: "Khác", system: true },
];

/** Tên tệp từ đường dẫn (phần cuối). */
function baseName(path: string): string {
  const clean = path.split("?")[0];
  return clean.substring(clean.lastIndexOf("/") + 1) || clean;
}

/** Id ổn định cho ảnh nạp sẵn (theo đường dẫn). */
function seedId(path: string): string {
  return "seed-" + path.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Tạo item nạp sẵn từ 1 đường dẫn /public. */
function seedItem(src: string, albumId: string): MediaItem {
  return { id: seedId(src), url: src, name: baseName(src), albumId, seeded: true };
}

// Gom nguồn ảnh hiện có, khử trùng theo url.
const seen = new Set<string>();
const items: MediaItem[] = [];
function push(src: string | undefined, albumId: string) {
  if (!src || seen.has(src)) return;
  seen.add(src);
  items.push(seedItem(src, albumId));
}

// Thư viện chính (trang chủ) + vài ảnh nền/thương hiệu.
gallery.forEach((g) => push(g.src, GALLERY_ALBUM_ID));
["/og.jpg", "/logo-mark.png", "/gallery/team.jpg"].forEach((s) =>
  push(s, MISC_ALBUM_ID)
);
// Tin tức.
news.forEach((n) => push(n.img, NEWS_ALBUM_ID));
// Ban tổ chức (ảnh sáng lập).
board.founders.forEach((m) => push(m.photo, TEAM_ALBUM_ID));
// Toàn bộ ảnh mùa 2025.
gallery2025.forEach((g) => push(g.src, Y2025_ALBUM_ID));

export const defaultMediaLibrary: MediaLibrary = {
  version: 1,
  albums,
  items,
};

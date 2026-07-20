// Kho ảnh tập trung (media library) — lưu trên Upstash Redis.
// Ảnh được tổ chức theo "album" (folder). Mọi trường ảnh trong CMS chọn ảnh
// từ kho này; ảnh upload mới cũng vào kho trước rồi mới lấy ra dùng.
import { redis } from "@/lib/redis";
import { defaultMediaLibrary, MISC_ALBUM_ID } from "./media-defaults";

/** Một album (folder) trong kho ảnh. */
export type MediaAlbum = {
  id: string;
  name: string;
  /** Album mặc định (nạp sẵn) — không cho xoá. */
  system?: boolean;
};

/** Một ảnh trong kho. */
export type MediaItem = {
  id: string;
  url: string;
  name: string;
  /** Album chứa ảnh. */
  albumId: string;
  /** Ảnh nạp sẵn từ /public (không xoá được file thật lúc runtime). */
  seeded?: boolean;
  /** Thời điểm thêm (ISO) — chỉ có với ảnh upload. */
  addedAt?: string;
};

export type MediaLibrary = {
  version: number;
  albums: MediaAlbum[];
  items: MediaItem[];
};

const MEDIA_KEY = "media:library";
export const MEDIA_VERSION = 1;

/** Đọc kho ảnh; rỗng/lỗi → trả kho mặc định (đã nạp sẵn ảnh /public). */
export async function getMediaLibrary(): Promise<MediaLibrary> {
  try {
    const raw = await redis.get<MediaLibrary>(MEDIA_KEY);
    if (raw && Array.isArray(raw.albums) && Array.isArray(raw.items)) {
      // Kho đã lưu từ trước có thể thiếu album mặc định mới thêm về sau
      // (vd "Tình nguyện viên") — bù vào để chỗ nào cũng chọn được.
      const co = new Set(raw.albums.map((a) => a.id));
      const thieu = defaultMediaLibrary.albums.filter((a) => !co.has(a.id));
      return thieu.length ? { ...raw, albums: [...raw.albums, ...thieu] } : raw;
    }
  } catch {
    // lỗi Redis -> dùng mặc định
  }
  return defaultMediaLibrary;
}

/** Ghi lại toàn bộ kho ảnh. */
export async function saveMediaLibrary(lib: MediaLibrary): Promise<void> {
  await redis.set(MEDIA_KEY, { ...lib, version: MEDIA_VERSION });
}

/** Album đích khi xoá album chứa ảnh (dồn ảnh về "Khác"). */
export const FALLBACK_ALBUM_ID = MISC_ALBUM_ID;

/**
 * Thêm 1 ảnh vào kho — HÀM NỘI BỘ, KHÔNG kiểm tra quyền.
 *
 * Chỉ được gọi từ mã server đã tự chịu trách nhiệm về quyền:
 *  - `addMediaAction` (media-actions.ts) — vẫn bắt buộc đăng nhập admin;
 *  - `submitRegistrationAction` — khách gửi form có ô ảnh, ảnh được xếp vào
 *    album "Tình nguyện viên". Đây là con đường DUY NHẤT khách chạm tới kho ảnh
 *    và chỉ thêm được đúng ảnh vừa tải lên kèm đăng ký.
 * Tuyệt đối không export hàm này ra client.
 */
export async function addMediaItem(input: {
  url: string;
  name: string;
  albumId: string;
}): Promise<MediaItem | null> {
  const url = input.url.trim();
  if (!url) return null;
  const lib = await getMediaLibrary();
  const albumId = lib.albums.some((a) => a.id === input.albumId)
    ? input.albumId
    : FALLBACK_ALBUM_ID;
  const item: MediaItem = {
    id: crypto.randomUUID(),
    url,
    name: input.name.trim() || "anh",
    albumId,
    addedAt: new Date().toISOString(),
  };
  await saveMediaLibrary({ ...lib, items: [item, ...lib.items] });
  return item;
}

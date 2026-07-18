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
      return raw;
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

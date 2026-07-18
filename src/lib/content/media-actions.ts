"use server";

// Server actions quản lý kho ảnh. Mọi action kiểm isAdmin() trước.
import { del } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-auth";
import {
  getMediaLibrary,
  saveMediaLibrary,
  FALLBACK_ALBUM_ID,
  type MediaItem,
  type MediaLibrary,
} from "./media";

export type MediaResult<T = undefined> = {
  ok: boolean;
  error?: string;
  data?: T;
};

async function guard(): Promise<boolean> {
  return isAdmin();
}

/** Là URL do Vercel Blob cấp (mới xoá được file thật). */
function isBlobUrl(url: string): boolean {
  return url.includes(".blob.vercel-storage.com");
}

/** Đọc toàn bộ kho ảnh (cho client hiển thị). */
export async function getMediaAction(): Promise<MediaResult<MediaLibrary>> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  return { ok: true, data: await getMediaLibrary() };
}

/** Thêm 1 ảnh vào kho (sau khi đã upload lên Blob). */
export async function addMediaAction(input: {
  url: string;
  name: string;
  albumId: string;
}): Promise<MediaResult<MediaItem>> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  if (!input.url.trim()) return { ok: false, error: "Thiếu đường dẫn ảnh." };
  const lib = await getMediaLibrary();
  const albumId = lib.albums.some((a) => a.id === input.albumId)
    ? input.albumId
    : FALLBACK_ALBUM_ID;
  const item: MediaItem = {
    id: crypto.randomUUID(),
    url: input.url.trim(),
    name: input.name.trim() || "anh",
    albumId,
    addedAt: new Date().toISOString(),
  };
  await saveMediaLibrary({ ...lib, items: [item, ...lib.items] });
  return { ok: true, data: item };
}

/** Xoá 1 ảnh khỏi kho + xoá file thật trên Blob (nếu là ảnh upload). */
export async function deleteMediaAction(id: string): Promise<MediaResult> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  const lib = await getMediaLibrary();
  const item = lib.items.find((i) => i.id === id);
  if (!item) return { ok: false, error: "Không tìm thấy ảnh." };
  // Xoá file thật (chỉ với ảnh upload lên Blob; ảnh /public nạp sẵn thì bỏ qua).
  if (!item.seeded && isBlobUrl(item.url)) {
    try {
      await del(item.url);
    } catch {
      // File có thể đã bị xoá — vẫn tiếp tục gỡ khỏi kho.
    }
  }
  await saveMediaLibrary({
    ...lib,
    items: lib.items.filter((i) => i.id !== id),
  });
  return { ok: true };
}

/** Chuyển 1 ảnh sang album khác. */
export async function moveMediaAction(
  id: string,
  albumId: string
): Promise<MediaResult> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  const lib = await getMediaLibrary();
  if (!lib.albums.some((a) => a.id === albumId))
    return { ok: false, error: "Album không tồn tại." };
  await saveMediaLibrary({
    ...lib,
    items: lib.items.map((i) => (i.id === id ? { ...i, albumId } : i)),
  });
  return { ok: true };
}

/** Tạo album mới. */
export async function createAlbumAction(name: string): Promise<MediaResult> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Cần nhập tên album." };
  const lib = await getMediaLibrary();
  if (lib.albums.some((a) => a.name.trim().toLowerCase() === trimmed.toLowerCase()))
    return { ok: false, error: "Tên album đã tồn tại." };
  const album = { id: crypto.randomUUID(), name: trimmed };
  await saveMediaLibrary({ ...lib, albums: [...lib.albums, album] });
  return { ok: true };
}

/** Đổi tên album. */
export async function renameAlbumAction(
  id: string,
  name: string
): Promise<MediaResult> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Cần nhập tên album." };
  const lib = await getMediaLibrary();
  await saveMediaLibrary({
    ...lib,
    albums: lib.albums.map((a) => (a.id === id ? { ...a, name: trimmed } : a)),
  });
  return { ok: true };
}

/** Xoá album (chỉ album tự tạo) — dồn ảnh về "Khác". */
export async function deleteAlbumAction(id: string): Promise<MediaResult> {
  if (!(await guard())) return { ok: false, error: "unauthorized" };
  const lib = await getMediaLibrary();
  const album = lib.albums.find((a) => a.id === id);
  if (!album) return { ok: false, error: "Không tìm thấy album." };
  if (album.system) return { ok: false, error: "Không thể xoá album mặc định." };
  await saveMediaLibrary({
    ...lib,
    albums: lib.albums.filter((a) => a.id !== id),
    items: lib.items.map((i) =>
      i.albumId === id ? { ...i, albumId: FALLBACK_ALBUM_ID } : i
    ),
  });
  return { ok: true };
}

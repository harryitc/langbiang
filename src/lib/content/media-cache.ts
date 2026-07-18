"use client";

// Cache client cho kho ảnh: nhiều ImageField mở picker chỉ fetch 1 lần.
// Tự làm mới sau khi có thay đổi (upload/xoá/di chuyển/sửa album).
import { getMediaAction } from "./media-actions";
import type { MediaLibrary } from "./media";

let cache: MediaLibrary | null = null;
let inflight: Promise<MediaLibrary | null> | null = null;

/** Lấy kho ảnh; dùng cache trừ khi force. Gộp các lời gọi song song. */
export async function loadMediaLibrary(force = false): Promise<MediaLibrary | null> {
  if (force) cache = null;
  if (cache) return cache;
  if (!inflight) {
    inflight = getMediaAction()
      .then((res) => {
        if (res.ok && res.data) cache = res.data;
        return cache;
      })
      .catch(() => cache)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Xoá cache (gọi sau khi kho thay đổi). */
export function invalidateMediaCache(): void {
  cache = null;
}

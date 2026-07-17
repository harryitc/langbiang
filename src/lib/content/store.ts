import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { redis } from "@/lib/redis";
import { defaultContent } from "./defaults";
import { CONTENT_VERSION, type SiteContent } from "./schema";

/** Tag để revalidate cache khi xuất bản. */
export const CONTENT_TAG = "content";

// Redis keys: bản đã xuất bản (public thấy) và bản nháp (chỉ admin xem preview).
const PUBLISHED_KEY = "content:published";
const DRAFT_KEY = "content:draft";

/** Trộn dữ liệu lưu trữ với mặc định để luôn đủ field (an toàn khi thêm field mới). */
function normalize(stored: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    version: CONTENT_VERSION,
    site: { ...defaultContent.site, ...(stored?.site ?? {}) },
    news: Array.isArray(stored?.news) && stored.news.length
      ? stored.news
      : defaultContent.news,
  };
}

async function readKey(key: string): Promise<SiteContent | null> {
  try {
    const raw = await redis.get<Partial<SiteContent>>(key);
    return raw ? normalize(raw) : null;
  } catch {
    return null; // Redis lỗi -> để caller fallback về mặc định
  }
}

// Cache bản đã xuất bản theo tag (giữ các trang public ở dạng tĩnh/ISR,
// chỉ làm mới khi bấm Xuất bản qua revalidateTag(CONTENT_TAG)).
const readPublishedCached = unstable_cache(
  async (): Promise<SiteContent> => (await readKey(PUBLISHED_KEY)) ?? defaultContent,
  ["content-published"],
  { tags: [CONTENT_TAG] }
);

/** Nội dung đã xuất bản (fallback: mặc định). Dedupe trong 1 request bằng React cache. */
export const getPublishedContent = cache(async (): Promise<SiteContent> => {
  return readPublishedCached();
});

/** Bản nháp (fallback: bản đã xuất bản -> mặc định). Dùng cho preview. */
export const getDraftContent = cache(async (): Promise<SiteContent> => {
  return (await readKey(DRAFT_KEY)) ?? (await getPublishedContent());
});

/** Lấy nội dung theo chế độ: preview=true đọc bản nháp, ngược lại đọc bản đã xuất bản. */
export async function getContent(preview = false): Promise<SiteContent> {
  return preview ? getDraftContent() : getPublishedContent();
}

/** Ghi bản nháp (khi admin gõ). */
export async function writeDraft(content: SiteContent): Promise<void> {
  await redis.set(DRAFT_KEY, { ...content, version: CONTENT_VERSION });
}

/** Xuất bản: sao chép bản nháp -> bản đã xuất bản. */
export async function publishDraft(): Promise<SiteContent> {
  const draft = (await readKey(DRAFT_KEY)) ?? (await getPublishedContent());
  await redis.set(PUBLISHED_KEY, { ...draft, version: CONTENT_VERSION });
  return draft;
}

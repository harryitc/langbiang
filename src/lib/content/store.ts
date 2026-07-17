// Content store — đọc/ghi nội dung site trên Upstash Redis.
// - published: khách xem (bọc unstable_cache + tag để tĩnh/ISR).
// - draft: admin sửa (autosave), không cache.
// Mọi bản đọc đều normalize() merge lên defaultContent -> site không bao giờ vỡ.
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { redis } from "@/lib/redis";
import { defaultContent } from "./defaults";
import {
  CONTENT_TAG,
  CONTENT_VERSION,
  DRAFT_KEY,
  PUBLISHED_KEY,
  type SiteContent,
} from "./schema";

/** Đọc 1 khoá Redis; lỗi/không có -> null (không làm vỡ site). */
async function readKey(key: string): Promise<unknown> {
  try {
    return (await redis.get(key)) ?? null;
  } catch {
    return null;
  }
}

/** Object thường (không phải mảng/null). */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Merge-deep raw lên base:
 * - object lồng nhau: merge từng khoá.
 * - mảng & giá trị nguyên thuỷ: raw thay thế hoàn toàn (admin toàn quyền danh sách).
 */
function mergeDeep<T>(base: T, raw: unknown): T {
  // Không có dữ liệu (store rỗng / lỗi Redis / thiếu khoá) -> giữ mặc định.
  if (raw === undefined || raw === null) return base;
  if (!isPlainObject(base) || !isPlainObject(raw)) {
    return raw as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base as Record<string, unknown>)) {
    if (key in raw) {
      out[key] = mergeDeep((base as Record<string, unknown>)[key], raw[key]);
    }
  }
  return out as T;
}

/** Chuẩn hoá dữ liệu thô từ store thành SiteContent đầy đủ. */
export function normalize(raw: unknown): SiteContent {
  const merged = mergeDeep(defaultContent, raw);
  return { ...merged, version: CONTENT_VERSION };
}

/* ------------------------------------------------------------------
   Đọc nội dung công khai (khách xem)
   ------------------------------------------------------------------ */
const cachedPublished = unstable_cache(
  async () => normalize(await readKey(PUBLISHED_KEY)),
  ["content-published"],
  { tags: [CONTENT_TAG] }
);

/** Nội dung đã xuất bản (khách xem) — bọc unstable_cache + React cache(). */
export const getPublishedContent = cache(
  (): Promise<SiteContent> => cachedPublished()
);

/** Alias: public luôn đọc bản đã xuất bản. */
export const getContent = getPublishedContent;

/* ------------------------------------------------------------------
   Đọc nội dung nháp (admin) — luôn tươi, không cache
   ------------------------------------------------------------------ */
export async function getDraftContent(): Promise<SiteContent> {
  return normalize(await readKey(DRAFT_KEY));
}

/* ------------------------------------------------------------------
   Ghi nháp theo đường dẫn (vd 'main.stats', 'currentYear', 'news')
   ------------------------------------------------------------------ */
function setByPath(root: SiteContent, path: string, value: unknown): SiteContent {
  const keys = path.split(".").filter(Boolean);
  if (keys.length === 0) return root;
  // clone nông theo nhánh để tránh đột biến state chia sẻ
  const next = { ...(root as unknown as Record<string, unknown>) };
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = cursor[k];
    cursor[k] = isPlainObject(child) ? { ...child } : {};
    cursor = cursor[k] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return next as unknown as SiteContent;
}

/** Ghi 1 nhánh nội dung vào bản nháp. */
export async function writeDraft(
  path: string,
  value: unknown
): Promise<void> {
  const current = await getDraftContent();
  const updated = setByPath(current, path, value);
  await redis.set(DRAFT_KEY, updated);
}

/* ------------------------------------------------------------------
   Xuất bản: copy draft -> published + xoá cache
   ------------------------------------------------------------------ */
export async function publishDraft(): Promise<void> {
  const draft = await getDraftContent();
  await redis.set(PUBLISHED_KEY, { ...draft, version: CONTENT_VERSION });
  // Next 16 yêu cầu profile cacheLife; 'max' = xoá hiệu lực ngay cho tag này.
  revalidateTag(CONTENT_TAG, "max");
  revalidatePath("/", "layout");
}

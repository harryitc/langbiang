import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { redis } from "@/lib/redis";
import { isAdmin } from "@/lib/admin-auth";
import { defaultContent } from "./defaults";
import { CONTENT_VERSION, type SiteContent } from "./schema";

/** Tag để revalidate cache khi xuất bản. */
export const CONTENT_TAG = "content";

const PUBLISHED_KEY = "content:published";
const DRAFT_KEY = "content:draft";

/** Trộn dữ liệu lưu trữ với mặc định để luôn đủ field (an toàn khi thêm field mới). */
function normalize(s: Partial<SiteContent> | null | undefined): SiteContent {
  const d = defaultContent;
  const arr = <T,>(v: unknown, fallback: T[]): T[] =>
    Array.isArray(v) && v.length ? (v as T[]) : fallback;
  return {
    version: CONTENT_VERSION,
    site: { ...d.site, ...(s?.site ?? {}) },
    seasons: arr(s?.seasons, d.seasons),
    stats: arr(s?.stats, d.stats),
    activities: arr(s?.activities, d.activities),
    timeline: arr(s?.timeline, d.timeline),
    gallery: arr(s?.gallery, d.gallery),
    faqs: arr(s?.faqs, d.faqs),
    fundraising: { ...d.fundraising, ...(s?.fundraising ?? {}) },
    volunteerTeams: arr(s?.volunteerTeams, d.volunteerTeams),
    volunteerCount: typeof s?.volunteerCount === "number" ? s.volunteerCount : d.volunteerCount,
    sponsorTiers: arr(s?.sponsorTiers, d.sponsorTiers),
    whyJoin: arr(s?.whyJoin, d.whyJoin),
    news: arr(s?.news, d.news),
    board: { ...d.board, ...(s?.board ?? {}) },
    donations: arr(s?.donations, d.donations),
    testimonials: arr(s?.testimonials, d.testimonials),
    spendingReport: { ...d.spendingReport, ...(s?.spendingReport ?? {}) },
  };
}

async function readKey(key: string): Promise<SiteContent | null> {
  try {
    const raw = await redis.get<Partial<SiteContent>>(key);
    return raw ? normalize(raw) : null;
  } catch {
    return null;
  }
}

// Bản đã xuất bản: cache theo tag -> trang public không phải gọi Redis mỗi request.
const readPublishedCached = unstable_cache(
  async (): Promise<SiteContent> => (await readKey(PUBLISHED_KEY)) ?? defaultContent,
  ["content-published"],
  { tags: [CONTENT_TAG] }
);

export const getPublishedContent = cache((): Promise<SiteContent> => readPublishedCached());

/** Bản nháp (fallback: published -> defaults). Dùng cho preview. */
export const getDraftContent = cache(async (): Promise<SiteContent> => {
  return (await readKey(DRAFT_KEY)) ?? (await getPublishedContent());
});

/**
 * Nội dung cho trang public. Nếu trình duyệt đang bật Draft Mode và là admin
 * -> trả bản nháp (xem trước); ngược lại trả bản đã xuất bản.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    const { isEnabled } = await draftMode();
    if (isEnabled && (await isAdmin())) return getDraftContent();
  } catch {
    /* draftMode() không dùng được ở ngữ cảnh này -> published */
  }
  return getPublishedContent();
});

/** Ghi bản nháp. */
export async function writeDraft(content: SiteContent): Promise<void> {
  await redis.set(DRAFT_KEY, { ...content, version: CONTENT_VERSION });
}

/** Xuất bản: sao chép nháp -> đã xuất bản. */
export async function publishDraft(): Promise<SiteContent> {
  const draft = (await readKey(DRAFT_KEY)) ?? (await getPublishedContent());
  await redis.set(PUBLISHED_KEY, { ...draft, version: CONTENT_VERSION });
  return draft;
}

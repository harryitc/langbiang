// Content store — đọc/ghi nội dung site trên Upstash Redis.
// - published: khách xem (bọc unstable_cache + tag để tĩnh/ISR).
// - draft: admin sửa (autosave), không cache.
// Mọi bản đọc đều normalize() merge lên defaultContent -> site không bao giờ vỡ.
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { revalidatePath, revalidateTag } from "next/cache";
import { redis } from "@/lib/redis";
import { defaultContent, DEFAULT_ROLES } from "./defaults";
import { TEMPLATE_BAO_BTC_ID, TEMPLATE_CAM_ON_ID } from "./email-templates";
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

/**
 * Nâng cấp dữ liệu cũ (< v11) sang cấu trúc nhiều form đăng ký.
 * Trước v11 chỉ có MỘT form nằm ở `main.register`; nay là danh sách
 * `main.registerForms` + `main.activeRegisterFormId`. Bản ghi cũ được chuyển
 * thành form đầu tiên để nội dung admin đã soạn không bị mất.
 */
function migrateRegisterForms(raw: unknown): unknown {
  if (!isPlainObject(raw) || !isPlainObject(raw.main)) return raw;
  const main = raw.main;
  if (!isPlainObject(main.register) || Array.isArray(main.registerForms)) {
    return raw;
  }
  const id = "langbiang-2026";
  return {
    ...raw,
    main: {
      ...main,
      registerForms: [{ id, name: "Langbiang 2026", ...main.register }],
      activeRegisterFormId: main.activeRegisterFormId ?? id,
    },
  };
}

/**
 * Bù mẫu email mặc định cho form soạn từ trước khi có tính năng mẫu email (< v12).
 *
 * Cần bước riêng vì mergeDeep THAY nguyên mảng chứ không trộn từng phần tử:
 * `registerForms` đã lưu trong Redis sẽ đè hẳn lên mặc định, nên form cũ không
 * có mã mẫu nào và hệ quả là KHÔNG email nào được gửi — hỏng âm thầm.
 *
 * Chỉ bù khi khoá VẮNG MẶT. Chuỗi rỗng nghĩa là admin cố ý chọn "Không gửi",
 * bù vào là tự ý bật lại thứ người ta đã tắt.
 */
function migrateEmailTemplates(raw: unknown): unknown {
  if (!isPlainObject(raw) || !isPlainObject(raw.main)) return raw;
  const forms = raw.main.registerForms;
  if (!Array.isArray(forms)) return raw;

  return {
    ...raw,
    main: {
      ...raw.main,
      registerForms: forms.map((f) =>
        isPlainObject(f)
          ? {
              ...f,
              confirmTemplateId:
                "confirmTemplateId" in f ? f.confirmTemplateId : TEMPLATE_CAM_ON_ID,
              notifyTemplateId:
                "notifyTemplateId" in f ? f.notifyTemplateId : TEMPLATE_BAO_BTC_ID,
            }
          : f
      ),
    },
  };
}

/**
 * Gộp vai trò về MỘT nguồn duy nhất (< v15).
 *
 * Trước v15 có hai danh sách rời nhau: `highlights` (thẻ giới thiệu ngoài trang
 * chủ) và `options` của ô nhập kiểu "select" tên "role" (các lựa chọn trong
 * form). Nay chỉ còn `roles`, và ô nhập kiểu "roles" đọc thẳng danh sách đó.
 *
 * Nguyên tắc: KHÔNG đè lên chữ admin đã tự soạn, nhưng cũng không giữ lại thứ
 * chưa ai đụng vào.
 *  - `highlights` vắng/rỗng, HOẶC vẫn y nguyên hai thẻ mặc định thời trước
 *    (chưa ai sửa) -> lấy 4 vai trò Đại sứ mặc định.
 *  - `highlights` đã được sửa -> chuyển nguyên sang `roles`.
 *  - Ô nhập "select" tên "role" -> đổi thành kiểu "roles", bỏ `options` (giờ
 *    lấy từ `roles`). Các ô "select" khác giữ nguyên.
 *
 * Cần bước riêng vì mergeDeep THAY nguyên mảng `registerForms`: dữ liệu cũ
 * trong Redis đè hẳn lên mặc định nên không tự có khoá `roles`.
 */
/**
 * Hai thẻ vai trò mặc định của thời trước v15 — nhận ra để thay bằng 4 vai trò
 * Đại sứ. Đây là chữ do CODE cài sẵn chứ không phải admin gõ ra, nên giữ lại
 * chỉ tổ khiến website hiện danh sách vai trò đã lỗi thời.
 *
 * So bằng TÊN vai trò: mô tả có thể đã bị sửa vặt, nhưng tên còn nguyên cả hai
 * thì gần như chắc chắn chưa ai đụng tới danh sách này.
 */
const THE_MAC_DINH_CU = ["Tình nguyện viên", "Nhà hảo tâm"];

function laTheMacDinhCu(cu: unknown[]): boolean {
  if (cu.length !== THE_MAC_DINH_CU.length) return false;
  return cu.every(
    (t, i) =>
      isPlainObject(t) &&
      typeof t.title === "string" &&
      t.title.trim() === THE_MAC_DINH_CU[i]
  );
}

function migrateAmbassadorRoles(raw: unknown): unknown {
  if (!isPlainObject(raw) || !isPlainObject(raw.main)) return raw;
  const forms = raw.main.registerForms;
  if (!Array.isArray(forms)) return raw;

  return {
    ...raw,
    main: {
      ...raw.main,
      registerForms: forms.map((f) => {
        if (!isPlainObject(f) || Array.isArray(f.roles)) return f;

        const cu = Array.isArray(f.highlights) ? f.highlights : [];
        const roles = cu.length > 0 && !laTheMacDinhCu(cu) ? cu : DEFAULT_ROLES;

        const fields = Array.isArray(f.fields)
          ? f.fields.map((o) =>
              isPlainObject(o) && o.type === "select" && o.name === "role"
                ? { ...o, type: "roles", options: undefined, required: true }
                : o
            )
          : f.fields;

        // Bỏ hẳn khoá cũ để không còn hai nguồn song song.
        const { highlights: _bo, ...conLai } = f;
        return { ...conLai, roles, fields };
      }),
    },
  };
}

/** Chuẩn hoá dữ liệu thô từ store thành SiteContent đầy đủ. */
export function normalize(raw: unknown): SiteContent {
  const migrated = migrateAmbassadorRoles(
    migrateEmailTemplates(migrateRegisterForms(raw))
  );
  const merged = mergeDeep(defaultContent, migrated);

  // Đồng bộ link Shopee 2 chiều giữa main.site.shopee và kênh gây quỹ Shopee
  const shopeeChannel = merged.main.fundraising?.channels?.find(
    (c) => c.icon === "🛒" || c.name?.toLowerCase().includes("shopee")
  );
  const shopeeUrl =
    merged.main.site.shopee?.trim() || shopeeChannel?.href?.trim() || "";

  if (shopeeUrl) {
    merged.main.site.shopee = shopeeUrl;
    if (Array.isArray(merged.main.fundraising?.channels)) {
      merged.main.fundraising.channels = merged.main.fundraising.channels.map(
        (c) => {
          if (c.icon === "🛒" || c.name?.toLowerCase().includes("shopee")) {
            return { ...c, href: shopeeUrl };
          }
          return c;
        }
      );
    }
  }

  return { ...merged, version: CONTENT_VERSION };
}

/* ------------------------------------------------------------------
   Đọc nội dung công khai (khách xem)
   ------------------------------------------------------------------ */
// Khoá cache có kèm CONTENT_VERSION: đổi cấu trúc nội dung (schema) là cache
// cũ tự vô hiệu, tránh phục vụ dữ liệu sai shape từ .next/cache.
const cachedPublished = unstable_cache(
  async () => normalize(await readKey(PUBLISHED_KEY)),
  ["content-published", String(CONTENT_VERSION)],
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
   Ghi nháp theo đường dẫn (vd 'main.gallery', 'currentYear', 'news')
   ------------------------------------------------------------------ */
function setByPath(
  root: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".").filter(Boolean);
  if (keys.length === 0) return root;
  // clone nông theo nhánh để tránh đột biến state chia sẻ
  const next = { ...root };
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = cursor[k];
    cursor[k] = isPlainObject(child) ? { ...child } : {};
    cursor = cursor[k] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
}

/**
 * Ghi 1 nhánh nội dung vào bản nháp.
 * Vá thẳng lên dữ liệu thô trong Redis (không merge lại toàn bộ defaultContent
 * mỗi lần lưu) — nhẹ hơn và lưu bản nháp thưa; khi đọc, normalize() vẫn bù đủ
 * từ defaults nên admin luôn thấy nội dung đầy đủ.
 */
export async function writeDraft(
  path: string,
  value: unknown
): Promise<void> {
  const raw = await readKey(DRAFT_KEY);
  const base: Record<string, unknown> = isPlainObject(raw) ? { ...raw } : {};
  const updated = setByPath(base, path, value);
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

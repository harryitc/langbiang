# Technical Design — Admin CMS (Trăng Sáng Langbiang)

> Tài liệu thiết kế kỹ thuật cho tính năng Admin CMS. Bám theo [PRD](../_prd/admin-cms-nhieu-nam.md) và [FRD](../_prd/frd-admin-cms.md).
> Stack: Next.js 16 (App Router) · React 19 · Upstash Redis · Ant Design v6 · CKEditor 5 · Vercel Blob.
> Cập nhật: 2026-07-17

## 1. Tổng quan kiến trúc

- **Website là khung mẫu**, mọi nội dung đọc từ **content store** (Redis). Không còn import trực tiếp từ `src/lib/site.ts` — file này chỉ còn làm **nguồn dữ liệu mặc định** (migrate 1 lần).
- **Store 2 khoá**: `content:published` (khách xem) và `content:draft` (admin sửa). Admin sửa → ghi draft (autosave). Bấm **Xuất bản** → copy draft sang published + xoá cache.
- **Không có preview**: public chỉ đọc `published`. Draft chỉ hiển thị trong chính các form editor (giá trị đang nhập), không render ra site.
- **Đọc ở public** qua `getContent()` (bọc `unstable_cache` + tag) nên trang vẫn tĩnh/ISR; chỉ refresh khi Xuất bản.
- **Fallback an toàn**: mọi read `normalize()` merge lên `defaultContent` (dựng từ `site.ts`); lỗi Redis → dùng defaults, site không vỡ.

```
Admin UI (Ant Design + CKEditor)
   │  server actions (saveDraft / publish / uploadImage ...)
   ▼
content:draft ──[Xuất bản]──► content:published
                                   │  getContent() + unstable_cache(tag)
                                   ▼
                          Public pages (khung mẫu)
```

## 2. Mô hình dữ liệu

Đặt tại `src/lib/content/schema.ts`. Tái sử dụng các type sẵn có trong `site.ts` (`Sponsor`, `Member`, `Donation`, `Testimonial`, `SpendingItem`, `Photo`…).

```ts
type SiteContent = {
  version: number;
  currentYear: number;        // FR3 — số năm hiện tại
  main: MainContent;          // toàn bộ nội dung trang chính (MỘT bộ)
  pastYears: PastYear[];      // FR4 — danh mục năm đã qua (độc lập)
  news: NewsPost[];           // dòng tin tức, mới nhất trước
};

type MainContent = {
  site: SiteMeta;             // thương hiệu + liên hệ + SEO + OG
  event: { dateLabel: string; dateISO: string; dateEndISO?: string; location: string };
  stats; activities; timeline; gallery;
  whyJoin; faqs; fundraising;
  volunteerTeams; volunteerCount;
  sponsorTiers; board; donations; testimonials; spendingReport;
};

type PastYear = {              // 1 trang "Nhìn lại" = 5 phần
  year: number;                // duy nhất, là đường dẫn /{year}
  title: string; subtitle?: string; eyebrow?: string; bgImage?: string;
  summaryHtml: string;         // Tổng kết — CKEditor (rich text)
  gallery: Photo[];            // Khoảnh khắc
  volunteerTeams: Team[];      // Đại gia đình
  stats: Stat[];               // Những con số
  sponsorTiers: SponsorTier[]; // Nhà tài trợ
};

type NewsPost = {
  id: string; img: string; tag: string; title: string;
  excerpt: string; bodyHtml?: string; link: string; date?: string;
};
```

**Thay đổi so với hiện tại:**
- `NewsPost.body?: string[]` → `bodyHtml?: string` (CKEditor). Khi render: xuất HTML an toàn thay cho map từng đoạn.
- Thêm `PastYear.summaryHtml` (CKEditor).
- Thêm `currentYear` (FR3) và tách `event` để suy ra ngày/JSON-LD/countdown.

## 3. Content store — `src/lib/content/`

| File | Trách nhiệm |
| --- | --- |
| `schema.ts` | Kiểu dữ liệu + `CONTENT_VERSION`, `CONTENT_TAG`, khoá Redis |
| `defaults.ts` | `defaultContent`: migrate `site.ts` → `main`, `gallery2025.ts` + trang `/2025` hiện tại → `pastYears[0]`, `currentYear = 2026` |
| `store.ts` | `readKey` (try/catch→null) · `normalize(raw)` (merge lên defaults) · `getPublishedContent()` (bọc `unstable_cache([CONTENT_TAG])` + React `cache()`) · `getDraftContent()` · `writeDraft()` · `publishDraft()` (copy + `revalidateTag` + `revalidatePath('/', 'layout')`) |
| `actions.ts` | Server actions (mục 6) |

**Publish:**
```ts
export async function publishDraft() {
  if (!(await isAdmin())) throw new Error('unauthorized');
  const draft = (await getDraftContent());
  await redis.set(PUBLISHED_KEY, { ...draft, version: CONTENT_VERSION });
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
}
```

## 4. Đọc nội dung ở public

- `getContent()` = `getPublishedContent()` (không còn nhánh preview).
- Server components/pages gọi `await getContent()` rồi truyền props xuống client components (`News`, `BannerSlider`, `Timeline`…).
- File bị đổi (từ import tĩnh → props): xem mục 9.

## 5. Xác thực — `src/lib/admin-auth.ts`

- So mật khẩu với `ADMIN_PASSWORD` (env). Đăng nhập set cookie `tsl_admin = sha256(password + salt)` (httpOnly, secure, sameSite=lax).
- `isAdmin()` recompute hash & so sánh. Guard trong `src/app/admin/layout.tsx` (redirect `/admin/login` nếu chưa auth).
- `/admin` gắn `robots: noindex`.

## 6. Admin UI — `src/app/admin/`, `src/components/admin/`

**Nền tảng:** cài `antd@^6`, `@ant-design/icons`, `@ant-design/nextjs-registry`, `@ant-design/v5-patch-for-react-19`.
- `AntdProvider`: `AntdRegistry` + `ConfigProvider` (compact, brand `#2e7d32`) + import patch React 19.
- `AdminShell`: `Layout/Sider/Menu` theo `admin-nav.ts` (nhóm: Trang chính · Năm hiện tại · Năm đã qua · Tin tức). Thanh trên: nút **Xuất bản** (có xác nhận) + **Đăng xuất**.

**Editor kit — `editorKit.tsx`:**
- `useSectionAutosave(section, value)`: debounce ~700ms → gọi `saveDraftAction`; trả trạng thái `idle|saving|saved|error` để hiện "Đang lưu…/Đã lưu".
- `ListEditor`: thêm/xoá/kéo-sắp-xếp (dùng antd `List` + dnd) cho các nhóm danh sách.
- `Field`, `ImageField`, `RichText` (bọc CKEditor).

**CKEditor — `RichText.tsx`:**
- Bọc CKEditor 5 (classic build) trong client component; value ↔ `bodyHtml`/`summaryHtml`.
- Upload adapter trỏ tới action ảnh (mục 7) để chèn ảnh trong bài.
- Xuất HTML → **sanitize** trước khi lưu/khi render (chống XSS).

**Server actions — `actions.ts`:**
| Action | Việc |
| --- | --- |
| `saveDraftAction(path, value)` | Kiểm `isAdmin`, validate đường dẫn nội dung, ghi vào draft |
| `publishDraftAction()` | Xuất bản (mục 3) |
| `setCurrentYearAction(year)` | Đổi số năm hiện tại (validate 4 chữ số) |
| `upsertPastYearAction / deletePastYearAction` | Quản lý danh mục năm đã qua |
| `uploadImageAction(file)` | Tải ảnh lên Vercel Blob, trả URL |

## 7. Hình ảnh — Vercel Blob (client upload)

> ⚠️ **Store Blob PHẢI ở chế độ Public.** Store Private trả URL `*.private.blob.vercel-storage.com`
> và khách vãng lai nhận **403** → ảnh không hiện trên site. Chế độ access chốt lúc tạo store.
> (Đã vấp thực tế: store private đầu tiên phải bỏ, tạo lại store public.)

- Cài `@vercel/blob`; cấu hình `BLOB_READ_WRITE_TOKEN` (store **public**).
- **Đi đường client upload, KHÔNG dùng server action:** server action giới hạn body **1MB**, và serverless Vercel chặn cứng **4.5MB** — ảnh thật thường 2–10MB nên sẽ hỏng.
  - Route `src/app/api/admin/blob-upload/route.ts` dùng `handleUpload` cấp client token; `onBeforeGenerateToken` kiểm `isAdmin()` (khách → 401), giới hạn 20MB + chỉ content-type ảnh.
  - `src/lib/content/upload-client.ts` — `uploadImage(file, folder)` gọi `upload()` của `@vercel/blob/client`, trình duyệt đẩy thẳng lên Blob.
- `ImageField`: 2 chế độ — **Tải lên** (qua `uploadImage`) hoặc **Dán URL**; có xem thu nhỏ, xoá/đổi.
- CKEditor dùng chung `uploadImage` qua upload adapter.
- Chưa cấu hình token → route trả **501** kèm thông báo; `ImageField`/CKEditor vẫn dùng được ở chế độ dán URL (FR7-R4).
- `next.config.mjs` khai báo `images.remotePatterns` cho `*.public.blob.vercel-storage.com` — bắt buộc, vì `ban-to-chuc` dùng `next/image` cho ảnh ban tổ chức do admin tải lên.

## 8. Đồng bộ số năm (FR3 + Phụ lục A của FRD)

- **Nhóm A1 (chrome):** thay chuỗi cứng "2026" trong component bằng `content.currentYear`. Cung cấp helper `fillYear(text, year)` thay ký hiệu `{năm}`/`{year}` trong các chuỗi copy do admin nhập.
- **Nhóm A2 (trường sự kiện):** admin nhập `event.dateLabel`, `dateISO`, `dateEndISO`; khuyến khích dùng `{năm}` trong `dateLabel` để đồng bộ.
- **Nhóm A3 (suy ra):** `Countdown` dùng `event.dateISO`; JSON-LD `startDate/endDate/name` suy từ `event` + `currentYear`.
- **Nhóm A4 (năm cũ):** giữ nguyên, thuộc `pastYears`, không đổi theo `currentYear`.

## 9. Nối public vào store (danh sách file đổi)

| File | Đổi |
| --- | --- |
| `src/app/layout.tsx` | `generateMetadata()` + JSON-LD đọc `getContent()` (site + event + currentYear) |
| `src/app/page.tsx` + `src/components/sections/*`, `BannerSlider/DonateBand/Hero/Header/Footer/Countdown/SubPageHeader/ExploreGrid` | Nhận props từ `getContent()`; bỏ chuỗi năm cứng (A1) |
| `src/app/tin-tuc/page.tsx`, `src/app/tin-tuc/[id]/page.tsx` | Đọc `news` từ store; render `bodyHtml`; `generateStaticParams`/`generateMetadata`/JSON-LD/related |
| `src/app/[year]/page.tsx` (**mới**) | Trang "Nhìn lại" động, sinh từ `pastYears`; thay trang `/2025` cứng |
| `src/components/Header.tsx` | Mục "Mùa 2025" → **dropdown "Năm"** liệt kê `pastYears` (mới→cũ) |
| `src/app/sitemap.ts`, `src/app/robots.ts` | Đọc store (news + pastYears); robots chặn `/admin` |
| `src/app/api/likes/[id]/route.ts` | Validate id theo `news` trong store |
| `src/lib/site.ts`, `src/lib/gallery2025.ts` | **Giữ** làm nguồn defaults |

## 10. Phân rã công việc (kỹ thuật)

> Mỗi Epic ~1 commit. Thứ tự: E0 → E1 → E2 → (E3 ∥ E4) → E5 → E6 → E7.

- **E0 — Content store & schema:** `schema.ts`, `defaults.ts` (migrate site.ts + /2025 → pastYears), `store.ts`, `getContent()`. *Verify:* script in JSON store khớp nội dung hiện tại.
- **E1 — Auth:** `admin-auth.ts`, `/admin/login`, guard, `ADMIN_PASSWORD`. *Verify:* chặn khi chưa login.
- **E2 — Admin shell:** antd provider/shell/nav, `editorKit` (autosave, ListEditor, Field), `actions` (saveDraft/publish/setCurrentYear/pastYear), nút Xuất bản. *Verify:* sửa → ghi draft; Xuất bản chạy.
- **E3 — Editors:** toàn bộ nhóm trang chính (2.1–2.15) + `news` (2.16) + editor `pastYears` (5 phần). *Verify:* sửa mỗi nhóm phản ánh sau Xuất bản.
- **E4 — Ảnh + CKEditor:** Vercel Blob, `uploadImageAction`, `ImageField`, `RichText` (CKEditor + upload adapter + sanitize). *Verify:* tải ảnh & bài rich text hiển thị đúng.
- **E5 — Đồng bộ số năm:** `currentYear` + `fillYear` helper; refactor chuỗi A1; suy A3 (Countdown/JSON-LD). *Verify:* đổi năm → mọi vị trí A1/A3 đổi.
- **E6 — Nối public + năm đã qua:** đổi các file mục 9; route động `/[year]`; dropdown năm ở header; sitemap/robots. *Verify:* trang chủ/tin tức/năm đã qua đọc từ store; dropdown đúng.
- **E7 — QA & bàn giao:** edge cases (store rỗng/lỗi → defaults), SEO view-source, `npm run build` sạch type, tài liệu hướng dẫn Ban Tổ chức.

## 11. Kiểm thử tổng thể (end-to-end)

1. `getContent()` khớp nội dung `site.ts` + `/2025` hiện tại (E0).
2. `/admin` → login → sửa 1 field trang chính, 1 bài tin (CKEditor), tải 1 ảnh → autosave "Đã lưu"; public **chưa** đổi.
3. **Xuất bản** → reload public → nội dung mới (không deploy).
4. Đổi **số năm hiện tại** 2026→2027 → Xuất bản → các vị trí A1/A3 hiển thị 2027; A4 (năm cũ) không đổi.
5. Tạo **"Nhìn lại 2026"** (5 phần) → Xuất bản → 2026 vào dropdown năm ở header; `/2026` mở đúng.
6. `npm run build` pass (không type error); `/admin` không vào sitemap, có `noindex`.

## 12. Rủi ro kỹ thuật

- **Ant Design v6 + React 19/Next 16:** đây là lý do nghi ngờ bản cũ bị gỡ; bắt buộc dùng `@ant-design/nextjs-registry` + `v5-patch-for-react-19`, kiểm thử SSR kỹ.
- **CKEditor + SSR:** import động client-only (`ssr: false`); sanitize HTML đầu ra.
- **Blast radius nối props:** đổi ~20 file public; làm gọn trong E6, kiểm `build` sau mỗi bước.
- **Cache vs Xuất bản:** đảm bảo `revalidateTag` + `revalidatePath` chạy đúng để public cập nhật ngay.

// Mô hình dữ liệu cho Content Store (Admin CMS).
// Website là khung mẫu; toàn bộ nội dung đọc từ store này.
// Tái sử dụng các type sẵn có trong src/lib/site.ts để đồng bộ với dữ liệu mặc định.
import type { Sponsor, Member } from "@/lib/site";

export type { Sponsor, Member };

/* ------------------------------------------------------------------
   Các kiểu con dùng chung
   ------------------------------------------------------------------ */

/** Ảnh trong thư viện (gallery) — dùng cho trang chính và trang "Nhìn lại". */
export type Photo = {
  src: string;
  caption?: string;
  desc?: string;
  /** Ảnh cao (chiếm 2 hàng trong lưới masonry). */
  tall?: boolean;
};

/** Một hoạt động (activities) / lý do tham gia (whyJoin). */
export type IconCard = {
  icon: string;
  title: string;
  desc: string;
};

/** Một mốc trong ngày của lịch trình. */
export type TimelineItem = {
  time: string;
  title: string;
  desc: string;
};

/** Một ngày trong lịch trình, gồm nhiều mốc. */
export type TimelineDay = {
  day: string;
  date: string;
  items: TimelineItem[];
};

/** Câu hỏi thường gặp. */
export type Faq = {
  q: string;
  a: string;
};

/** Một kênh gây quỹ. */
export type FundraisingChannel = {
  icon: string;
  name: string;
  note: string;
  cta: string;
  href: string;
  highlight: boolean;
};

/** Khối gây quỹ (đơn + danh sách kênh). */
export type Fundraising = {
  title: string;
  desc: string;
  channels: FundraisingChannel[];
};

/** Một hạng tài trợ + các đơn vị trong hạng. */
export type SponsorTier = {
  tier: string;
  sponsors: Sponsor[];
};

/** Ban tổ chức (sáng lập + thành viên). */
export type Board = {
  founders: Member[];
  members: Member[];
};

/**
 * Báo cáo chi tiêu — không trình bày bảng trên web nữa, chỉ trỏ sang
 * Google Sheet cho tiện cập nhật. Bỏ trống `url` thì phần này tự ẩn.
 */
export type SpendingReport = {
  /** Link Google Sheet báo cáo chi tiêu. */
  url: string;
  /** Ghi chú ngắn hiển thị cạnh nút (tuỳ chọn). Hỗ trợ ký hiệu {năm}. */
  note?: string;
};

/** Thông tin thương hiệu + liên hệ + SEO/OG. */
export type SiteMeta = {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  description: string;
  facebook: string;
  email: string;
  shopee: string;
  keywords: string[];
  ogImage?: string;
};

/** Thông tin sự kiện (năm nằm trong dateLabel qua ký hiệu {năm}). */
export type EventInfo = {
  dateLabel: string;
  dateISO: string;
  dateEndISO?: string;
  location: string;
};

/** Bài tin tức (nội dung dài lưu ở dạng HTML an toàn — CKEditor). */
export type NewsPost = {
  id: string;
  img: string;
  tag: string;
  title: string;
  excerpt: string;
  bodyHtml?: string;
  link: string;
  date?: string;
};

/* ------------------------------------------------------------------
   Nội dung trang chính (một bộ duy nhất)
   ------------------------------------------------------------------ */
export type MainContent = {
  site: SiteMeta;
  event: EventInfo;
  activities: IconCard[];
  timeline: TimelineDay[];
  gallery: Photo[];
  whyJoin: IconCard[];
  faqs: Faq[];
  fundraising: Fundraising;
  sponsorTiers: SponsorTier[];
  board: Board;
  spendingReport: SpendingReport;
};

/* ------------------------------------------------------------------
   Một trang "Nhìn lại" (năm đã qua) — 3 phần
   ------------------------------------------------------------------ */
export type PastYear = {
  /** Năm — duy nhất, là đường dẫn /{year}. */
  year: number;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bgImage?: string;
  /** Tổng kết — rich text (CKEditor). */
  summaryHtml: string;
  gallery: Photo[];
  sponsorTiers: SponsorTier[];
  /** Báo cáo thu – chi của mùa đó (link Google Sheet). Bỏ trống thì ẩn. */
  spendingReport?: SpendingReport;
};

/* ------------------------------------------------------------------
   Toàn bộ nội dung site
   ------------------------------------------------------------------ */
export type SiteContent = {
  version: number;
  /** FR3 — số năm hiện tại, đồng bộ khắp giao diện. */
  currentYear: number;
  main: MainContent;
  /** FR4 — danh mục năm đã qua (độc lập). */
  pastYears: PastYear[];
  /** Dòng tin tức, mới nhất trước. */
  news: NewsPost[];
};

/**
 * Số ảnh tối đa được chiếu trên slideshow trang chủ (BannerSlider).
 * Dùng chung cho cả component hiển thị lẫn editor để hai bên không lệch nhau.
 */
export const SLIDESHOW_LIMIT = 6;

/* ------------------------------------------------------------------
   Hằng số store
   ------------------------------------------------------------------ */
// v2: spendingReport đổi từ bảng {items,total,updatedNote} sang link Google Sheet
// {url,note}; main.sponsorTiers mặc định để trống (tách khỏi dữ liệu mùa 2025).
// v3: bỏ hẳn stats, volunteerTeams/volunteerCount, donations, testimonials
// (cả ở main lẫn pastYears). Phần con người chỉ còn Ban tổ chức (main.board).
// v4: mỗi năm đã qua có báo cáo thu – chi riêng (PastYear.spendingReport).
export const CONTENT_VERSION = 4;
/** Tag cho unstable_cache/revalidateTag. */
export const CONTENT_TAG = "content";
/** Khoá Redis cho bản đã xuất bản (khách xem). */
export const PUBLISHED_KEY = "content:published";
/** Khoá Redis cho bản nháp (admin sửa). */
export const DRAFT_KEY = "content:draft";

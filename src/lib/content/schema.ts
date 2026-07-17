// Mô hình dữ liệu cho Content Store (Admin CMS).
// Website là khung mẫu; toàn bộ nội dung đọc từ store này.
// Tái sử dụng các type sẵn có trong src/lib/site.ts để đồng bộ với dữ liệu mặc định.
import type {
  Sponsor,
  Member,
  Donation,
  Testimonial,
  SpendingItem,
} from "@/lib/site";

export type { Sponsor, Member, Donation, Testimonial, SpendingItem };

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

/** Con số nổi bật. */
export type Stat = {
  value: number;
  suffix: string;
  label: string;
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

/** Một ban tình nguyện viên (tên ban + danh sách thành viên). */
export type Team = {
  name: string;
  members: string[];
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

/** Báo cáo chi tiêu. */
export type SpendingReport = {
  items: SpendingItem[];
  total: string;
  updatedNote: string;
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
  stats: Stat[];
  activities: IconCard[];
  timeline: TimelineDay[];
  gallery: Photo[];
  whyJoin: IconCard[];
  faqs: Faq[];
  fundraising: Fundraising;
  volunteerTeams: Team[];
  volunteerCount: number;
  sponsorTiers: SponsorTier[];
  board: Board;
  donations: Donation[];
  testimonials: Testimonial[];
  spendingReport: SpendingReport;
};

/* ------------------------------------------------------------------
   Một trang "Nhìn lại" (năm đã qua) — 5 phần
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
  volunteerTeams: Team[];
  stats: Stat[];
  sponsorTiers: SponsorTier[];
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

/* ------------------------------------------------------------------
   Hằng số store
   ------------------------------------------------------------------ */
export const CONTENT_VERSION = 1;
/** Tag cho unstable_cache/revalidateTag. */
export const CONTENT_TAG = "content";
/** Khoá Redis cho bản đã xuất bản (khách xem). */
export const PUBLISHED_KEY = "content:published";
/** Khoá Redis cho bản nháp (admin sửa). */
export const DRAFT_KEY = "content:draft";

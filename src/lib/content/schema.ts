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

/** Một thẻ có biểu tượng (activities). */
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
  /** Logo hiển thị ở thanh menu (dùng chung toàn site). */
  logo?: string;
  /**
   * Dòng chữ nhỏ phía TRÊN tiêu đề lớn ở trang chủ.
   * Bỏ trống -> dùng khẩu hiệu (tagline) để không phải nhập lặp.
   */
  heroTagline?: string;
};

/** Thông tin sự kiện (năm nằm trong dateLabel qua ký hiệu {năm}). */
export type EventInfo = {
  dateLabel: string;
  dateISO: string;
  dateEndISO?: string;
  /** Địa điểm chính — dùng cho dữ liệu gửi Google và làm mặc định cho các nơi khác. */
  location: string;
  /** Ghi đè riêng cho chân trang (bỏ trống -> dùng địa điểm chính). */
  locationFooter?: string;
  /** Ghi đè riêng cho mục Lịch trình. */
  locationTimeline?: string;
  /** Ghi đè riêng cho trang Chương trình. */
  locationProgram?: string;
};

/** Mục "Giới thiệu" ở trang chủ (chữ; ảnh nằm ở main.aboutImage). */
export type AboutSection = {
  /** Nhãn nhỏ phía trên tiêu đề. */
  eyebrow: string;
  /** Nửa đầu tiêu đề (chữ thường). */
  title: string;
  /** Nửa sau tiêu đề — được tô màu gradient xanh. */
  titleHighlight: string;
  /** Các đoạn văn giới thiệu, hiển thị theo đúng thứ tự. */
  paragraphs: string[];
  /** Dòng nhỏ trong ô kính trên ảnh (dòng "Mùa N · năm" phía trên tự tính). */
  badgeNote: string;
  /** Chữ trên nút chính (luôn trỏ xuống khối Đăng ký). */
  ctaPrimaryLabel: string;
};

/** Một thẻ nhỏ giới thiệu vai trò ở khối Đăng ký. */
export type RegisterHighlight = {
  icon: string;
  title: string;
  desc: string;
};

/** Kiểu ô nhập của một trường trong form đăng ký. */
export type RegisterFieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "select";

/** Một trường của form đăng ký. */
export type RegisterField = {
  /** Mã trường (name của ô nhập) — không hiển thị cho khách. */
  name: string;
  label: string;
  type: RegisterFieldType;
  placeholder?: string;
  required?: boolean;
  /** Danh sách lựa chọn — chỉ dùng khi type = "select". */
  options?: string[];
};

/** Khối "Đăng ký" ở trang chủ. */
export type RegisterSection = {
  eyebrow: string;
  title: string;
  /** Dòng thứ hai của tiêu đề — in bằng phông chữ viết tay, cỡ lớn hơn. */
  titleHighlight: string;
  description: string;
  highlights: RegisterHighlight[];
  /** Tiêu đề phía trên form. */
  formTitle: string;
  fields: RegisterField[];
  submitLabel: string;
  /** Màn cảm ơn sau khi gửi. */
  successTitle: string;
  successNote: string;
  successAgainLabel: string;
  /** Dòng cuối form: chữ dẫn + nhãn liên kết (đích lấy từ site.facebook). */
  contactNote: string;
  contactLinkLabel: string;
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
  /** 4 ảnh polaroid bay quanh màn hình đầu trang (Hero) — chỉ đổi ảnh, bố cục giữ trong code. */
  heroPhotos: string[];
  /** Ảnh lớn của mục "Giới thiệu" ở trang chủ. */
  aboutImage: string;
  /** Chữ của mục "Giới thiệu" ở trang chủ. */
  about: AboutSection;
  /** Khối "Đăng ký" ở trang chủ (chữ + cấu hình form). */
  register: RegisterSection;
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
// v5: logo, ảnh Hero và ảnh mục Giới thiệu quản lý được từ admin.
// v6: bỏ whyJoin (không trang nào render).
// v7: địa điểm tách riêng cho từng nơi hiển thị (chân trang / lịch trình /
// trang Chương trình), bỏ trống thì dùng địa điểm chính.
// v8: tách chữ ở trang chủ khỏi phần SEO (site.heroTagline).
// v9: chữ mục Giới thiệu (main.about) và khối Đăng ký (main.register) quản lý
// được từ admin — form đăng ký nay render động theo main.register.fields;
// bỏ nút phụ "Vì sao nên tham gia?" ở mục Giới thiệu (trỏ tới khối đã xoá).
export const CONTENT_VERSION = 9;
/** Tag cho unstable_cache/revalidateTag. */
export const CONTENT_TAG = "content";
/** Khoá Redis cho bản đã xuất bản (khách xem). */
export const PUBLISHED_KEY = "content:published";
/** Khoá Redis cho bản nháp (admin sửa). */
export const DRAFT_KEY = "content:draft";

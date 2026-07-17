import type {
  NewsPost,
  Sponsor,
  Member,
  Donation,
  Testimonial,
  SpendingItem,
} from "@/lib/site";

export type { NewsPost, Sponsor, Member, Donation, Testimonial, SpendingItem };

/** Thông tin chung của site (SEO + nhận diện). `url` vẫn lấy từ env. */
export type SiteMeta = {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  dateLabel: string;
  dateISO: string;
  location: string;
  description: string;
  facebook: string;
  email: string;
  shopee: string;
  keywords: string[];
};

/** Một mùa/năm hoạt động — cho phép quản lý xuyên suốt nhiều năm. */
export type Season = {
  year: string;
  label: string;
  dateLabel: string;
  dateISO: string;
  active: boolean;
};

export type Stat = { value: number; suffix: string; label: string };
export type Activity = { icon: string; title: string; desc: string };
export type TimelineItem = { time: string; title: string; desc: string };
export type TimelineDay = { day: string; date: string; items: TimelineItem[] };
export type GalleryItem = { src: string; caption: string; desc: string; tall: boolean };
export type Faq = { q: string; a: string };
export type FundraisingChannel = {
  icon: string;
  name: string;
  note: string;
  cta: string;
  href: string;
  highlight: boolean;
};
export type Fundraising = { title: string; desc: string; channels: FundraisingChannel[] };
export type VolunteerTeam = { name: string; members: string[] };
export type SponsorTier = { tier: string; sponsors: Sponsor[] };
export type WhyJoinItem = { icon: string; title: string; desc: string };
export type Board = { founders: Member[]; members: Member[] };
export type SpendingReport = { items: SpendingItem[]; total: string; updatedNote: string };

/**
 * Toàn bộ nội dung động của website. Là nguồn sự thật khi có bản lưu trong Redis;
 * nếu trống -> fallback về `defaultContent` (lấy từ site.ts) nên site không bao giờ vỡ.
 */
export type SiteContent = {
  version: number;
  site: SiteMeta;
  seasons: Season[];
  stats: Stat[];
  activities: Activity[];
  timeline: TimelineDay[];
  gallery: GalleryItem[];
  faqs: Faq[];
  fundraising: Fundraising;
  volunteerTeams: VolunteerTeam[];
  volunteerCount: number;
  sponsorTiers: SponsorTier[];
  whyJoin: WhyJoinItem[];
  news: NewsPost[];
  board: Board;
  donations: Donation[];
  testimonials: Testimonial[];
  spendingReport: SpendingReport;
};

/** Các khoá phần nội dung có thể lưu độc lập (dùng cho saveSectionDraftAction). */
export const SECTION_KEYS = [
  "site",
  "seasons",
  "stats",
  "activities",
  "timeline",
  "gallery",
  "faqs",
  "fundraising",
  "volunteerTeams",
  "volunteerCount",
  "sponsorTiers",
  "whyJoin",
  "news",
  "board",
  "donations",
  "testimonials",
  "spendingReport",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export const CONTENT_VERSION = 1;

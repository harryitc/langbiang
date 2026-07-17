import {
  activities,
  board,
  donations,
  faqs,
  fundraising,
  gallery,
  news,
  site,
  spendingReport,
  sponsorTiers,
  stats,
  testimonials,
  timeline,
  volunteerCount,
  volunteerTeams,
  whyJoin,
} from "@/lib/site";
import { CONTENT_VERSION, type SiteContent } from "./schema";

/**
 * Giá trị mặc định = nội dung đang có trong site.ts.
 * "Lưới an toàn": nếu Redis trống/lỗi, website vẫn hiển thị đầy đủ.
 */
export const defaultContent: SiteContent = {
  version: CONTENT_VERSION,
  site: {
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    subtitle: site.subtitle,
    dateLabel: site.dateLabel,
    dateISO: site.dateISO,
    location: site.location,
    description: site.description,
    facebook: site.facebook,
    email: site.email,
    shopee: site.shopee,
    keywords: [...site.keywords],
  },
  seasons: [
    { year: "2025", label: "Mùa 2025 — Mùa đầu tiên", dateLabel: "Tháng 9, 2025", dateISO: "2025-09-20", active: false },
    { year: "2026", label: "Mùa 2026", dateLabel: site.dateLabel, dateISO: site.dateISO, active: true },
  ],
  stats: stats.map((s) => ({ ...s })),
  activities: activities.map((a) => ({ ...a })),
  timeline: timeline.map((d) => ({ ...d, items: d.items.map((i) => ({ ...i })) })),
  gallery: gallery.map((g) => ({ ...g })),
  faqs: faqs.map((f) => ({ ...f })),
  fundraising: { ...fundraising, channels: fundraising.channels.map((c) => ({ ...c })) },
  volunteerTeams: volunteerTeams.map((t) => ({ ...t, members: [...t.members] })),
  volunteerCount,
  sponsorTiers: sponsorTiers.map((t) => ({ ...t, sponsors: t.sponsors.map((s) => ({ ...s })) })),
  whyJoin: whyJoin.map((w) => ({ ...w })),
  news: news.map((n) => ({ ...n, body: n.body ? [...n.body] : undefined })),
  board: {
    founders: board.founders.map((m) => ({ ...m })),
    members: board.members.map((m) => ({ ...m })),
  },
  donations: donations.map((d) => ({ ...d })),
  testimonials: testimonials.map((t) => ({ ...t })),
  spendingReport: { ...spendingReport, items: spendingReport.items.map((i) => ({ ...i })) },
};

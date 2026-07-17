// defaultContent — nội dung mặc định, migrate 1 lần từ src/lib/site.ts,
// src/lib/gallery2025.ts và trang /2025 hiện tại. Dùng làm fallback an toàn:
// mọi bản đọc từ Redis đều merge-deep lên đây nên site không bao giờ "vỡ".
import {
  site,
  stats,
  activities,
  timeline,
  gallery,
  faqs,
  fundraising,
  volunteerTeams,
  volunteerCount,
  sponsorTiers,
  whyJoin,
  board,
  donations,
  testimonials,
  spendingReport,
  news as siteNews,
} from "@/lib/site";
import { gallery2025 } from "@/lib/gallery2025";
import { CONTENT_VERSION, type Photo, type SiteContent } from "./schema";

/** Nối các đoạn văn thành HTML an toàn (body: string[] -> bodyHtml). */
function paragraphsToHtml(paras: string[]): string {
  return paras.map((p) => `<p>${p}</p>`).join("");
}

/** Ảnh thư viện 2025 (as const, readonly) -> Photo[] có thể chỉnh sửa. */
const gallery2025Photos: Photo[] = gallery2025.map((g) => ({
  src: g.src,
  caption: g.caption,
  tall: g.tall,
}));

/**
 * Tổng kết mùa 2025 (rich text) — chuyển từ nội dung trang /2025 (Summary.tsx)
 * sang HTML để lưu trong store và render bằng CKEditor.
 */
const summary2025Html = paragraphsToHtml([
  "<strong>“Trăng Sáng LangBiang 2025”</strong> đã chính thức khép lại, để lại phía sau là một mùa Trung Thu ngập tràn tiếng cười, những cái ôm thật chặt và ánh mắt lấp lánh hạnh phúc của các em nhỏ nơi núi rừng LangBiang.",
  "Mỗi chiếc lồng đèn được thắp sáng, mỗi phần quà được trao tận tay, mỗi trò chơi, mỗi tiết mục văn nghệ hay từng bữa ăn sẻ chia đều là những mảnh ghép tạo nên một bức tranh đầy yêu thương.",
  "Ban Tổ chức xin gửi lời tri ân chân thành và sâu sắc nhất đến tất cả Quý Nhà tài trợ, Quý Đơn vị đồng hành và những cá nhân đã dành sự tin tưởng, sẻ chia để cùng chúng tôi mang yêu thương đến với các em nhỏ.",
  "Xin cảm ơn tất cả các anh chị tình nguyện viên đã dành thời gian, công sức và cả trái tim để chuẩn bị từng phần quà, dựng sân khấu, tổ chức các hoạt động và mang đến những nụ cười rạng rỡ cho các em nhỏ.",
  "Hẹn gặp lại trong những hành trình thiện nguyện tiếp theo, nơi yêu thương sẽ tiếp tục được trao đi và hy vọng sẽ tiếp tục được thắp sáng. 🌕💙",
]);

export const defaultContent: SiteContent = {
  version: CONTENT_VERSION,
  currentYear: 2026,

  main: {
    site: {
      name: site.name,
      shortName: site.shortName,
      tagline: site.tagline,
      subtitle: site.subtitle,
      description: site.description,
      facebook: site.facebook,
      email: site.email,
      shopee: site.shopee,
      keywords: [...site.keywords],
      ogImage: "/og.jpg",
    },
    // Nhãn ngày dùng ký hiệu {năm} để đồng bộ theo currentYear (FR3/A2).
    event: {
      dateLabel: "Ngày 26 – 27 tháng 9 năm {năm}",
      dateISO: site.dateISO,
      dateEndISO: "2026-09-27",
      location: site.location,
    },
    stats: stats.map((s) => ({ ...s })),
    activities: activities.map((a) => ({ ...a })),
    timeline: timeline.map((d) => ({
      day: d.day,
      date: d.date,
      items: d.items.map((it) => ({ ...it })),
    })),
    gallery: gallery.map((g) => ({ ...g })),
    whyJoin: whyJoin.map((w) => ({ ...w })),
    faqs: faqs.map((f) => ({ ...f })),
    fundraising: {
      title: fundraising.title,
      desc: fundraising.desc,
      channels: fundraising.channels.map((c) => ({ ...c })),
    },
    volunteerTeams: volunteerTeams.map((t) => ({
      name: t.name,
      members: [...t.members],
    })),
    volunteerCount,
    sponsorTiers: sponsorTiers.map((t) => ({
      tier: t.tier,
      sponsors: t.sponsors.map((s) => ({ ...s })),
    })),
    board: {
      founders: board.founders.map((m) => ({ ...m })),
      members: board.members.map((m) => ({ ...m })),
    },
    donations: donations.map((d) => ({ ...d })),
    testimonials: testimonials.map((t) => ({ ...t })),
    spendingReport: {
      items: spendingReport.items.map((i) => ({ ...i })),
      total: spendingReport.total,
      updatedNote: spendingReport.updatedNote,
    },
  },

  // FR4 — năm đã qua. pastYears[0] = mùa 2025 (từ /2025 + gallery2025).
  pastYears: [
    {
      year: 2025,
      title: "Nhìn lại mùa 2025",
      subtitle:
        "Mùa Trăng Sáng Langbiang đầu tiên — nơi những tấm lòng gặp nhau và viết nên một câu chuyện thật đẹp giữa cao nguyên.",
      eyebrow: "Hồi ức",
      bgImage: "/gallery/team.jpg",
      summaryHtml: summary2025Html,
      gallery: gallery2025Photos,
      volunteerTeams: volunteerTeams.map((t) => ({
        name: t.name,
        members: [...t.members],
      })),
      stats: stats.map((s) => ({ ...s })),
      sponsorTiers: sponsorTiers.map((t) => ({
        tier: t.tier,
        sponsors: t.sponsors.map((s) => ({ ...s })),
      })),
    },
  ],

  // Tin tức — chuyển body: string[] -> bodyHtml.
  news: siteNews.map((n) => ({
    id: n.id,
    img: n.img,
    tag: n.tag,
    title: n.title,
    excerpt: n.excerpt,
    bodyHtml: n.body ? paragraphsToHtml(n.body) : undefined,
    link: n.link,
  })),
};

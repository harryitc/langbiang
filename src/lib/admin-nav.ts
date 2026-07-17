/** Cấu trúc điều hướng của portal quản trị (dùng chung cho Sider menu). */
export type AdminNavItem = { key: string; label: string; href: string; icon?: string };
export type AdminNavGroup = { label: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Tổng quan",
    items: [{ key: "dashboard", label: "Bảng điều khiển", href: "/admin", icon: "dashboard" }],
  },
  {
    label: "Chung",
    items: [
      { key: "site", label: "Thông tin & SEO", href: "/admin/site", icon: "global" },
      { key: "seasons", label: "Mùa / Năm", href: "/admin/seasons", icon: "calendar" },
    ],
  },
  {
    label: "Trang chủ",
    items: [
      { key: "news", label: "Tin tức", href: "/admin/news", icon: "read" },
      { key: "faqs", label: "Câu hỏi (FAQ)", href: "/admin/faqs", icon: "question" },
    ],
  },
  {
    label: "Chương trình",
    items: [
      { key: "activities", label: "Hoạt động", href: "/admin/activities", icon: "appstore" },
      { key: "timeline", label: "Lịch trình", href: "/admin/timeline", icon: "schedule" },
      { key: "why-join", label: "Lý do tham gia", href: "/admin/why-join", icon: "heart" },
      { key: "stats", label: "Con số nổi bật", href: "/admin/stats", icon: "bar" },
    ],
  },
  {
    label: "Mùa 2025 (hồi ức)",
    items: [
      { key: "gallery", label: "Thư viện ảnh", href: "/admin/gallery", icon: "picture" },
      { key: "sponsors", label: "Nhà tài trợ", href: "/admin/sponsors", icon: "trophy" },
      { key: "volunteers", label: "Tình nguyện viên", href: "/admin/volunteers", icon: "team" },
    ],
  },
  {
    label: "Ban tổ chức",
    items: [{ key: "board", label: "Sáng lập & thành viên", href: "/admin/board", icon: "crown" }],
  },
  {
    label: "Gây quỹ & Minh bạch",
    items: [
      { key: "fundraising", label: "Kênh gây quỹ", href: "/admin/fundraising", icon: "shop" },
      { key: "donations", label: "Danh sách đóng góp", href: "/admin/donations", icon: "gift" },
      { key: "spending", label: "Báo cáo chi", href: "/admin/spending", icon: "audit" },
    ],
  },
  {
    label: "Cộng đồng",
    items: [{ key: "testimonials", label: "Cảm nhận TNV", href: "/admin/testimonials", icon: "message" }],
  },
];

/** Tất cả item phẳng (tiện tra cứu tiêu đề theo pathname). */
export const ADMIN_NAV_FLAT = ADMIN_NAV.flatMap((g) => g.items);

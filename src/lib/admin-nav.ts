// Cấu trúc menu khu quản trị. Mỗi item tương ứng route /admin/<slug>.
export type AdminNavItem = {
  slug: string;
  label: string;
  /** Emoji biểu tượng (hiển thị trước nhãn menu). */
  icon?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Trang chính",
    items: [
      { slug: "thuong-hieu", label: "Thương hiệu & SEO", icon: "🏷️" },
      { slug: "hoat-dong", label: "Hoạt động", icon: "🎯" },
      { slug: "lich-trinh", label: "Lịch trình", icon: "🗓️" },
      { slug: "thu-vien", label: "Thư viện ảnh", icon: "🖼️" },
      { slug: "ly-do", label: "Lý do tham gia", icon: "💚" },
      { slug: "faq", label: "Câu hỏi thường gặp", icon: "❓" },
      { slug: "gay-quy", label: "Gây quỹ", icon: "🛒" },
      { slug: "tai-tro", label: "Nhà tài trợ", icon: "🤝" },
      { slug: "ban-to-chuc", label: "Ban tổ chức", icon: "👥" },
      { slug: "chi-tieu", label: "Báo cáo chi tiêu", icon: "📊" },
    ],
  },
  {
    label: "Tài nguyên",
    items: [{ slug: "kho-anh", label: "Kho ảnh", icon: "🗂️" }],
  },
  {
    label: "Năm hiện tại",
    items: [{ slug: "su-kien", label: "Sự kiện & số năm", icon: "📅" }],
  },
  {
    label: "Năm đã qua",
    items: [{ slug: "nam-da-qua", label: "Danh mục năm đã qua", icon: "📚" }],
  },
  {
    label: "Tin tức",
    items: [{ slug: "tin-tuc", label: "Bài tin tức", icon: "📰" }],
  },
];

/** Tất cả item (phẳng) — tiện cho dashboard. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap(
  (g) => g.items
);

// Cấu trúc menu khu quản trị. Mỗi item tương ứng route /admin/<slug>.
export type AdminNavItem = {
  slug: string;
  label: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Trang chính",
    items: [
      { slug: "thuong-hieu", label: "Thương hiệu & SEO" },
      { slug: "hoat-dong", label: "Hoạt động" },
      { slug: "lich-trinh", label: "Lịch trình" },
      { slug: "slideshow", label: "Slideshow trang chủ" },
      { slug: "anh-trang-chu", label: "Ảnh trang chủ (logo, Hero)" },
      { slug: "ly-do", label: "Lý do tham gia" },
      { slug: "faq", label: "Câu hỏi thường gặp" },
      { slug: "gay-quy", label: "Gây quỹ" },
      { slug: "tai-tro", label: "Nhà tài trợ" },
      { slug: "ban-to-chuc", label: "Ban tổ chức" },
      { slug: "chi-tieu", label: "Báo cáo chi tiêu" },
    ],
  },
  {
    label: "Tài nguyên",
    items: [{ slug: "kho-anh", label: "Kho ảnh" }],
  },
  {
    label: "Năm hiện tại",
    items: [{ slug: "su-kien", label: "Sự kiện & số năm" }],
  },
  {
    label: "Năm đã qua",
    items: [{ slug: "nam-da-qua", label: "Danh mục năm đã qua" }],
  },
  {
    label: "Tin tức",
    items: [{ slug: "tin-tuc", label: "Bài tin tức" }],
  },
];

/** Tất cả item (phẳng) — tiện cho dashboard. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap(
  (g) => g.items
);

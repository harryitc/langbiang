// Cấu trúc menu khu quản trị. Mỗi item tương ứng route /admin/<slug>.
// Nhóm theo ĐÚNG TRANG trên website để người biên tập biết ngay "sửa mục này
// thì đổi chỗ nào ngoài web", thay vì nhóm theo cấu trúc dữ liệu.
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
    // Áp dụng cho mọi trang: tên dự án, SEO, logo, số năm hiện tại.
    label: "Chung cả website",
    items: [
      { slug: "thuong-hieu", label: "Thương hiệu & SEO" },
      { slug: "su-kien", label: "Sự kiện & số năm" },
    ],
  },
  {
    label: "Trang chủ",
    items: [
      { slug: "trang-chu", label: "Nội dung trang chủ" },
      { slug: "slideshow", label: "Slideshow" },
      { slug: "dang-ky", label: "Form đăng ký" },
      { slug: "dang-ky-nhan-duoc", label: "Đăng ký nhận được" },
      { slug: "mau-email", label: "Mẫu email" },
      { slug: "gui-email", label: "Gửi email" },
      { slug: "faq", label: "Câu hỏi thường gặp" },
    ],
  },
  {
    label: "Trang Chương trình",
    items: [
      { slug: "hoat-dong", label: "Hoạt động" },
      { slug: "lich-trinh", label: "Lịch trình" },
    ],
  },
  {
    label: "Trang Gây quỹ",
    items: [
      { slug: "gay-quy", label: "Kênh gây quỹ" },
      { slug: "tai-tro", label: "Nhà tài trợ" },
      { slug: "chi-tieu", label: "Báo cáo thu – chi" },
    ],
  },
  {
    label: "Trang Ban tổ chức",
    items: [{ slug: "ban-to-chuc", label: "Thành viên" }],
  },
  {
    label: "Trang Tin tức",
    items: [{ slug: "tin-tuc", label: "Bài viết" }],
  },
  {
    label: "Các năm đã qua",
    items: [{ slug: "nam-da-qua", label: "Danh mục năm" }],
  },
  {
    // Không hiển thị trực tiếp trên web — kho dùng chung cho mọi trường ảnh.
    label: "Công cụ",
    items: [{ slug: "kho-anh", label: "Kho ảnh" }],
  },
];

/** Tất cả item (phẳng) — tiện cho dashboard. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap(
  (g) => g.items
);

/** Nhóm chứa slug (dùng cho breadcrumb). */
export function findNavGroup(slug: string): AdminNavGroup | undefined {
  return ADMIN_NAV.find((g) => g.items.some((it) => it.slug === slug));
}

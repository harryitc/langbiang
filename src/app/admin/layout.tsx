// Layout gốc khu quản trị: chặn lập chỉ mục (FR1-R3).
// Guard đăng nhập nằm ở nhóm route (quan-tri) để trang /admin/login không bị
// chuyển hướng về chính nó (vòng lặp).
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Khu quản trị chỉ có giao diện SÁNG (Antd theme light cố định). Nhưng class
// `.dark` được gắn lên <html> cho toàn site theo tuỳ chọn hệ điều hành, khiến
// các biến thể `dark:` của Tailwind (kể cả ở component dùng chung như trình cắt
// ảnh) bật lên trong admin — ví dụ đường kẻ sidebar kho ảnh bị đen. Gỡ `.dark`
// ngay khi vào admin để mọi thứ luôn sáng; trang public không bị ảnh hưởng vì nó
// tự bật lại theo localStorage khi tải lại.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';`,
        }}
      />
      {children}
    </>
  );
}

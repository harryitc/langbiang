// Layout gốc khu quản trị: chặn lập chỉ mục (FR1-R3).
// Guard đăng nhập nằm ở nhóm route (quan-tri) để trang /admin/login không bị
// chuyển hướng về chính nó (vòng lặp).
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}

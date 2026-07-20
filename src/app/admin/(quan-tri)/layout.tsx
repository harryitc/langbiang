// Layout cho các trang quản trị đã đăng nhập: guard + khung Ant Design.
// Đặt AntdProvider/AdminShell ở layout (thay vì lặp trong từng page) để menu
// không bị dựng lại mỗi lần chuyển trang.
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import AntdProvider from "@/components/admin/AntdProvider";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <AntdProvider>
      <AdminShell>{children}</AdminShell>
    </AntdProvider>
  );
}

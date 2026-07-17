// Trang đăng nhập khu quản trị (FR1). Đã đăng nhập thì vào thẳng /admin.
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import AntdProvider from "@/components/admin/AntdProvider";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <AntdProvider>
      <LoginForm />
    </AntdProvider>
  );
}

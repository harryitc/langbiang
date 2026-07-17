// Bảng điều khiển quản trị: liệt kê các nhóm nội dung + số năm hiện tại.
import { getDraftContent } from "@/lib/content/store";
import DashboardHome from "@/components/admin/DashboardHome";

export default async function AdminDashboard() {
  const content = await getDraftContent();
  return <DashboardHome currentYear={content.currentYear} />;
}

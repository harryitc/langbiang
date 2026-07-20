// Trang quản trị: xem lại các lượt khách đã đăng ký ở form trang chủ.
// Chỉ đọc — không sửa, không xoá. Trang nằm trong khu đã đăng nhập nên dữ liệu
// không lộ ra ngoài.
import { isAdmin } from "@/lib/admin-auth";
import { getDraftContent } from "@/lib/content/store";
import { listRegistrations } from "@/lib/content/registrations";
import RegistrationsView from "@/components/admin/RegistrationsView";

// Luôn đọc mới (danh sách đăng ký thay đổi liên tục).
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdmin())) return null;

  const [{ main }, items] = await Promise.all([
    getDraftContent(),
    listRegistrations(),
  ]);

  return (
    <RegistrationsView
      items={items}
      fields={main.register.fields.map((f) => ({
        name: f.name,
        label: f.label.trim() || f.name,
      }))}
      recipientEmail={main.register.recipientEmail || main.site.email || ""}
    />
  );
}

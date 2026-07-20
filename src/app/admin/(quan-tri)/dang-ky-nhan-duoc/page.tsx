// Trang quản trị: xem lại các lượt khách đã đăng ký, TÁCH RIÊNG THEO TỪNG FORM.
// Chỉ đọc — không sửa, không xoá. Trang nằm trong khu đã đăng nhập nên dữ liệu
// không lộ ra ngoài.
import { isAdmin } from "@/lib/admin-auth";
import { getDraftContent } from "@/lib/content/store";
import { listRegistrations } from "@/lib/content/registrations";
import RegistrationsView from "@/components/admin/RegistrationsView";
import { activeRegisterForm } from "@/lib/content/schema";

// Luôn đọc mới (danh sách đăng ký thay đổi liên tục).
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>;
}) {
  if (!(await isAdmin())) return null;

  const [{ main }, { form: formParam }] = await Promise.all([
    getDraftContent(),
    searchParams,
  ]);

  const forms = main.registerForms;
  // Chưa chọn gì -> mở sẵn form đang hiển thị ở trang chủ.
  const dangXem =
    forms.find((f) => f.id === formParam) ??
    activeRegisterForm(forms, main.activeRegisterFormId);

  if (!dangXem) return null;

  const items = await listRegistrations(dangXem.id);

  return (
    <RegistrationsView
      forms={forms.map((f) => ({
        id: f.id,
        name: f.name.trim() || f.id,
      }))}
      currentFormId={dangXem.id}
      currentFormName={dangXem.name.trim() || dangXem.id}
      items={items}
      fields={dangXem.fields.map((f) => ({
        name: f.name,
        label: f.label.trim() || f.name,
        type: f.type,
      }))}
      recipientEmail={dangXem.recipientEmail || main.site.email || ""}
    />
  );
}

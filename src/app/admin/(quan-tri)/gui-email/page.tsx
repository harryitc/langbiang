// Trang quản trị: Ban tổ chức tự soạn lượt gửi email cho người đăng ký, cho
// toàn bộ một form, hoặc cho địa chỉ tự nhập (nhà tài trợ, đối tác).
//
// Trang chỉ CHUẨN BỊ dữ liệu để hiện ra; việc quyết định gửi cho ai nằm trọn ở
// máy chủ, trong `email-send-actions.ts`.
import { isAdmin } from "@/lib/admin-auth";
import { getDraftContent } from "@/lib/content/store";
import { listRegistrations } from "@/lib/content/registrations";
import { listEmailLogs } from "@/lib/content/email-log";
import { activeRegisterForm } from "@/lib/content/schema";
import { emailNguoiDangKy, tenNguoiDangKy } from "@/lib/content/email-vars";
import GuiEmailView from "@/components/admin/GuiEmailView";

// Luôn đọc mới (danh sách đăng ký và nhật ký gửi thay đổi liên tục).
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ form?: string }>;
}) {
  if (!(await isAdmin())) return null;

  const [content, { form: formParam }] = await Promise.all([
    getDraftContent(),
    searchParams,
  ]);
  const { main, emailTemplates } = content;

  const forms = main.registerForms;
  // Chưa chọn gì -> mở sẵn form đang hiển thị ở trang chủ.
  const dangXem =
    forms.find((f) => f.id === formParam) ??
    activeRegisterForm(forms, main.activeRegisterFormId);

  const items = dangXem ? await listRegistrations(dangXem.id) : [];
  const nhatKy = await listEmailLogs();

  return (
    <GuiEmailView
      forms={forms.map((f) => ({ id: f.id, name: f.name.trim() || f.id }))}
      currentFormId={dangXem?.id ?? ""}
      currentFormName={dangXem ? dangXem.name.trim() || dangXem.id : ""}
      // Chỉ đưa ra trình duyệt đúng ba thông tin cần để chọn người nhận.
      nguoiDaDangKy={
        dangXem
          ? items.map((r) => ({
              at: r.at,
              ten: tenNguoiDangKy(dangXem, r),
              email: emailNguoiDangKy(dangXem, r),
            }))
          : []
      }
      templates={emailTemplates.map((t) => ({
        id: t.id,
        name: t.name.trim() || t.id,
        note: t.note ?? "",
        subject: t.subject,
        bodyHtml: t.bodyHtml,
      }))}
      nhatKy={nhatKy}
    />
  );
}

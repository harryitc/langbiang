// Trang quản trị: Ban tổ chức.
// Đọc bản nháp ở server và danh sách đăng ký rồi truyền xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import { listRegistrations } from "@/lib/content/registrations";
import BoardEditor from "@/components/admin/editors/BoardEditor";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getDraftContent();
  const forms = content.main.registerForms ?? [];

  // Tải danh sách người đăng ký từ tất cả các form
  const registrationsByForm = await Promise.all(
    forms.map(async (f) => {
      const items = await listRegistrations(f.id);
      return items;
    })
  );

  const registrations = registrationsByForm.flat();

  return <BoardEditor initial={content.main.board} registrations={registrations} />;
}

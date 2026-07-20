// Trang quản trị: các form đăng ký (chữ + cấu hình từng form + form nào hiện
// ở trang chủ).
import { getDraftContent } from "@/lib/content/store";
import RegisterEditor from "@/components/admin/editors/RegisterEditor";

export default async function Page() {
  const { main } = await getDraftContent();
  return (
    <RegisterEditor
      initialForms={main.registerForms}
      initialActiveId={main.activeRegisterFormId}
    />
  );
}

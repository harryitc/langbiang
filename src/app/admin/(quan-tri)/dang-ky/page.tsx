// Trang quản trị: khối "Đăng ký" ở trang chủ (chữ + cấu hình form).
import { getDraftContent } from "@/lib/content/store";
import RegisterEditor from "@/components/admin/editors/RegisterEditor";

export default async function Page() {
  const { main } = await getDraftContent();
  return <RegisterEditor initial={main.register} />;
}

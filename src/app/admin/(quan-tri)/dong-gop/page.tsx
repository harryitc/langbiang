// Trang quản trị: Đóng góp.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import DonationsEditor from "@/components/admin/editors/DonationsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <DonationsEditor initial={content.main.donations} />;
}

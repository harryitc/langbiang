// Trang quản trị: Báo cáo chi tiêu.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import SpendingEditor from "@/components/admin/editors/SpendingEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <SpendingEditor initial={content.main.spendingReport} />;
}

// Trang quản trị: Danh mục năm đã qua.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import PastYearsEditor from "@/components/admin/editors/PastYearsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <PastYearsEditor initial={content.pastYears} />;
}

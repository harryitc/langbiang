// Trang quản trị: Hoạt động.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import ActivitiesEditor from "@/components/admin/editors/ActivitiesEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <ActivitiesEditor initial={content.main.activities} />;
}

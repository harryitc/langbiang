// Trang quản trị: Lịch trình.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import TimelineEditor from "@/components/admin/editors/TimelineEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <TimelineEditor initial={content.main.timeline} />;
}

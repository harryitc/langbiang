// Trang quản trị: Sự kiện & số năm.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import EventEditor from "@/components/admin/editors/EventEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <EventEditor initial={{ event: content.main.event, currentYear: content.currentYear }} />;
}

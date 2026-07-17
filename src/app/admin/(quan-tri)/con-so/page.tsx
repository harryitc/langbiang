// Trang quản trị: Con số nổi bật.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import StatsEditor from "@/components/admin/editors/StatsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <StatsEditor initial={content.main.stats} />;
}

// Trang quản trị: Lý do tham gia.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import WhyJoinEditor from "@/components/admin/editors/WhyJoinEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <WhyJoinEditor initial={content.main.whyJoin} />;
}

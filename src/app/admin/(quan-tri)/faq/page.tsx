// Trang quản trị: Câu hỏi thường gặp.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import FaqsEditor from "@/components/admin/editors/FaqsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <FaqsEditor initial={content.main.faqs} />;
}

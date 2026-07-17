// Trang quản trị: Cảm nhận.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import TestimonialsEditor from "@/components/admin/editors/TestimonialsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <TestimonialsEditor initial={content.main.testimonials} />;
}
